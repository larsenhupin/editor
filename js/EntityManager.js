import * as THREE from '../libs/three.module.js';

export class EntityManager {
	constructor(){
		this.objSelected;
	}

	placeEntities(scene, modelsData){
		let x, y, z, scale;
		let obj;
		let eulerRotation;

		for(let i = 0; i < modelsData.length; ++i){
			obj = scene.getObjectByName(modelsData[i].name);
			x = modelsData[i].position.x;
			y = modelsData[i].position.y;
			z = modelsData[i].position.z;
			scale = modelsData[i].scale.x; // ajouter x, y, z
			eulerRotation = new THREE.Euler( 	modelsData[i].rotation._x,
										modelsData[i].rotation._y,
										modelsData[i].rotation._z,
										modelsData[i].rotation.order );

			if (modelsData[i].scale.x > 0)
				obj.scale.set(scale, scale, scale);
			if (modelsData[i].rotation != undefined)
				obj.setRotationFromEuler(eulerRotation);
			obj.position.set(x,y,z);
		}
	}
}