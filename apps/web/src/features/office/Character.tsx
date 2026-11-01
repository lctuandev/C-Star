'use client';

import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, MeshBasicMaterial } from 'three';
import type { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { applyPose, PEOPLE_URL, personFrom, setBody, withMeshopt } from './art';
import { findPath } from './nav';
import type { RestPose, Vec3 } from './office-layout';
import { poseOf } from './pose';
import type { Motion } from './pose';
import { headingOf, stepToward, WALK_SPEED } from './walk';

const TURN_RATE = 9;
const BLEND_RATE = 10;

const contactShadow = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 4, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(10,12,30,0.55)');
    gradient.addColorStop(1, 'rgba(10,12,30,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }
  return new MeshBasicMaterial({
    map: new CanvasTexture(canvas),
    transparent: true,
    depthWrite: false,
  });
};

let shadowMaterial: MeshBasicMaterial | null = null;

const samePoint = (a: Vec3, b: Vec3) => a[0] === b[0] && a[2] === b[2];

const turnToward = (from: number, to: number, ease: number) => {
  const gap = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + gap * ease;
};

interface CharacterProps {
  /** A person in characters.glb. */
  model: string;
  to: Vec3;
  /** What they do once there. */
  rest?: RestPose | 'talk';
  /** Which way they end up facing, in radians. */
  heading?: number;
  /** Who they turn to, if anyone. Wins over `heading`. */
  faces?: Vec3 | null;
  /** Runs when the character reaches `to`. */
  onArrive?: () => void;
  seed?: number;
}

/** Dress and hair say who someone is (contracts/content.md). Everything moves by `poseOf`. */
export const Character = ({
  model,
  to,
  rest = 'stand',
  heading = 0,
  faces = null,
  onArrive,
  seed = 0,
}: CharacterProps) => {
  const { scene } = useLoader(GLTFLoader, PEOPLE_URL, withMeshopt);
  const person = useMemo(() => personFrom(scene, model), [scene, model]);
  const body = useRef<Group>(null);
  const place = useRef<Vec3>(to);
  const goal = useRef<Vec3>(to);
  const route = useRef<readonly Vec3[]>([]);
  const arriving = useRef(false);
  const lift = useRef(0);
  const yaw = useRef(heading);
  const blink = useRef(2 + seed);
  const latest = useRef({ to, rest, heading, faces, onArrive });

  useEffect(() => {
    latest.current = { to, rest, heading, faces, onArrive };
  });

  shadowMaterial ??= contactShadow();

  useFrame(({ clock }, delta) => {
    const group = body.current;
    if (!group) {
      return;
    }
    const now = latest.current;
    if (!samePoint(now.to, goal.current)) {
      goal.current = now.to;
      route.current = findPath(place.current, now.to);
      arriving.current = true;
    }

    let walking = false;
    let left = WALK_SPEED * delta;
    while (left > 0 && route.current.length > 0) {
      const next = route.current[0] as Vec3;
      const from = place.current;
      const stepped = stepToward(from, next, left);
      if (stepped === next) {
        left -= Math.hypot(next[0] - from[0], next[2] - from[2]);
        route.current = route.current.slice(1);
      } else {
        left = 0;
      }
      if (!samePoint(from, stepped)) {
        yaw.current = turnToward(
          yaw.current,
          headingOf(from, stepped),
          1 - Math.exp(-TURN_RATE * delta),
        );
        walking = true;
      }
      place.current = stepped;
    }
    if (route.current.length === 0 && arriving.current) {
      arriving.current = false;
      now.onArrive?.();
    }

    if (!walking) {
      const wanted = now.faces ? headingOf(place.current, now.faces) : now.heading;
      yaw.current = turnToward(yaw.current, wanted, 1 - Math.exp(-TURN_RATE * delta));
    }

    const motion: Motion = walking ? 'walk' : now.rest;
    const pose = poseOf(motion, clock.elapsedTime, seed);
    const blend = 1 - Math.exp(-BLEND_RATE * delta);
    applyPose(person, pose, blend);
    lift.current += (pose.lift - lift.current) * blend;

    blink.current -= delta;
    const eyesOpen = blink.current >= 0;
    if (blink.current < -0.12) {
      blink.current = 2.4 + ((clock.elapsedTime * 7.3 + seed) % 3.5);
    }
    setBody(person, lift.current, eyesOpen);

    group.position.set(place.current[0], place.current[1], place.current[2]);
    group.rotation.y = yaw.current;
  });

  return (
    <group ref={body} position={[to[0], to[1], to[2]]}>
      <primitive object={person.root} />
      <mesh material={shadowMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.95, 0.95]} />
      </mesh>
    </group>
  );
};
