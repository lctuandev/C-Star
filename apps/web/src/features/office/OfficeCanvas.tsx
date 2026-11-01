'use client';

import { viewOf, weekActions } from '@cstar/game-core';
import type { GameState, Place } from '@cstar/game-core';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { AdditiveBlending, BufferAttribute, Color, Vector3 } from 'three';
import type { HemisphereLight, Mesh, PerspectiveCamera } from 'three';
import { useGameStore, world } from '@/features/play/game-store';
import { useSettingsStore } from '@/features/settings/settings-store';
import { Character } from './Character';
import { COMFORTABLE_FPS, isTooSlow, MIN_FPS } from './graphics';
import {
  CAMERAS,
  DESKS,
  HOTSPOTS,
  NPC_SEATS,
  PLAYER_DESK,
  PLAYER_HOME,
  PLAYER_STAGE,
  STAGE,
} from './office-layout';
import type { Desk, Hotspot, View } from './office-layout';
import { officeMood } from './office-mood';
import { useOfficeStore } from './office-store';
import { OfficeRoom } from './OfficeRoom';
import { fitView } from './view-fit';

interface Size {
  width: number;
  height: number;
}

/** Eases the lens toward `fov` and shifts the picture into the free window. */
const aimLens = (
  lens: PerspectiveCamera,
  fov: number,
  ease: number,
  size: Size,
  x: number,
  y: number,
) => {
  lens.fov += (fov - lens.fov) * ease;
  lens.setViewOffset(size.width, size.height, x, y, size.width, size.height);
};

const CameraRig = ({ view }: { view: View }) => {
  const frame = useOfficeStore((store) => store.frame);
  const target = useRef(new Vector3(...CAMERAS[view].target));
  const goal = useMemo(() => new Vector3(), []);
  const steady = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useFrame(({ camera, size, clock }, delta) => {
    const pose = CAMERAS[view];
    const ease = 1 - Math.exp(-3 * delta);
    camera.position.lerp(goal.set(...pose.position), ease);
    target.current.lerp(goal.set(...pose.target), ease);
    // A held camera, never quite still, except over a map of places to tap.
    const sway = view === 'overview' || steady ? 0 : 1;
    goal.set(
      target.current.x + Math.sin(clock.elapsedTime * 0.31) * 0.05 * sway,
      target.current.y + Math.sin(clock.elapsedTime * 0.23) * 0.03 * sway,
      target.current.z,
    );
    camera.lookAt(goal);

    const fit = fitView(
      pose.fov,
      size,
      frame ?? { left: 0, top: 0, width: size.width, height: size.height },
    );
    aimLens(camera as PerspectiveCamera, fit.fov, ease, size, fit.offsetX, fit.offsetY);
  });

  return null;
};

/**
 * Judges a stretch of frames at a time. A slow device first loses pixels and dust, and only then
 * the 3D: the 2D screens are still the same world (ADR-005).
 */
const FrameWatch = ({ onLower, onTooSlow }: { onLower: () => void; onTooSlow: () => void }) => {
  const frames = useRef<number[]>([]);
  const lowered = useRef(false);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current) {
      return;
    }
    frames.current.push(delta);
    const verdict = isTooSlow(frames.current, lowered.current ? MIN_FPS : COMFORTABLE_FPS);
    if (verdict === null) {
      return;
    }
    if (verdict && lowered.current) {
      done.current = true;
      onTooSlow();
    } else if (verdict) {
      lowered.current = true;
      frames.current = [];
      onLower();
    } else {
      done.current = true;
    }
  });

  return null;
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

const Ring = ({ spot, open }: { spot: Hotspot; open: boolean }) => {
  const ring = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    ring.current?.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.08);
  });

  return (
    <mesh
      ref={ring}
      position={[spot.stand[0], 0.03, spot.stand[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.28, 0.38, 24]} />
      <meshBasicMaterial color={open ? '#ffc83d' : '#5a6287'} transparent opacity={0.9} />
    </mesh>
  );
};

