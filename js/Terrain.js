export class Terrain{
	constructor(scene){
		this.model=scene.getObjectByName("terrain");
		this.width;
		this.height;
	}

	rotationX(){
		let increment = 0.10;
		this.model.rotateX(Math.PI*increment)
	}
}