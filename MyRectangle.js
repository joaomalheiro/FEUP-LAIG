class MyRectangle extends CGFobject{
	
	constructor(scene, x0, y0, x1, y1) {

	super(scene);
	this.x0 = x0;
	this.x1 = x1;

	this.y0 = y0;
	this.y1 = y1;

	this.initBuffers();
	}

 	initBuffers(){
	this.vertices = [
		this.x0, this.y0, 0,
		this.x1, this.y0, 0,
		this.x0, this.y1, 0,
		this.x1, this.y1, 0,
	];

	this.indices = [
		0, 1, 2,
		3, 2, 1,
	];

	this.primitiveType=this.scene.gl.TRIANGLES;

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
	];

	this.initGLBuffers();
	}


	set_lengths_texture(length_s, length_t){

	this.length_s = length_s;
	this.length_t = length_t;

	this.texCoords = [
		0, (this.y1 - this.y0) / this.length_t,
		(this.x1- this.x0) / this.length_s, 
		(this.y1 - this.y0) / this.length_t,
		0, 0,
		(this.x1- this.x0) / this.length_s, 0,
	];

	this.setTex = true;

	this.updateTexCoordsGLBuffers();
};
}