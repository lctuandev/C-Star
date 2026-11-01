'use client';

import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FULL_LIGHT, grade, OFFICE_URL, prepareOffice, setRoomLight, withMeshopt } from './art';
import { DESKS } from './office-layout';
import type { OfficeMood } from './office-mood';

const PLANTS = 5;
const COLD = new Color(0.82, 0.92, 1.06);
const WHITE = new Color(1, 1, 1);
const FRUIT = ['full', 'half', 'bananas'] as const;

/** Everything is in the one file, baked together; the month only decides what is switched on. */
export const OfficeRoom = ({ mood, atHome }: { mood: OfficeMood; atHome: boolean }) => {
  const { scene } = useLoader(GLTFLoader, OFFICE_URL, withMeshopt);
  const { baked } = useMemo(() => prepareOffice(scene), [scene]);
  const drain = useRef(mood.drain);

  useEffect(() => {
    const show = (name: string, visible: boolean) => {
      const node = scene.getObjectByName(name);
      if (node) {
        node.visible = visible;
      }
    };
    show('DYN_coffee', mood.coffeeMachine);
    show('DYN_banner', mood.banner);
    FRUIT.forEach((stage) => show(`DYN_fruit_${stage}`, mood.fruit === stage));
    for (let index = 0; index < PLANTS; index += 1) {
      const alive = index / PLANTS < mood.plants;
      show(`DYN_plant_${index}`, alive);
      show(`DYN_plant_dry_${index}`, !alive);
    }
    DESKS.forEach((_, index) => {
      const lit = mood.litDesks.includes(index);
      show(`DYN_desk_${index}`, lit);
      show(`SCREEN_${index}`, lit);
    });
  }, [scene, mood]);

  useFrame(({ clock }, delta) => {
    // Home keeps more of its colour: the one place the company has not reached yet.
    const wanted = atHome ? mood.drain * 0.45 : mood.drain;
    drain.current += (wanted - drain.current) * (1 - Math.exp(-1.5 * delta));
    grade.uDrain.value = drain.current;
    grade.uTint.value.copy(WHITE).lerp(COLD, drain.current);

    const t = clock.elapsedTime;
    const dropout = mood.flicker && Math.sin(t * 23) * Math.sin(t * 3.1) > 0.55;
    setRoomLight(baked, dropout ? FULL_LIGHT * 0.62 : FULL_LIGHT);
  });

  return <primitive object={scene} />;
};
