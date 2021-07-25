import "./style.css";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

let scene, water;
let instructionMesh = new THREE.Mesh(
  new THREE.BoxBufferGeometry(14, 7, 0),
  new THREE.MeshBasicMaterial()
);
const loader = new THREE.TextureLoader();
const instructionTex = loader.load("Textures/Instruction.jpg");
instructionMesh.material.map = instructionTex;
instructionMesh.position.set(0, 4, -4.5);
instructionMesh.visible = false;

let manager = new THREE.LoadingManager();
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
var loadPercentage;

function setUp(ctx) {
  scene = new THREE.Object3D();
  ctx.scene.name = "Home Scene";
  waterSetup();
  skyBoxSetUp(ctx);
  animate();
  CreateUI(ctx);
  MenuScreen(ctx);
  ctx.scene.add(instructionMesh);
  manager.onProgress = function (item, loaded, total) {
    loadPercentage = (loaded / total) * 100 + "%";
    console.log(loadPercentage);
  };

  const audioLoader = new THREE.AudioLoader(manager);
  audioLoader.load("sounds/Mellow.ogg", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.play();
    var soundButton = document.getElementById("soundButton");
    soundButton.addEventListener("click", toggleSound, false);
    var img = document.getElementById("soundBtnImg");
    function toggleSound() {
      img.src = "/Textures/volume down.png";
      if (sound.isPlaying) {
        sound.pause();
      } else {
        img.src = "/Textures/volume up.png";
        sound.play();
      }
    }
  });
}

function waterSetup() {
  // set water geometry
  const waterGeometry = new THREE.PlaneGeometry(550, 550);

  //water
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader(manager).load(
      "../Textures/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    alpha: 1.0,
    waterColor: 0x74ccf4,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);
}

function skyBoxSetUp(ctx) {
  //skybox
  let materialArray = [
    "Skybox/valley_ft.jpg",
    "Skybox/valley_bk.jpg",
    "Skybox/valley_up.jpg",
    "Skybox/valley_dn.jpg",
    "Skybox/valley_rt.jpg",
    "Skybox/valley_lf.jpg",
  ];
  let cubeTextureLoader = new THREE.CubeTextureLoader(manager);
  let skyBox = cubeTextureLoader.load(materialArray);
  ctx.scene.background = skyBox;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const time = performance.now() * 0.001;
  water.material.uniforms["time"].value += 1.0 / 300.0;
}

export function CreateUI(ctx) {
  const topContainer = new ThreeMeshUI.Block({
    height: 6,
    width: 50,
    backgroundOpacity: 0,
    justifyContent: "center",
  });
  scene.add(topContainer);
  topContainer.position.set(0, 15, -15);

  const text = new ThreeMeshUI.Text({
    content: "Simulated Stereo",
    fontFamily: ctx.FontJSON,
    fontTexture: ctx.FontImage,
    fontSize: 5,
  });
  topContainer.add(text);

  const imageBlock = new ThreeMeshUI.Block({
    height: 5,
    width: 4,
  });
  const loader = new THREE.TextureLoader(manager);

  loader.load("Textures/logo.png", (texture) => {
    imageBlock.set({ backgroundTexture: texture });
  });
  imageBlock.position.set(-17, 0, 0);
  text.position.set(3.5, 0, 0);
  topContainer.add(imageBlock);
}

export function MenuScreen(ctx) {
  //Video Button 1
  const videoButton1 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.2360679775, 1.61803398875, 0),
    new THREE.MeshBasicMaterial()
  );
  scene.add(videoButton1);
  videoButton1.position.set(-8, 5, -6);
  videoButton1.rotation.y = 0.4;
  const videoButtonTex1 = loader.load("Textures/Creations.jpg");
  videoButton1.material.map = videoButtonTex1;
  videoButton1.name = "Video Button 1";
  videoButton1.videoLink = "Video/Creations.mp4";

  //Video Button 2
  const videoButton2 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.2360679775, 1.61803398875, 0),
    new THREE.MeshBasicMaterial()
  );
  scene.add(videoButton2);
  videoButton2.position.set(-4, 5, -7);
  videoButton2.rotation.y = 0.2;
  const videoButtonTex2 = loader.load("Textures/Mercedes.jpg");
  videoButton2.material.map = videoButtonTex2;
  videoButton2.name = "Video Button 2";
  videoButton2.videoLink = "Video/Mercedes.mp4";

  //Video Button 3
  const videoButton3 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.2360679775, 1.61803398875, 0),
    new THREE.MeshBasicMaterial()
  );
  scene.add(videoButton3);
  videoButton3.position.set(0, 5, -7.5);
  const videoButtonTex3 = loader.load("Textures/VrRoller.jpg");
  videoButton3.material.map = videoButtonTex3;
  videoButton3.name = "Video Button 3";
  videoButton3.videoLink = "Video/VrRoller.mp4";

  //Video Button 4
  const videoButton4 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.2360679775, 1.61803398875, 0),
    new THREE.MeshBasicMaterial()
  );
  scene.add(videoButton4);
  videoButton4.position.set(4, 5, -7);
  videoButton4.rotation.y = -0.2;
  const videoButtonTex4 = loader.load("Textures/Thailand.jpeg");
  videoButton4.material.map = videoButtonTex4;
  videoButton4.name = "Video Button 4";
  videoButton4.videoLink = "Video/Thailand.mp4";

  //Video Button 4
  const videoButton5 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3.2360679775, 1.61803398875, 0),
    new THREE.MeshBasicMaterial()
  );
  scene.add(videoButton5);
  videoButton5.position.set(8, 5, -6);
  videoButton5.rotation.y = -0.4;
  const videoButtonTex5 = loader.load("Textures/Workplace.jpg");
  videoButton5.material.map = videoButtonTex5;
  videoButton5.name = "Video Button 5";
  videoButton5.videoLink = "Video/Workplace.mp4";

  ctx.objsToTest.push(
    videoButton1,
    videoButton2,
    videoButton3,
    videoButton4,
    videoButton5
  );
}

export function EnableInstruction(ctx) {
  instructionMesh.visible = true;
}

export function DisableInstruction(ctx) {
  instructionMesh.visible = false;
}

export function enter(ctx) {
  setUp(ctx);
  ctx.scene.add(scene);
}
export function exit(ctx) {
  ctx.scene.remove(scene);
  ctx.objsToTest = [];
  sound.stop();
}
