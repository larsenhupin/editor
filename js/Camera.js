import * as THREE from '../libs/three.module.js';

export class Camera{
  constructor (scene, width, height){
    this.aspectRatio = width / height;
    this.camera;
    this.cameras = [];
  }
  
	update(time){
	}

  buildCamera(scene, cameraData){
    this.camera = new THREE.PerspectiveCamera(cameraData.fov, this.aspectRatio, cameraData.near, cameraData.far);
    this.camera.name = "PerspectiveCamera";
    this.cameras.push(this.camera);
    scene.add(this.camera);
    this.camera.position.set(cameraData.position.x, cameraData.position.y, cameraData.position.z);
  }

  getCamera(){
    return this.camera;
  }

  rotateX(){
    this.camera.rotation.x += 0.01;
  }

  rotateXReverse(){
    this.camera.rotation.x -= 0.01;
  }

  rotateY(){
    this.camera.rotation.y += 0.01;
  }

  rotateYReverse(){
    this.camera.rotation.y -= 0.01;
  }

  rotateZ(){
    this.camera.rotation.z += 0.01;
  }

  rotateZReverse(){
    this.camera.rotation.z -= 0.01;
  }


  moveUp(){
    this.camera.position.y += 1;
  }
  moveDown(){
    this.camera.position.y -= 1;
  }

  moveLeft(){
    this.camera.position.x -= 1;
  }

  moveRight(){
    this.camera.position.x += 1;
  }

  moveForward(){
    this.camera.position.z -= 1;
  }

  moveBackward(){
    this.camera.position.z += 1;
  }
}