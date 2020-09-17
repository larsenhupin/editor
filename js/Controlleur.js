import * as THREE from '../libs/three.module.js';
import {Editor_UI} from './UI_Editor.js';
import {SceneManager} from './SceneManager.js';
import {SimplifiedSceneGraphe} from './SimplifiedSceneGraph.js';
import {FileManager} from './FileManager.js';
import {EntityManager} from './EntityManager.js';

const canvas = document.getElementById("canvas");

let Run = 1;
const dimensions = {
	width: canvas.width,
	height: canvas.height
}

let focus = 0;
let instersectables = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

const sceneGraph = new SimplifiedSceneGraphe();
const sceneManager = new SceneManager(canvas, dimensions );
const fileManager = new FileManager(sceneManager.scene);
const entityManager = new EntityManager();
const editor_UI = new Editor_UI(1);

// temporary ---------
let bool = 1;
// -------------------

bindEventListener();

// Default
createScene("default");

function createScene(sceneName){
	fileManager.getScenesFileNames();
	fileManager.getSceneGraphData(sceneName);
	sceneManager.initSceneBasic(fileManager.sceneData);

	resizeCanvas();
	editor_UI.create(sceneManager.scene);
	editor_UI.clearMeshInfo(sceneManager.scene);
	entityManager.objSelected = sceneManager.superman_view.camera.name;

	fileManager.loadModels(sceneManager.modelsData);

	fileManager.loadingManager.onLoad = function(){
		entityManager.placeEntities(sceneManager.scene, sceneManager.modelsData);
		//entityManager.placeEntities(sceneManager.scene, sceneManager.scene.superman_view.cameras);
		sceneManager.init();
		fillIntersectables();
		Run = 1;
		render();
	};
}

function fillIntersectables(){
	instersectables = [];
	for(let i = 0; i < sceneManager.scene.children.length; ++i){
		if(sceneManager.scene.children[i].type == "Object3D"){
			instersectables.push(sceneManager.scene.children[i]);
		}
	}
}

function click_mesh( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, sceneManager.superman_view.camera );
	let intersects = raycaster.intersectObjects(instersectables, true );

	if ( intersects.length > 0 ) {
		// Hacky method
		if(intersects[ 0 ].object.parent.parent != undefined){
			if(intersects[ 0 ].object.parent.parent.name == sceneManager.scene.name){
				entityManager.objSelected = intersects[ 0 ].object.parent.name;
				editor_UI.updateMeshInfo(sceneManager.scene, entityManager.objSelected);
			}
			else{
				entityManager.objSelected = intersects[ 0 ].object.parent.parent.name;
				editor_UI.updateMeshInfo(sceneManager.scene, entityManager.objSelected);
			}

			if(editor_UI.mode == 1)
				editor_UI.showDestroy();
		}
	}
}

function leftScene(){
	let nextSceneName = fileManager.getSceneLeft(sceneManager.scene.name);
	loadScene(nextSceneName);
}

function rightScene(){
	let nextSceneName = fileManager.getSceneRight(sceneManager.scene.name);
	loadScene(nextSceneName);
}

function loadScene(sceneName){
	sceneManager.empty();
	Run = 0;
	render();
	createScene(sceneName);
	editor_UI.updateInputName(sceneName);
}

function deleteScene(){
	let sceneNameDelete = sceneManager.scene.name;
	fileManager.deleteFromServer(sceneNameDelete);
	let nextSceneName = fileManager.getSceneRight(sceneNameDelete);
	fileManager.getScenesFileNames();
	loadScene(nextSceneName);
}

function saveScene(){
	let textInputValue = document.getElementById("scenenameinput").value;
	if(textInputValue == ""){
		textInputValue = sceneManager.scene.name;
	}
	sceneManager.serializeSceneGraph(sceneGraph, textInputValue);
	if(fileManager.saveToServer(textInputValue, sceneGraph.tree) != 0){
		editor_UI.displaySaveSuccess(1);
	}
	else{
		editor_UI.displaySaveSuccess(0);
	}

	fileManager.getScenesFileNames();
	loadScene(textInputValue);
}

function inputFocus(){
	focus = 1;
}

function inputBlur(){
	focus = 0;
}


function deselectMesh(){
	editor_UI.clearMeshInfo(sceneManager.scene);
	entityManager.objSelected = "PerspectiveCamera";
	editor_UI.hideDestroy();
}

function scale(control){
	const name = entityManager.objSelected;
	const obj = sceneManager.scene.getObjectByName(name);

	if(control == "bigger"){
		obj.scale.x += 1;
		obj.scale.y += 1;
		obj.scale.z += 1;
	}

	if(control == "smaller"){
		obj.scale.x -= 1;
		obj.scale.y -= 1;
		obj.scale.z -= 1;
	}

	editor_UI.updateMeshInfo(sceneManager.scene, name);
}

