import { Color, DoubleSide, MeshBasicMaterial, MeshLambertMaterial, SRGBColorSpace } from 'three';
import type {
  Bone as ThreeBone,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
} from 'three';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import type { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import type { Bone, Pose } from './pose';

export const OFFICE_URL = '/art/office.glb';
export const PEOPLE_URL = '/art/characters.glb';

export const withMeshopt = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

/** The value `export_office.py` divided the light by. */
const LIGHT_RANGE = 2;
export const FULL_LIGHT = LIGHT_RANGE * Math.PI;

/** One grade for the whole room: the story takes the colour out of it month by month. */
export const grade = {
  uDrain: { value: 0 },
  uTint: { value: new Color(1, 1, 1) },
};

const graded = <T extends Material>(material: T): T => {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, grade);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uDrain;\nuniform vec3 uTint;')
      .replace(
        '#include <opaque_fragment>',
        `outgoingLight = mix(outgoingLight, vec3(dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722))), uDrain) * uTint;
#include <opaque_fragment>`,
      );
  };
  return material;
};

const bakedOf = (source: MeshStandardMaterial) => {
  const lightMap = source.aoMap;
  if (lightMap) {
    lightMap.colorSpace = SRGBColorSpace;
  }
  return graded(
    new MeshBasicMaterial({
      map: source.map,
      vertexColors: source.map === null,
      lightMap,
      lightMapIntensity: FULL_LIGHT,
    }),
  );
};

const unlitOf = (source: MeshStandardMaterial) =>
  graded(new MeshBasicMaterial({ map: source.map ?? source.emissiveMap }));

const GLASS = new MeshBasicMaterial({
  color: '#bfe4ff',
  transparent: true,
  opacity: 0.1,
  depthWrite: false,
  side: DoubleSide,
});

interface Office {
  baked: MeshBasicMaterial[];
}

const prepared = new WeakMap<Object3D, Office>();

/** The file carries PBR placeholders: the room only ever needs a lookup in its baked light. */
export const prepareOffice = (scene: Group): Office => {
  const done = prepared.get(scene);
  if (done) {
    return done;
  }
  const swapped = new Map<Material, Material>();
  const baked: MeshBasicMaterial[] = [];
  const swap = (source: Material): Material => {
    let result = swapped.get(source);
    if (!result) {
      const standard = source as MeshStandardMaterial;
      if (source.name === 'M_Glass') {
        result = GLASS;
      } else if (source.name === 'M_Glow') {
        result = unlitOf(standard);
      } else {
        const material = bakedOf(standard);
        baked.push(material);
        result = material;
      }
      swapped.set(source, result);
    }
    return result;
  };
  scene.traverse((node) => {
    const mesh = node as Mesh;
    if (mesh.isMesh) {
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
    }
  });
  const office = { baked };
  prepared.set(scene, office);
  return office;
};

/** The room's brightness: fluorescent tubes dropping out change all of it at once. */
export const setRoomLight = (materials: readonly MeshBasicMaterial[], intensity: number) => {
  for (const material of materials) {
    material.lightMapIntensity = intensity;
  }
};

const skin = new MeshLambertMaterial({ vertexColors: true });

export interface Person {
  root: Object3D;
  bones: Partial<Record<Bone, ThreeBone>>;
  rest: Partial<Record<Bone, number>>;
}

/** Loaded once, cloned per person: `name` is a CHR_ node, `_1` is how three.js keeps names unique. */
export const personFrom = (scene: Group, name: string): Person => {
  const source = scene.getObjectByName(`CHR_${name}_rig`);
  if (!source) {
    throw new Error(`No character ${name}`);
  }
  const root = cloneSkinned(source);
  root.position.set(0, 0, 0);
  const bones: Person['bones'] = {};
  const rest: Person['rest'] = {};
  root.traverse((node) => {
    const skinned = node as SkinnedMesh;
    if (skinned.isSkinnedMesh) {
      skinned.material = skin;
      skinned.frustumCulled = false;
    }
    if ((node as ThreeBone).isBone) {
      const bone = node.name.replace(/_\d+$/, '') as Bone;
      bones[bone] = node as ThreeBone;
      rest[bone] = node.position.y;
    }
  });
  return { root, bones, rest };
};

/** Eases every joint toward `pose`. `blend` is how far to go this frame. */
export const applyPose = (person: Person, pose: Pose, blend: number) => {
  for (const [name, bone] of Object.entries(person.bones)) {
    const target = pose.bones[name as Bone];
    if (name !== 'eyes') {
      bone.rotation.x += ((target?.[0] ?? 0) - bone.rotation.x) * blend;
      bone.rotation.y += ((target?.[1] ?? 0) - bone.rotation.y) * blend;
      bone.rotation.z += ((target?.[2] ?? 0) - bone.rotation.z) * blend;
    }
  }
};

export const setBody = (person: Person, lift: number, eyesOpen: boolean) => {
  const { hips } = person.bones;
  if (hips) {
    hips.position.y = (person.rest.hips ?? 0) + lift;
  }
  const eyes = person.bones['eyes' as Bone];
  if (eyes) {
    eyes.scale.y = eyesOpen ? 1 : 0.1;
  }
};
