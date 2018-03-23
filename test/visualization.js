import * as THREE from 'three';
import { initializeControls, animateMovementTick } from './utils/controls';

let camera,
  scene,
  renderer;
let geometry,
  material,
  mesh;

const CUBE_MATERIAL = new THREE.MeshNormalMaterial();
const CUBE_MESH = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));

const isHidden = (map, position) => {
  const [y, x, z] = position.map(n => Number(n));

  return (
    (map[y + 1] && map[y + 1][x] && map[y + 1][x][z]) &&
    (map[y + 1] && map[y + 1][x] && map[y + 1][x][z + 1]) &&
    (map[y + 1] && map[y + 1][x] && map[y + 1][x][z - 1]) &&

    (map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1][z]) &&
    (map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1][z + 1]) &&
    (map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1][z - 1]) &&

    (map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1][z]) &&
    (map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1][z + 1]) &&
    (map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1][z - 1]) &&


    (map[y - 1] && map[y - 1][x] && map[y - 1][x][z]) &&
    (map[y - 1] && map[y - 1][x] && map[y - 1][x][z + 1]) &&
    (map[y - 1] && map[y - 1][x] && map[y - 1][x][z - 1]) &&

    (map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1][z]) &&
    (map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1][z + 1]) &&
    (map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1][z - 1]) &&

    (map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1][z]) &&
    (map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1][z + 1]) &&
    (map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1][z - 1]) &&


    (map[y] && map[y][x] && map[y][x][z]) &&
    (map[y] && map[y][x] && map[y][x][z + 1]) &&
    (map[y] && map[y][x] && map[y][x][z - 1]) &&

    (map[y] && map[y][x + 1] && map[y][x + 1][z]) &&
    (map[y] && map[y][x + 1] && map[y][x + 1][z + 1]) &&
    (map[y] && map[y][x + 1] && map[y][x + 1][z - 1]) &&

    (map[y] && map[y][x - 1] && map[y][x - 1][z]) &&
    (map[y] && map[y][x - 1] && map[y][x - 1][z + 1]) &&
    (map[y] && map[y][x - 1] && map[y][x - 1][z - 1])
  )
};

export const init = (map) => {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.z = Object.keys(map).length + 5;
  initializeControls(camera);
  scene = new THREE.Scene();

  const geometry = new THREE.Geometry();

  Object.keys(map).forEach((y) => {
    Object.keys(map[y]).forEach((x) => {
      Object.keys(map[y][x]).forEach((z) => {
        if (!isHidden(map, [y, x, z])) {
          if (map[y][x][z] >= 1) {
            CUBE_MESH.position.set(+x, +y, +z);
            CUBE_MESH.updateMatrix();

            geometry.merge(CUBE_MESH.geometry, CUBE_MESH.matrix);
          }
        }
      });
    });
  });

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(1, 2, 1.5);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  scene.add(dirLight);
  scene.add(hemiLight);
  scene.add(new THREE.Mesh(geometry, CUBE_MATERIAL));

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

  renderer.render(scene, camera);
};
