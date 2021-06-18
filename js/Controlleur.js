import * as THREE from '../libs/three.module.js';

import {Editor} from './UI_Editor.js';
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

// Variables ---------------------------
let focus = 0;
let instersectables = [];
let models = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
// --------------------------------------

const sceneGraph = new SimplifiedSceneGraphe();
const sceneManager = new SceneManager(canvas, dimensions );
const fileManager = new FileManager(sceneManager.scene);
const entityManager = new EntityManager();
const editor = new Editor(1);


// temp/sert aux inputs
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
	editor.create(sceneManager.scene);
	editor.clearMeshInfo(sceneManager.scene);
	entityManager.objSelected = sceneManager.superman_view.camera.name;

	fileManager.loadModels(sceneManager.modelsData);

	fileManager.loadingManager.onLoad = function(){
		entityManager.placeEntities(sceneManager.scene, sceneManager.modelsData);
		//entityManager.placeEntities(sceneManager.scene, sceneManager.scene.superman_view.cameras);
		sceneManager.init();
		fillIntersectables();
		console.log(sceneManager.scene);
		Run = 1;
		render();
	};
}


/*function initDropAttributes(){
	let dropZone = document.getElementById("drop_zone");
	dropZone.setAttribute("ondrop","dropHandler(event)");
	dropZone.setAttribute("ondragover","dragOverHandler;"); 
}
*/

//ondrop="dropHandler(event);" ondragover="dragOverHandler(event);">

/*function dragOverHandler( event ){
	console.log("Files in drop zone");
	document.getElementById("drop_zone").style.backgroundColor = 'green';
}
*/

window.dragOverHandler = function(event){
	console.log("drag race");
	let dropZone = document.getElementById("drop_zone");
	dropZone.style.opacity = '0.5';
	event.preventDefault();
}

window.dragLeaveHandler = function(event){
	let dropZone = document.getElementById("drop_zone");
	dropZone.style.opacity = '0';
}

window.dropHandler = function( event ){
	console.log("Filedrop");
	event.preventDefault();

	let dropZone = document.getElementById("drop_zone");
	dropZone.style.opacity = '0';

	if(event.dataTransfer.items){ //Use DataTransferItemList interface to access the file
		for(let i = 0; i < event.dataTransfer.items.length; i++){
			//if dropped items aren't files, reject them
			if(event.dataTransfer.items[i].kind === 'file'){
				let file = event.dataTransfer.items[i].getAsFile();
				//models.push(file);
				
				//console.log('... file[' + i + '].name = ' + file.name);
			}
		}
	}

	let fileobj = event.dataTransfer.files[0];
	fileManager.ajax_file_upload(fileobj);
	//for (var i = 0; i < models.length; i++) {
		//console.log(models[i]);

		//fileManager.loadDropModel(models[i]);
	//}
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
		//drole de hack ici, il serait préférable de trouver un meilleure solution
		if(intersects[ 0 ].object.parent.parent != undefined){
			if(intersects[ 0 ].object.parent.parent.name == sceneManager.scene.name){
				// Faire d'autres fonction lala
				entityManager.objSelected = intersects[ 0 ].object.parent.name;
				editor.updateMeshInfo(sceneManager.scene, entityManager.objSelected);
			}
			else{
				entityManager.objSelected = intersects[ 0 ].object.parent.parent.name;
				editor.updateMeshInfo(sceneManager.scene, entityManager.objSelected);
			}

			if(editor.mode == 1)
				editor.showDestroy();
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
	editor.updateInputName(sceneName);
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
		editor.displaySaveSuccess(1);
	}
	else{
		editor.displaySaveSuccess(0);
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
	editor.clearMeshInfo(sceneManager.scene);
	entityManager.objSelected = "PerspectiveCamera";
	editor.hideDestroy();
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

	editor.updateMeshInfo(sceneManager.scene, name);

}

// ---------------------------------------------------------
// Quoi faire avec cette monstruosité ?
function move(direction){
	const name = entityManager.objSelected;
	console.log(name);
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
		editor.clearMeshInfo(sceneManager.scene);

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

		editor.updateMeshInfo(sceneManager.scene, name);
	}
	//changer le nom de cette chose
}

// ---------------------------------------------------------


function render(){
	if (!Run) return;


	// verify
	setTimeout( function() {
		requestAnimationFrame(render);
	}, 1000 / 60);
	sceneManager.update();
}


function onDocumentKeyDown(event){
	let keyCode = event.which;
	console.log(keyCode);

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
			case 222: editor.display(!editor.mode, entityManager.objSelected); break;
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
			//case 37: bool = 1;break;
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