// Should be in input class --------------------------------------
function move(direction){
	const name = entityManager.objSelected;
	if(name == "PerspectiveCamera"){
		if(direction == "rotateX"){
			sceneManager.superman_view.rotateX();
		}

		if(direction == "rotateXReverse"){
			sceneManager.superman_view.rotateXReverse();
		}
		if(direction == "rotateY"){
			sceneManager.superman_view.rotateY();
		}
		if(direction == "rotateYReverse"){
			sceneManager.superman_view.rotateYReverse();
		}
		if(direction == "rotateZ"){
			sceneManager.superman_view.rotateZ();
		}
		if(direction == "rotateZReverse"){
			sceneManager.superman_view.rotateZReverse();
		}
		if(direction == "up"){
			sceneManager.superman_view.moveUp();
		}
		if(direction == "down"){
			sceneManager.superman_view.moveDown();
		}
		if(direction == "forward"){
			sceneManager.superman_view.moveForward();
		}
		if(direction == "backward"){
			sceneManager.superman_view.moveBackward();
		}
		if(direction == "left"){
			sceneManager.superman_view.moveLeft();
		}
		if(direction == "right"){
			sceneManager.superman_view.moveRight();
		}
		editor_UI.clearMeshInfo(sceneManager.scene);
	}
	else{
		const obj = sceneManager.scene.getObjectByName(name);

		if(direction == "rotateX"){
			obj.rotation.x += 0.1;
		}

		if(direction == "rotateXReverse"){
			obj.rotation.x -= 0.1;
		}
		if(direction == "rotateY"){
			obj.rotation.y += 0.1;
		}
		if(direction == "rotateYReverse"){
			obj.rotation.y -= 0.1;
		}
		if(direction == "rotateZ"){
			obj.rotation.z += 0.1;
		}
		if(direction == "rotateZReverse"){
			obj.rotation.z -= 0.1;
		}
		if(direction == "up"){
			obj.position.y += 1;
		}
		if(direction == "down"){
			obj.position.y -= 1;
		}
		if(direction == "forward"){
			obj.position.z -= 1;
		}
		if(direction == "backward"){
			obj.position.z += 1;
		}
		if(direction == "left"){
			obj.position.x -= 1;
		}
		if(direction == "right"){
			obj.position.x += 1;
		}
		editor_UI.updateMeshInfo(sceneManager.scene, name);
	}
}
// ---------------------------------------------------------

function render(){
	if (!Run) return;

	setTimeout( function() {
		requestAnimationFrame(render);
	}, 1000 / 60);
	sceneManager.update();
}

function onDocumentKeyDown(event){
	let keyCode = event.which;

	if(focus == 0){
		switch(keyCode){
			case 27:
			if (Run == 1){
					Run = 0;
				}
			else{
					Run = 1;
					render();
				}
			break;
			case 222: editor_UI.display(!editor_UI.mode, entityManager.objSelected); break;
			case 84: if(bool == 1){move("rotateX");} break;
			case 71: if(bool == 1){move("rotateXReverse");} break;
			case 82: if(bool == 1){move("rotateY");} break;
			case 89: if(bool == 1){move("rotateYReverse");} break;
			case 70: if(bool == 1){move("rotateZ");} break;
			case 72: if(bool == 1){move("rotateZReverse");} break;
			case 81: if(bool == 1){move("up");} break;
			case 69: if(bool == 1){move("down");} break;
			case 87: if(bool == 1){move("forward");} break;
			case 83: if(bool == 1){move("backward");} break;
			case 68: if(bool == 1){move("right");} break;
			case 65: if(bool == 1){move("left");} break;
			case 90: if(bool == 1){scale("smaller");} break;
			case 88: if(bool == 1){scale("bigger");} break;
		}
	}
}

function bindEventListener(){
	document.getElementById('deselect').addEventListener('click', deselectMesh);
	document.getElementById('scenenameinput').addEventListener('focus', inputFocus);
	document.getElementById('scenenameinput').addEventListener('blur', inputBlur);
	document.addEventListener('keydown', onDocumentKeyDown, false);
	window.addEventListener('resize', resizeCanvas, false);
	document.getElementById('buttonSceneLeft').addEventListener('click', leftScene);
	document.getElementById('buttonSceneRight').addEventListener('click', rightScene);
	document.getElementById('save').addEventListener('click', saveScene);
	document.getElementById('delete').addEventListener('click', deleteScene);
	document.addEventListener('click', click_mesh);
}

function toggleForm(status){
	if(status == 0)
		;
	else
		;

}

function resizeCanvas(){
	canvas.width = window.innerWidth -5;
	canvas.height = window.innerHeight -5;
	//sceneManager.dimensions = {width : window.innerWidth, height: window.innerHeight}
	sceneManager.onWindowResize();
}
