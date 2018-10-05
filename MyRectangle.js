function MyRectangle(scene, x0, y0, x1, y1) {
	CGFobject.call(this,scene);


	this.x0 = x0;
	this.x1 = x1;

	this.y0 = y0;
	this.y1 = y1;

	this.initBuffers();
};


MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;


MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
		this.x0, this.y1, 0,
		this.x1, this.y1, 0,
		this.x0, this.y0, 0,
		this.x1, this.y0, 0,
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
};


MyRectangle.prototype.setAmpSAmpT = function (ampS, ampT) {

	this.ampS = ampS;
	this.ampT = ampT;

	this.texCoords = [
		0, (this.y0 - this.y1) / this.ampT,
		(this.x1- this.x0) / this.ampS, (this.y0 - this.y1) / this.ampT,
		0, 0,
		(this.x1- this.x0) / this.ampS, 0,
	];

	this.setTex = true;

	this.updateTexCoordsGLBuffers();
};