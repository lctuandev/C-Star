'use client';

import type { CharacterInfo } from '@cstar/content';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import type { Vec3 } from './office-layout';
import { headingOf, stepToward, WALK_SPEED } from './walk';

const TONES: Record<CharacterInfo['tone'], string> = {
  player: '#c8f0e4',
  power: '#f2c879',
  paper: '#9aa8a8',
  ally: '#9fd0f5',
};

interface CharacterProps {
  tone: CharacterInfo['tone'];
  to: Vec3;
  /** Runs once when the character reaches `to`. */
  onArrive?: () => void;
}

/** Low-poly on purpose: dress and colour say who someone is, not a face (contracts/content.md). */
export const Character = ({ tone, to, onArrive }: CharacterProps) => {
  const body = useRef<Group>(null);
  const place = useRef<Vec3>(to);

  useFrame((_, delta) => {
    const group = body.current;
    if (!group) {
      return;
    }
    const from = place.current;
    const next = stepToward(from, to, WALK_SPEED * delta);
    const moved = next !== from && (next[0] !== from[0] || next[2] !== from[2]);
    if (moved) {
      group.rotation.y = headingOf(from, next);
      place.current = next;
      group.position.set(next[0], next[1], next[2]);
      if (next === to) {
        onArrive?.();
      }
    }
    group.position.y = moved ? Math.abs(Math.sin(performance.now() / 110)) * 0.07 : 0;
  });

  return (
    <group ref={body} position={[to[0], to[1], to[2]]}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 1.05, 6]} />
        <meshLambertMaterial color={TONES[tone]} flatShading />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <icosahedronGeometry args={[0.21, 0]} />
        <meshLambertMaterial color="#d9c7b3" flatShading />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.2, 6]} />
        <meshLambertMaterial color="#1b2428" flatShading />
      </mesh>
    </group>
  );
};