/** Keeps the DOM labels over their places: crisp, tappable, and readable by a screen reader. */
const LabelTracker = ({ labels }: { labels: RefObject<Map<string, HTMLElement>> }) => {
  const point = useMemo(() => new Vector3(), []);
  const frame = useOfficeStore((store) => store.frame);

  useFrame(({ camera, size }) => {
    const left = frame?.left ?? 0;
    const top = frame?.top ?? 0;
    const right = left + (frame?.width ?? size.width);
    const bottom = top + (frame?.height ?? size.height);
    for (const spot of HOTSPOTS) {
      const label = labels.current.get(spot.actionId);
      if (label) {
        point.set(...spot.position).project(camera);
        // Kept inside the free window: a phone's narrow view would lose the places at the sides.
        const x = clamp(((point.x + 1) / 2) * size.width, left + 60, right - 60);
        const y = clamp(((1 - point.y) / 2) * size.height, top + 24, bottom - 24);
        label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      }
    }
  });

  return null;
};

const DUST = 90;

type Mote = readonly [number, number, number, number];

const drift = (positions: BufferAttribute, motes: readonly Mote[], t: number) => {
  motes.forEach(([x, y, z, phase], index) => {
    positions.setXYZ(
      index,
      x + Math.sin(t + phase) * 0.4,
      y + Math.sin(t * 0.7 + phase * 2) * 0.25,
      z + Math.cos(t * 0.9 + phase) * 0.4,
    );
  });
  positions.needsUpdate = true;
};

/** Motes in the window's light: nothing else in a still room shows that time is passing. */
const Dust = () => {
  const seeds = useMemo(() => {
    const random = (index: number, salt: number) => {
      const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
      return value - Math.floor(value);
    };
    return Array.from({ length: DUST }, (_, index) => [
      -5 + random(index, 1) * 7,
      0.4 + random(index, 2) * 2.1,
      -4.6 + random(index, 3) * 5,
      random(index, 4) * 6.28,
    ]) as Mote[];
  }, []);
  const positions = useMemo(() => new BufferAttribute(new Float32Array(DUST * 3), 3), []);

  useFrame(({ clock }) => {
    drift(positions, seeds, clock.elapsedTime * 0.12);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positions} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffd9a0"
        size={0.03}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
};

/** Only people use these: the room's light is baked. They follow the place they stand in. */
const PeopleLight = ({ atHome }: { atHome: boolean }) => {
  const sky = useRef<HemisphereLight>(null);
  const office = useMemo(() => new Color('#e4ebff'), []);
  const home = useMemo(() => new Color('#ffd2a0'), []);

  useFrame((_, delta) => {
    sky.current?.color.lerp(atHome ? home : office, 1 - Math.exp(-3 * delta));
  });

  return (
    <>
      <hemisphereLight ref={sky} args={['#e4ebff', '#4d4a78', 2.6]} />
      <directionalLight position={[2, 6, 5]} intensity={1.9} color="#fff0dc" />
    </>
  );
};

const WORKER_MODELS = ['worker_a', 'worker_b', 'worker_c'];
const FIRST_WORKER_DESK = 7;

interface OfficeSceneProps {
  state: GameState;
  place: Place;
  view: View;
  openActions: ReadonlySet<string>;
  labels: RefObject<Map<string, HTMLElement>>;
  onTooSlow: () => void;
}

const OfficeScene = ({ state, place, view, openActions, labels, onTooSlow }: OfficeSceneProps) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const graphics = useSettingsStore((settings) => settings.graphics);
  const walk = useOfficeStore((store) => store.walk);
  const arrive = useOfficeStore((store) => store.arrive);
  const setDpr = useThree((three) => three.setDpr);
  const [simple, setSimple] = useState(false);

  const mood = useMemo(() => officeMood(state), [state]);
  const speaker = viewOf(state, world.story)?.speaker ?? null;
  // Someone who speaks is there, even in the scene where they leave.
  const people = speaker && speaker in NPC_SEATS ? new Set([...mood.people, speaker]) : mood.people;
  const inScene = state.phase === 'scene';
  const atDesk = state.phase === 'kpi' || state.phase === 'payslip';
  const playerSpot =
    walk?.to ?? (atDesk ? PLAYER_DESK.at : inScene ? PLAYER_STAGE[place] : PLAYER_HOME);
  const workers = mood.litDesks.filter((index) => index >= FIRST_WORKER_DESK);

  return (
    <>
      <PeopleLight atHome={place === 'home'} />
      <CameraRig view={view} />
      {graphics === 'auto' && (
        <FrameWatch
          onTooSlow={onTooSlow}
          onLower={() => {
            setDpr(1);
            setSimple(true);
          }}
        />
      )}
      <LabelTracker labels={labels} />
      {/* Until the model is in, the canvas stays clear and the rendered place shows through. */}
      <Suspense fallback={null}>
        <color attach="background" args={['#0d1220']} />
        {!simple && <Dust />}
        <OfficeRoom mood={mood} atHome={place === 'home'} />

        {workers.map((index) => (
          <Character
            key={index}
            model={WORKER_MODELS[index % WORKER_MODELS.length] as string}
            to={(DESKS[index] as Desk).seat}
            rest="type"
            heading={Math.PI}
            seed={index}
          />
        ))}

        {[...people].map((id, index) => {
          const seat = NPC_SEATS[id];
          if (!seat) {
            return null;
          }
          const speaking = id === speaker;
          return (
            <Character
              key={id}
              model={id}
              to={speaking ? STAGE[place] : seat.at}
              rest={speaking ? 'talk' : seat.pose}
              heading={seat.heading}
              faces={speaking ? PLAYER_STAGE[place] : null}
              seed={index + 20}
            />
          );
        })}

        <Character
          model="player"
          to={playerSpot}
          rest={atDesk ? 'type' : 'stand'}
          heading={atDesk ? PLAYER_DESK.heading : Math.PI}
          faces={inScene && speaker && speaker in NPC_SEATS ? STAGE[place] : null}
          onArrive={() => {
            const order = arrive();
            if (order) {
              dispatch({ type: 'takeAction', actionId: order.actionId });
            }
          }}
        />

        {state.phase === 'week' &&
          HOTSPOTS.map((spot) => (
            <Ring key={spot.actionId} spot={spot} open={openActions.has(spot.actionId)} />
          ))}
      </Suspense>
    </>
  );
};

