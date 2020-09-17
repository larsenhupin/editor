import * as THREE from '../libs/three.module.js';
import {GLTFLoader} from '../libs/GLTFLoader.js';

export class FileManager {
	constructor(scene) {
		this.scene=scene;
		this.loadingManager = new THREE.LoadingManager();
		this.gltfLoader = new GLTFLoader(this.loadingManager);
		this.scenesNamesExt = [];
		this.scenesFilename = [];
		this.sceneData = [];
		this.modelsData = [];
	}

	onLoad = ( gltf, key) => {
		const model = gltf.scene.children[0];
		model.name = key;
		this.scene.add(model);
	}

	onProgress = (xhr) => { if(xhr.loaded / xhr.total * 100 == 100){ return true } };

	onError = ( errorMessage ) => { console.log( errorMessage ); };

	getSceneLeft(sceneName){
		console.log(this.scenesFilename);
		for(let i = 0; i < this.scenesFilename.length; ++i){
			if(this.scenesFilename[i] == sceneName){
				if(i == 0){
					return this.scenesFilename[this.scenesFilename.length-1];
				}
				else{
					return this.scenesFilename[i-1];
				}
			}
		}
	}

	getSceneRight(sceneName){
		for(let i = 0; i < this.scenesFilename.length; ++i){
			if(this.scenesFilename[i] == sceneName){
				if(i == this.scenesFilename.length-1){
					return this.scenesFilename[0];
				}
				else{
					return this.scenesFilename[i+1];
				}
			}
		}
	}

	emptySceneFilename(){
		this.scenesFilename.length = 0;
	  }

	getScenesFileNames(){
		this.emptySceneFilename();
		this.scenesNamesExt.length = 0;

		$.ajax({
			url: 'server/get_scenes_names.php',
			type: "POST"
		})
		.done(response => {

			response = JSON.parse(response);
			for(let i = 0; i < response.length; ++i){
				if(response[i] == '.'){
					response.splice(i, 1);
				}

				if(response[i] == '..'){
					response.splice(i, 1);
				}
			}
			this.scenesNamesExt = response;

			for(let i = 0; i < this.scenesNamesExt.length; ++i){
				this.scenesFilename.push(this.scenesNamesExt[i].slice(0, -5))
			}
		})
	}

	getSceneGraphData(name){
		let data;
		$.ajax({
			type: "POST",
			async: false,
			url: 'server/get_scene_graph.php',
			data: { scenename: name},
		})
		.done(response => {
			try{
			this.sceneData = JSON.parse(response);
			}catch (e){
				console.log(e);
			}
		})
	}

	saveToServer(textinput, tree){
		let sceneName;

		if(textinput == "")
			sceneName = sceneManager.scene.name;
		else
			sceneName = textinput;

		$.ajax
		({
				type: "POST",
				dataType : 'json',
				url: 'server/save_scene_graph.php',
				data: { data: JSON.stringify(tree),
						name: sceneName, }
		}).done(response => {
			console.log(response);
			if(response != 0){
				return 1;
			}
		})
	}

	deleteFromServer(sceneName){
		$.ajax
			({
				type: "POST",
				url: 'server/delete_scene_graph.php',
				data: { text: sceneName }
			}).done(response => {
				if(response == 1){
					//console.log("File " + sceneName + " has been deleted");
				}
			})
	}

	loadModels(modelsData){
		let model_url;
		let ext = ".glb";
		for(let i = 0; i < modelsData.length; ++i){
			model_url = "./assets/" + modelsData[i].name + ext;
			this.gltfLoader.load( model_url, gltf => this.onLoad( gltf, modelsData[i].name ), this.onProgress, this.onError );

		}
	}

	loadGLFT(data){
		let url;
		for (let key in data){
			url = "./assets/"+ data[key];
			this.gltfLoader.load( url, gltf => this.onLoad( gltf, key ), this.onProgress, this.onError );
		}
	}
}