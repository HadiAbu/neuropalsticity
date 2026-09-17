// Rebuilds public/models/brain.glb from BodyParts3D STL parts.
//
//   node scripts/build-brain-glb.mjs            # download, convert, compress
//   node scripts/build-brain-glb.mjs --no-fetch # reuse STLs already in .cache/stl
//
// Source: github.com/Kevin-Mattheus-Moerman/BodyParts3D (CC BY-SA 2.1 JP).
// The recentring offset is the combined bounding-box centre of the ORIGINAL four
// parts, recorded in docs/decisions/001-brain-mesh.md. It is hardcoded so that
// adding parts never shifts the frame the app's camera and strip are tuned to.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const BASE = 'https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/main/assets/BodyParts3D_data/stl';
const CACHE = '.cache/stl';
const RAW = '.cache/brain_raw.glb';
const OUT = 'public/models/brain.glb';

/** Recorded body-coordinate centre of the original four-part bounding box. */
const RECENTER = new THREE.Vector3(-0.65, -90.85, 1563.67);

const PARTS = [
  { fma: 'FMA61822', node: 'WhiteMatter_CerebralHemispheres' },
  { fma: 'FMA67944', node: 'Cerebellum' },
  { fma: 'FMA72661', node: 'PrecentralGyrus_R' },
  { fma: 'FMA72662', node: 'PrecentralGyrus_L' },
  { fma: 'FMA72832', node: 'Amygdala_R' },
  { fma: 'FMA72833', node: 'Amygdala_L' },
];

// GLTFExporter reaches for browser FileReader when producing binary output.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => { this.result = buf; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = `data:${blob.type};base64,${Buffer.from(buf).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const fetchParts = !process.argv.includes('--no-fetch');
await mkdir(CACHE, { recursive: true });

const loader = new STLLoader();
const brain = new THREE.Group();
brain.name = 'Brain';
brain.rotation.x = -Math.PI / 2; // source is Z-up; glTF is Y-up
const parts = new THREE.Group();
parts.name = 'BrainParts';
parts.position.copy(RECENTER).negate();
brain.add(parts);

const material = new THREE.MeshStandardMaterial({ color: 0xd9a8b4 });

for (const { fma, node } of PARTS) {
  const file = `${CACHE}/${fma}.stl`;
  if (fetchParts || !existsSync(file)) {
    console.log(`fetch ${fma}`);
    const res = await fetch(`${BASE}/${fma}.stl`);
    if (!res.ok) throw new Error(`${fma}: HTTP ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  const buf = await readFile(file);
  const geometry = mergeVertices(
    loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)),
    1e-4
  );
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = node;
  parts.add(mesh);
  console.log(`  ${node}: ${geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3} tri`);
}

const exporter = new GLTFExporter();
const glb = await new Promise((resolve, reject) =>
  exporter.parse(brain, resolve, reject, { binary: true })
);
await writeFile(RAW, Buffer.from(glb));
console.log(`wrote ${RAW}`);

execSync(`npx @gltf-transform/cli draco ${RAW} ${OUT}`, { stdio: 'inherit' });
execSync(`npx @gltf-transform/cli inspect ${OUT}`, { stdio: 'inherit' });