interface OfficeCanvasProps {
  state: GameState;
  place: Place;
  onTooSlow: () => void;
}

/** Loaded on its own: the 2D screens never download three.js until it is wanted. */
const OfficeCanvas = ({ state, place, onTooSlow }: OfficeCanvasProps) => {
  const walk = useOfficeStore((store) => store.walk);
  const walkTo = useOfficeStore((store) => store.walkTo);
  const labels = useRef(new Map<string, HTMLElement>());

  useEffect(() => () => void useOfficeStore.setState({ walk: null }), []);

  const openActions = useMemo(
    () =>
      new Set(
        state.phase === 'week'
          ? weekActions(state, world)
              .filter((action) => action.available)
              .map(({ id }) => id)
          : [],
      ),
    [state],
  );

  const view: View =
    state.phase === 'week'
      ? 'overview'
      : state.phase === 'kpi' || state.phase === 'payslip'
        ? 'desk'
        : place;

  return (
    <>
      <Canvas
        aria-hidden
        dpr={[1, 1.75]}
        flat
        gl={{ antialias: true, powerPreference: 'default' }}
        camera={{
          fov: CAMERAS[view].fov,
          position: [...CAMERAS[view].position],
          near: 0.1,
          far: 80,
        }}
        // A phone can take the context back at any time, and with it the frames a walk waits for.
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', onTooSlow, { once: true });
        }}
      >
        <OfficeScene
          state={state}
          place={place}
          view={view}
          openActions={openActions}
          labels={labels}
          onTooSlow={onTooSlow}
        />
      </Canvas>
      {state.phase === 'week' &&
        HOTSPOTS.map((spot) => {
          const open = openActions.has(spot.actionId);
          return (
            <button
              key={spot.actionId}
              type="button"
              ref={(element) => {
                if (element) {
                  labels.current.set(spot.actionId, element);
                } else {
                  labels.current.delete(spot.actionId);
                }
              }}
              disabled={!open || walk !== null}
              onClick={() => walkTo({ to: spot.stand, actionId: spot.actionId })}
              className={`absolute top-0 left-0 z-10 min-h-9 rounded-full px-3 text-xs font-extrabold whitespace-nowrap transition-colors ${
                open ? 'bg-paycheck text-surface-950' : 'bg-surface-900/90 text-ink-muted'
              }`}
            >
              {spot.label}
            </button>
          );
        })}
    </>
  );
};

export default OfficeCanvas;
