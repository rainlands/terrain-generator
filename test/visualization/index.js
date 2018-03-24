import * as THREE from 'three';
import * as controls from './utils/controls';
import isHidden from './utils/isHidden';
import { mapObjectToBinaries } from '../../utils';

let scene,
  camera,
  renderer,
  generator;

const GEOMETRY = new THREE.Geometry();
const CUBE_MATERIAL = new THREE.MeshNormalMaterial();
const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));

export const init = (gen) => {
  generator = gen;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = gen.height;

  controls.initializeControls(camera);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 0);
  document.body.appendChild(renderer.domElement);

  animate();
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.animateMovementTick(camera);

  const { x, z } = camera.position;

  const { added } = generator.updateMap({
    position: [x, z],
    renderDistance: 3,
    unrenderOffset: 1,
  });

  let geometry;

  Object.keys(added).forEach((i) => {
    Object.keys(added[i]).forEach((j) => {
      const chunk = added[i][j];

      Object.keys(chunk).forEach((y) => {
        Object.keys(chunk[y]).forEach((x) => {
          Object.keys(chunk[y][x]).forEach((z) => {
            if (chunk[y][x][z]) {
              if (!geometry) {
                geometry = new THREE.Geometry();
              } else if (
                !isHidden({
                  map: chunk,
                  position: [y, x, z],
                })
              ) {
                CUBE_MESH.position.set(
                  +x + generator.chunkSize * +i,
                  +y,
                  +z + generator.chunkSize * +j,
                );
                CUBE_MESH.updateMatrix();

                geometry.merge(CUBE_MESH.geometry, CUBE_MESH.matrix);
              }
            }
          });
        });
      });
    });
  });

  if (geometry) {
    scene.add(new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), CUBE_MATERIAL));
  }

  renderer.render(scene, camera);
};
