'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Matrix4 } from 'three';
import type { InstancedMesh, MeshLambertMaterial } from 'three';
import type { Vec3 } from './office-layout';
import type { FruitTray, OfficeMood } from './office-mood';

const FLOOR = '#26342f';
const WALL = '#31423f';
const DESK = '#4a5a55';
const METAL = '#6c7c78';

interface BoxProps {
  at: Vec3;
  size: Vec3;
  color: string;
}

const Box = ({ at, size, color }: BoxProps) => (
  <mesh position={[at[0], at[1], at[2]]}>
    <boxGeometry args={[size[0], size[1], size[2]]} />
    <meshLambertMaterial color={color} flatShading />
  </mesh>
);

/** Twelve desks, in rows. The empty ones have a dark screen. */
const DESKS: readonly Vec3[] = [-4.8, -2.4, 0].flatMap((x) =>
  [-1.6, 0, 1.6, 3.2].map((z): Vec3 => [x, 0, z - 1.2]),
);

interface PartProps {
  at: readonly Vec3[];
  size: Vec3;
  color: string;
}

/** One draw call however many desks there are: a phone is what this has to run on. */
const Part = ({ at, size, color }: PartProps) => {
  const mesh = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const matrix = new Matrix4();
    at.forEach((position, index) => {
      mesh.current?.setMatrixAt(index, matrix.makeTranslation(...position));
    });
    if (mesh.current) {
      mesh.current.count = at.length;
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [at]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, DESKS.length * 2]}>
      <boxGeometry args={[size[0], size[1], size[2]]} />
      <meshLambertMaterial color={color} flatShading />
    </instancedMesh>
  );
};

const offset = (desk: Vec3, x: number, y: number, z: number): Vec3 => [
  desk[0] + x,
  desk[1] + y,
  desk[2] + z,
];

const Desks = ({ occupied }: { occupied: number }) => {
  const parts = useMemo(() => {
    const screen = (desk: Vec3) => offset(desk, 0, 1.02, -0.2);
    return {
      tops: DESKS.map((desk) => offset(desk, 0, 0.72, 0)),
      legs: DESKS.flatMap((desk) => [offset(desk, -0.65, 0.36, 0), offset(desk, 0.65, 0.36, 0)]),
      lit: DESKS.slice(0, occupied).map(screen),
      dark: DESKS.slice(occupied).map(screen),
    };
  }, [occupied]);

  return (
    <>
      <Part at={parts.tops} size={[1.5, 0.08, 0.8]} color={DESK} />
      <Part at={parts.legs} size={[0.08, 0.72, 0.7]} color={METAL} />
      <Part at={parts.lit} size={[0.62, 0.4, 0.04]} color="#a8e6d6" />
      <Part at={parts.dark} size={[0.62, 0.4, 0.04]} color="#141c1c" />
    </>
  );
};

/** The light the game is named for: one tube can flicker when the player cannot take more. */
const Tube = ({ at, flicker }: { at: Vec3; flicker: boolean }) => {
  const material = useRef<MeshLambertMaterial>(null);

  useFrame(({ clock }) => {
    if (material.current) {
      const off =
        flicker && Math.sin(clock.elapsedTime * 23) * Math.sin(clock.elapsedTime * 3) > 0.4;
      material.current.emissiveIntensity = off ? 0.2 : 1.6;
    }
  });

  return (
    <mesh position={[at[0], at[1], at[2]]}>
      <boxGeometry args={[2.4, 0.06, 0.16]} />
      <meshLambertMaterial ref={material} color="#ffffff" emissive="#c8f0e4" />
    </mesh>
  );
};

const FRUIT: Record<FruitTray, readonly { x: number; color: string }[]> = {
  full: [
    { x: -0.3, color: '#e89a3c' },
    { x: -0.1, color: '#8e3f8e' },
    { x: 0.1, color: '#d9423f' },
    { x: 0.3, color: '#e8c33c' },
  ],
  half: [
    { x: -0.15, color: '#e89a3c' },
    { x: 0.15, color: '#e8c33c' },
  ],
  bananas: [{ x: 0, color: '#e8d24a' }],
  empty: [],
};

