import * as THREE from '../libs/three.module.js';

import {Camera} from './Camera.js';
import {Terrain} from './Terrain.js';
import {GeneralLights} from './GeneralLights.js';

export class SceneManager{
	constructor(canvas, dimensions){
		this.canvas = canvas;
		this.dimensions = dimensions;
		this.clock = new THREE.Clock();
		this.scene = this.buildScene();

		// (TODO): arreter de passer scene en parametre c'est pas une bonne pratique
		this.superman_view = new Camera(this.scene, this.dimensions.width, this.dimensions.height);
		this.generalLights = new GeneralLights(this.scene);
		//this.terrain = new Terrain(this.scene);
		// --------------------------------------------------------------------------

		this.renderer = this.buildRender(this.dimensions);
		this.sceneEntities;

		//temporaire
		this.myBool=0;
		this.it=0.01;
		//----------

		this.modelsData = [];
	}

	// Its deserialize scene graph
	serializeSceneGraph(sceneGraph, textInputValue){
		sceneGraph.emptySceneTree();
		const sceneInfo = sceneGraph.instantiateScene(
													this.scene.type,
													textInputValue,
													this.scene.background);
		sceneGraph.tree.push(sceneInfo);

		  for (let i = 0;i < this.scene.children.length; ++i) {
		  if(this.scene.children[i].type == "Object3D"){
		  const model = sceneGraph.instantiateModel(
													this.scene.children[i].type,
													this.scene.children[i].name,
													this.scene.children[i].position,
													this.scene.children[i].rotation,
													this.scene.children[i].scale );
		  sceneGraph.tree.push(model);
		  }
		  else if(this.scene.children[i].type == "PerspectiveCamera"){
		  const camera = sceneGraph.instantiateCamera(
														this.scene.children[i].type,
														this.scene.children[i].name,
														this.scene.children[i].position,
														this.scene.children[i].rotation,
														this.scene.children[i].fov,
														this.scene.children[i].near,
														this.scene.children[i].far,
														this.scene.children[i].focus  );
		  sceneGraph.tree.push(camera);
		  }
		  else if(this.scene.children[i] instanceof THREE.Light){
		  const light = sceneGraph.instantiateLight(
														this.scene.children[i].type,
														this.scene.children[i].name,
														this.scene.children[i].position,
														this.scene.children[i].rotation,
														this.scene.children[i].color );

		  sceneGraph.tree.push(light);
		  }
		}
	}

	initSceneBasic(sceneData){
		this.modelsData = [];

		for(let i = 0; i < sceneData.length; ++i){
			if(sceneData[i].type == "Scene"){
				this.updateSceneInfo(sceneData[i]);
			}
			if(sceneData[i].type == "PerspectiveCamera"){
				this.superman_view.buildCamera(this.scene, sceneData[i]);
				//make camera class so we can have multiple cameras
			}
			if(sceneData[i].type == "PointLight"){
				this.generalLights.addPointLight(this.scene, sceneData[i]);
			}
			if(sceneData[i].type == "AmbientLight"){
				this.generalLights.addAmbientLight(this.scene, sceneData[i]);
			}
			if(sceneData[i].type == "Object3D"){
				this.modelsData.push(sceneData[i]);
			}
		}
	}

	updateSceneInfo(nodeData){
		this.scene.name = nodeData.name;
		let c = new THREE.Color();
		c.set(nodeData.color);
		this.scene.background =  c;
	}

  	empty(){
		while(this.scene.children.length > 0){
			this.scene.remove(this.scene.children[0]);
		}
 	}

  	getCamera(){
    	return this.superman_view;
  	}

	init(){
		let gridHelper = new THREE.GridHelper(10, 10);
		this.scene.add(gridHelper)
		this.terrain = new Terrain(this.scene);
	}

	update(){
		const elapsedTime = this.clock.getElapsedTime();
		this.renderer.render(this.scene, this.superman_view.camera);
	}

	buildScene(name="scene_0"){
			const scene = new THREE.Scene();
			scene.name = name;

			return scene;
	}

	buildRender({width, height}){
		//const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
			const renderer = new THREE.WebGLRenderer({canvas: canvas,
													antialias: true,
													alpha: true});

			// Les texures en glTF utilise toujours un encodage sRGB
			renderer.outputEncoding = THREE.sRGBEncoding;
			//Sert à prévenir les écrans HiDPI de brouiller l'output du canvas
			//renderer.setPixelRatio(DPR);
			renderer.setSize(width, height);

			return renderer;
	}

	// util -----------------------------
	onWindowResize(){
		const { width, height } = canvas;

		this.dimensions.width = width;
		this.dimensions.height = height;

		this.superman_view.camera.aspect = width / height;
		this.superman_view.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}
}