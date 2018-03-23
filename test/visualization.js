import * as THREE from 'three';
import { mapObjectToBinaries } from '../utils';
import { initializeControls, animateMovementTick } from './utils/controls';
import isHidden from './utils/isHidden';

let generator,
  camera,
  scene,
  renderer;

const GEOMETRY = new THREE.Geometry();
const CUBE_MATERIAL = new THREE.MeshNormalMaterial();
const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));

export const init = (gen) => {
  generator = gen;

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 200, 0);

  initializeControls(camera);
  scene = new THREE.Scene();

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(1, 2, 1.5);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  scene.add(dirLight);
  scene.add(hemiLight);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio || 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  animate();
};

const animate = () => {
  requestAnimationFrame(animate);
  animateMovementTick(camera);

  const { x, z } = camera.position;
  const userX = Math.round(x);
  const userZ = Math.round(z);

  if (userX % 16 === 0 || userZ % 16 === 0) {
    const { added } = generator.updateMap({
      position: [userX, userZ],
      renderDistance: 15,
      unrenderOffset: 1,
    });
    const map = mapObjectToBinaries(added);

    let geometry;

    Object.keys(map).forEach((y) => {
      Object.keys(map[y]).forEach((x) => {
        Object.keys(map[y][x]).forEach((z) => {
          if (!isHidden(map, [y, x, z])) {
            if (map[y][x][z] >= 1) {
              if (!geometry) geometry = new THREE.Geometry();
              else {
                CUBE_MESH.position.set(+x, +y, +z);
                CUBE_MESH.updateMatrix();

                geometry.merge(CUBE_MESH.geometry, CUBE_MESH.matrix);
              }
            }
          }
        });
      });
    });

    if (geometry) {
      scene.add(new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), CUBE_MATERIAL));
    }
  }

  renderer.render(scene, camera);
};
