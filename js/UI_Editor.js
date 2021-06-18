export class Editor {
	constructor(mode=0){
		this.mode=mode;
	}

	create(scene){
		document.getElementById("scenenameinput").placeholder = scene.name;
		this.display(this.mode);
	}

	displaySaveSuccess(control){
		let elem = document.getElementById("saveSuccess");
		elem.style.display = "block";

		if(control)
		elem.textContent = "Save";
		else
		elem.textContent = "Save failed";

		setTimeout(function(){
			elem.style.display = "none";
		}, 2000);

	}

	showDestroy(){
		document.getElementById("destroy").style.display = "block";
	}

	hideDestroy(){
		document.getElementById("destroy").style.display = "none";
	}

	updateInputName(name){
		document.getElementById("scenenameinput").value = name;
	}

	updateMeshInfo(scene, name){
		document.getElementById("meshname").textContent = name;
		let mesh = scene.getObjectByName(name);

		let meshPosX = mesh.position.x;
		let meshPosY = mesh.position.y;
		let meshPosZ = mesh.position.z;

		let meshRosX = mesh.rotation._x;
		let meshRosY = mesh.rotation._y;
		let meshRosZ = mesh.rotation._z;

		let meshScaleX = mesh.scale.x;
		let meshScaleY = mesh.scale.y;
		let meshScaleZ = mesh.scale.z;

		document.getElementById("textPositionX").textContent = meshPosX.toFixed(2);
		document.getElementById("textPositionY").textContent = meshPosY.toFixed(2);
		document.getElementById("textPositionZ").textContent = meshPosZ.toFixed(2);
		document.getElementById("textRotationX").textContent = meshRosX.toFixed(2);
		document.getElementById("textRotationY").textContent = meshRosY.toFixed(2);
		document.getElementById("textRotationZ").textContent = meshRosZ.toFixed(2);
		document.getElementById("textScaleX").textContent = meshScaleX.toFixed(2);
		document.getElementById("textScaleY").textContent = meshScaleY.toFixed(2);
		document.getElementById("textScaleZ").textContent = meshScaleZ.toFixed(2);
	}

	// appeller la fonction showcamerainfo kekchose
	clearMeshInfo(scene){
		this.hideDestroy();
		let name = "PerspectiveCamera";
		document.getElementById("meshname").textContent = name;
		let mesh = scene.getObjectByName(name);

		document.getElementById("textPositionX").textContent = mesh.position.x.toFixed(2);
		document.getElementById("textPositionY").textContent = mesh.position.y.toFixed(2);
		document.getElementById("textPositionZ").textContent = mesh.position.z.toFixed(2);
		document.getElementById("textRotationX").textContent = mesh.rotation._x.toFixed(2);
		document.getElementById("textRotationY").textContent = mesh.rotation._y.toFixed(2);
		document.getElementById("textRotationZ").textContent = mesh.rotation._z.toFixed(2);
		document.getElementById("textScaleX").textContent = "-";
		document.getElementById("textScaleY").textContent = "-";
		document.getElementById("textScaleZ").textContent = "-";
	}

	display(mode, objSelected){

		//faire une boucle kekchose quand on va ajouter du UI

		if(mode){


			document.getElementById("sceneDisplay").style.display="flex";
			document.getElementById("save").style.display="block";
			document.getElementById("delete").style.display="block";
			document.getElementById("meshname").style.display="flex";
			document.getElementById("meshposition").style.display="flex";
			document.getElementById("meshrotation").style.display="flex";
			document.getElementById("meshscale").style.display="flex";
			document.getElementById("deselect").style.display="block";
			document.getElementById("barre").style.display="block";
			if(objSelected != "PespectiveCamera"){
				document.getElementById("destroy").style.display="block";
			}

			this.mode = 1;
		}
		else{

			document.getElementById("sceneDisplay").style.display="none";
			document.getElementById("save").style.display="none";
			document.getElementById("delete").style.display="none";
			document.getElementById("meshname").style.display="none";
			document.getElementById("meshposition").style.display="none";
			document.getElementById("meshrotation").style.display="none";
			document.getElementById("meshscale").style.display="none";
			document.getElementById("deselect").style.display="none";
			document.getElementById("barre").style.display="none";
			document.getElementById("destroy").style.display="none";
			this.mode = 0;
		}
	}
}