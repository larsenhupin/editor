import * as THREE from '../libs/three.module.js';

export class GeneralLights{
	contructor(scene){
		this.scene = scene;
		this.pointLight;
		this.ambientLight;
	}

	addPointLight(scene, lightData){
		let c = new THREE.Color();
		c.set(lightData.color);
		this.pointLight = new THREE.PointLight(c, 1);
		scene.add(this.pointLight);
		this.pointLight.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
	}


	addAmbientLight(scene, lightData){
		let c = new THREE.Color();
		c.set(lightData.color);
		this.ambientLight = new THREE.AmbientLight( c ); // soft white light
		scene.add(this.ambientLight);
	}

	update = function(time){
	}
}