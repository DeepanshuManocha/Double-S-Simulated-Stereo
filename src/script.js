import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import ThreeMeshUI from "three-mesh-ui";
import VRControl from "three-mesh-ui/examples/utils/VRControl.js";
import * as HomeScene from "./HomeScene.js";
import * as VideoScene from "./VideoScene.js";

const scene = new THREE.Scene();
let parentCamera = new THREE.Object3D();
let camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
let context = {};
context.scene = scene;
parentCamera.add(camera);
parentCamera.position.set(0, 4, 0);
context.objsToTest = [];
context.camera = camera;

//raycasting
const raycaster = new THREE.Raycaster();
let currentSelected = null;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(0, 10, 0);
controls.minDistance = 40.0;
controls.maxDistance = 200.0;
controls.enabled = false;
controls.update();
context.controls = controls;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

window.addEventListener("resize", function () {
  let aspectRatio = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
});

//Font
const FontJSON = "/fonts/SyneMono-Regular-msdf.json";
const FontImage = "/fonts/SyneMono-Regular-msdf.png";
context.FontJSON = FontJSON;
context.FontImage = FontImage;

//Audio
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);

//XR
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType("local");

//vr button
document.body.appendChild(VRButton.createButton(renderer));

//vr controls
let vrControl;
vrControl = VRControl(renderer, camera, scene);
scene.add(vrControl.controllerGrips[0], vrControl.controllers[0]);
vrControl.controllers[0].position.set(0, 30, -10);

vrControl.controllers[0].addEventListener("selectstart", () => {});
vrControl.controllers[0].addEventListener("selectend", () => {
  if (context.scene.name == "Home Scene" && currentSelected != null) {
    HomeScene.exit(context);
    VideoScene.enter(context, currentSelected.videoLink);
  }
  if (context.scene.name == "Video Scene") {
    VideoScene.PauseAndPlay(context);
  }
});
vrControl.controllers[0].addEventListener("squeezestart", () => {
  if (context.scene.name == "Home Scene") {
    HomeScene.EnableInstruction(context);
  }
});
vrControl.controllers[0].addEventListener("squeezeend", () => {
  if (context.scene.name == "Video Scene") {
    VideoScene.exit(context);
    HomeScene.enter(context);
  } else if (context.scene.name == "Home Scene") {
    HomeScene.DisableInstruction(context);
  }
});

//Update BUtton
function UpdateButtons() {
  // Find closest intersecting object
  let intersect;

  if (renderer.xr.isPresenting) {
    vrControl.setFromController(0, raycaster.ray);
    intersect = raycast();

    // Position the little white dot at the end of the controller pointing ray
    if (intersect) {
      vrControl.setPointerAt(0, intersect.point);
      if (currentSelected == null) {
        currentSelected = intersect.object;
        currentSelected.scale.set(1.3, 1.3, 1.3);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load("sounds/hover1.ogg", function (buffer) {
          sound.setBuffer(buffer);
          sound.setLoop(false);
          sound.setVolume(1);
          sound.play();
        });
      }
    } else if (!intersect) {
      vrControl.setPointerAt(0, new THREE.Vector3(0, 0, 0));
      if (currentSelected) {
        currentSelected.scale.set(1, 1, 1);
        currentSelected = null;
      }
    }
  }
}

//Raycasting
function raycast() {
  return context.objsToTest.reduce((closestIntersection, obj) => {
    const intersection = raycaster.intersectObject(obj, true);

    if (!intersection[0]) return closestIntersection;

    if (
      !closestIntersection ||
      intersection[0].distance < closestIntersection.distance
    ) {
      intersection[0].object = obj;

      return intersection[0];
    } else {
      return closestIntersection;
    }
  }, null);
}

//calling home screen
HomeScene.enter(context);

export function AddToInteractionList(obj) {
  context.objsToTest.push(obj);
}

function animate() {
  renderer.setAnimationLoop(render);
}
function render() {
  renderer.render(scene, camera);
  ThreeMeshUI.update();
  UpdateButtons();
  if (
    context.scene.name == "Video Scene" &&
    VideoScene.OnVideoEnd(context) == true
  ) {
    VideoScene.exit(context);
    HomeScene.enter(context);
  }
}

animate();