const FruitTable = ({ tray }: { tray: FruitTray }) => (
  <group position={[4.6, 0, 2]}>
    <Box at={[0, 0.5, 0]} size={[1, 0.08, 0.6]} color={DESK} />
    <Box at={[0, 0.25, 0]} size={[0.14, 0.5, 0.14]} color={METAL} />
    {FRUIT[tray].map(({ x, color }) => (
      <mesh key={x} position={[x, 0.65, 0]}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    ))}
  </group>
);

const PlantWall = ({ left }: { left: number }) => (
  <group position={[-1.4, 0, -4.8]}>
    {[0, 1, 2, 3, 4].map((index) => (
      <mesh key={index} position={[index * 0.8 - 1.6, 1.4, 0]}>
        <icosahedronGeometry args={[0.46, 0]} />
        <meshLambertMaterial color={index / 5 < left ? '#3f7a56' : '#4a4a3c'} flatShading />
      </mesh>
    ))}
  </group>
);

const MeetingRoom = () => (
  <group>
    <Box at={[2, 1.3, -2.5]} size={[0.1, 2.6, 5]} color="#3d5a5a" />
    <Box at={[4.2, 0.72, -3.6]} size={[3, 0.1, 1.4]} color={DESK} />
    <Box at={[4.2, 0.36, -3.6]} size={[0.3, 0.72, 0.3]} color={METAL} />
    {/* The slide that says TẦM NHÌN 2030: bright, and blank from here. */}
    <Box at={[4.2, 1.7, -4.92]} size={[2.4, 1.2, 0.04]} color="#dff5ee" />
  </group>
);

const Home = () => (
  <group position={[30, 0, 0]}>
    <Box at={[0, -0.05, 0]} size={[6, 0.1, 6]} color="#3a2e24" />
    <Box at={[0, 1.4, -2.9]} size={[6, 2.8, 0.1]} color="#4a3a2c" />
    <Box at={[-1.4, 0.3, -1.4]} size={[2, 0.6, 1.2]} color="#6d5a48" />
    <Box at={[1.6, 0.5, -1.8]} size={[1, 1, 0.6]} color="#5a4636" />
    <pointLight position={[0, 2.4, 0]} intensity={14} color="#ffc98a" />
  </group>
);

export const OfficeRoom = ({ mood }: { mood: OfficeMood }) => (
  <group>
    <Box at={[0, -0.05, 0]} size={[12, 0.1, 10]} color={FLOOR} />
    <Box at={[0, 1.4, -5]} size={[12, 2.8, 0.1]} color={WALL} />
    <Box at={[-6, 1.4, 0]} size={[0.1, 2.8, 10]} color={WALL} />
    <Box at={[6, 1.4, 0]} size={[0.1, 2.8, 10]} color={WALL} />

    <Desks occupied={mood.occupiedDesks} />

    {/* On the walls: from the camera's height, tubes on a ceiling would hang in mid-air. */}
    <Tube at={[-3.6, 2.5, -4.9]} flicker={mood.flicker} />
    <Tube at={[0.4, 2.5, -4.9]} flicker={false} />

    <MeetingRoom />
    <PlantWall left={mood.plants} />
    <FruitTable tray={mood.fruit} />

    {/* Rest, the file cabinet and the phone: the places in `HOTSPOTS`. */}
    <Box at={[-5, 0.32, 4]} size={[1.4, 0.64, 0.8]} color="#5a6a66" />
    <Box at={[-5, 0.8, -3.8]} size={[0.9, 1.6, 0.6]} color="#6c7c78" />
    <Box at={[0.2, 0.5, 4.2]} size={[0.5, 1, 0.5]} color="#37474a" />
    {mood.coffeeMachine && <Box at={[2.8, 0.7, 4.3]} size={[0.9, 1.4, 0.7]} color="#8a9a96" />}

    <Home />
  </group>
);
