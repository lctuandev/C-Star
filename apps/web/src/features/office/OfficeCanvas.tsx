'use client';

import { characterInfo } from '@cstar/content';
import type { CharacterId } from '@cstar/content';
import { viewOf, weekActions } from '@cstar/game-core';
import type { GameState, Place } from '@cstar/game-core';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { Vector3 } from 'three';
import type { Mesh } from 'three';
import { useGameStore, world } from '@/features/play/game-store';
import { useSettingsStore } from '@/features/settings/settings-store';
import { Character } from './Character';
import { isTooSlow } from './graphics';
import { CAMERAS, HOTSPOTS, NPC_SEATS, PLAYER_HOME, PLAYER_STAGE, STAGE } from './office-layout';
import type { Hotspot, Vec3 } from './office-layout';
import { officeMood } from './office-mood';
import { useOfficeStore } from './office-store';
import { OfficeRoom } from './OfficeRoom';

const CameraRig = ({ place }: { place: Place }) => {
  const target = useRef(new Vector3(...CAMERAS[place].target));

  useFrame(({ camera }, delta) => {
    const pose = CAMERAS[place];
    const ease = 1 - Math.exp(-3 * delta);
    camera.position.lerp(new Vector3(...pose.position), ease);
    target.current.lerp(new Vector3(...pose.target), ease);
    camera.lookAt(target.current);
  });

  return null;
};

/** Judges the first seconds, then steps aside. A slow device gets the 2D screens. */
const FrameWatch = ({ onTooSlow }: { onTooSlow: () => void }) => {
  const frames = useRef<number[]>([]);
  const judged = useRef(false);

  useFrame((_, delta) => {
    if (judged.current) {
      return;
    }
    frames.current.push(delta);
    const verdict = isTooSlow(frames.current);
    if (verdict !== null) {
      judged.current = true;
      if (verdict) {
        onTooSlow();
      }
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
      position={[spot.position[0], 0.03, spot.position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.42, 0.56, 18]} />
      <meshBasicMaterial color={open ? '#c8f0e4' : '#55645f'} />
    </mesh>
  );
};

/** Keeps the DOM labels over their places: crisp, tappable, and readable by a screen reader. */
const LabelTracker = ({ labels }: { labels: RefObject<Map<string, HTMLElement>> }) => {
  const point = useMemo(() => new Vector3(), []);

  useFrame(({ camera, size }) => {
    for (const spot of HOTSPOTS) {
      const label = labels.current.get(spot.actionId);
      if (label) {
        point.set(spot.position[0], 0.6, spot.position[2]).project(camera);
        // Kept inside the strip: a phone's narrow view would lose the places at the sides.
        const x = clamp(((point.x + 1) / 2) * size.width, 56, size.width - 56);
        const y = clamp(((1 - point.y) / 2) * size.height, 20, size.height - 20);
        label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      }
    }
  });

  return null;
};

interface OfficeSceneProps {
  state: GameState;
  place: Place;
  openActions: ReadonlySet<string>;
  labels: RefObject<Map<string, HTMLElement>>;
  onTooSlow: () => void;
}

const OfficeScene = ({ state, place, openActions, labels, onTooSlow }: OfficeSceneProps) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const graphics = useSettingsStore((settings) => settings.graphics);
  const walk = useOfficeStore((store) => store.walk);
  const arrive = useOfficeStore((store) => store.arrive);

  const mood = useMemo(() => officeMood(state), [state]);
  const speaker = viewOf(state, world.story)?.speaker ?? null;
  // Someone who speaks is there, even in the scene where they leave.
  const people = speaker && speaker in NPC_SEATS ? new Set([...mood.people, speaker]) : mood.people;
  const inScene = state.phase === 'scene';

  return (
    <>
      <color attach="background" args={['#0c1113']} />
      <ambientLight intensity={1.1} color="#cfe8e2" />
      <directionalLight position={[3, 8, 4]} intensity={1.5} color="#e6fff7" />
      <CameraRig place={place} />
      {graphics === 'auto' && <FrameWatch onTooSlow={onTooSlow} />}
      <LabelTracker labels={labels} />
      <OfficeRoom mood={mood} />

      {[...people].map((id) => (
        <Character
          key={id}
          tone={characterInfo[id as CharacterId].tone}
          to={id === speaker ? STAGE[place] : (NPC_SEATS[id] as Vec3)}
        />
      ))}

      <Character
        tone="player"
        to={walk?.to ?? (inScene ? PLAYER_STAGE[place] : PLAYER_HOME)}
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

  return (
    <>
      <Canvas
        aria-hidden
        dpr={[1, 1.5]}
        flat
        gl={{ antialias: false, powerPreference: 'low-power' }}
        camera={{ fov: 42, position: [...CAMERAS[place].position] }}
        // A phone can take the context back at any time, and with it the frames a walk waits for.
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', onTooSlow, { once: true });
        }}
      >
        <OfficeScene
          state={state}
          place={place}
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
              className={`bg-surface-950/85 absolute top-0 left-0 min-h-8 rounded-full px-3 text-xs font-bold whitespace-nowrap ${
                open ? 'text-fluorescent' : 'text-ink-muted'
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
