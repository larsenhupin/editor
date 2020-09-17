import * as THREE from '../libs/three.module.js';

export class SimplifiedSceneGraphe{
  constructor (){
    this.tree = [];
  }

  emptySceneTree(){
    this.tree.length = 0;
  }

  instantiateScene(type, name, color){
    const scene = {};
    scene.type = type;
    scene.name = name;
    scene.color = color;

    return scene;
  }

  instantiateModel(type, name, position, rotation, scale){
    const model = {};
    model.type = type;
    model.name = name;
    model.position = position;
    model.rotation = rotation;
    model.scale = scale;

    return model;
  }

  instantiateCamera(type, name, position, rotation, FOV, nearPlane, farPlane, focus){
    const camera = {};
    camera.type = type;
    camera.name = name;
    camera.position = position;
    camera.rotation = rotation;
    camera.fov = FOV;
    camera.near = nearPlane;
    camera.far = farPlane;
    camera.focus = focus;

    return camera;
  }

  instantiateLight(type, name, position, rotation, color){
    const light = {};
    light.type = type;
    light.name = name;
    light.position = position;
    light.rotation = rotation;
    light.color = color;

    return light;
  }
}