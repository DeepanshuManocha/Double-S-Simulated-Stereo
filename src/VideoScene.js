import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let scene;
let video, minutes, seconds;
video = document.getElementById("video");

function SetUp(ctx, videoLink) {
  scene = new THREE.Object3D();
  ctx.scene.name = "Video Scene";
  SetUpVideo(videoLink);
  TimeFormat(ctx, video.duration);
}

function SetUpVideo(videoLink) {
  video.src = videoLink;
  const texture = new THREE.VideoTexture(video);
  texture.needsUpdate = true;
  const videoMaterial = new THREE.MeshBasicMaterial({ map: texture });

  const loader = new GLTFLoader();
  loader.load("mesh/SM_InvertedSphereNew.glb", function (gltf) {
    gltf.scene.children[0].material = videoMaterial;
    scene.add(gltf.scene);
  });
}

export function OnVideoEnd(ctx) {
  if (video.currentTime == video.duration) return true;
  else {
    return false;
  }
}

export function PauseAndPlay(ctx) {
  if (video.paused) video.play();
  else video.pause();
}

export function TimeFormat(ctx, time) {
  let i = setInterval(function () {
    if (video.readyState > 0) {
      minutes = parseInt(time / 60, 10);
      seconds = time % 60;
      console.log(minutes);
      console.log(seconds);
      clearInterval(i);
    }
  }, 200);
  console.log(i);
}

export function enter(ctx, videoLink) {
  SetUp(ctx, videoLink);
  ctx.scene.add(scene);
}
export function exit(ctx) {
  ctx.scene.remove(scene);
  video.pause();
}
