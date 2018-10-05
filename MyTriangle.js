function MyTriangle(scene, x0, y0, z0, x1, y1, z1, x2, y2, z2) {
 	
 	CGFobject.call(this,scene);
 	this.setTex = false;
    this.p1 = [x0, y0, z0];
    this.p2 = [x1, y1, z1];
    this.p3 = [x2, y2, z2];
	this.initBuffers();
 };

/**
 * Create
 * @method create
 * @param   CGFobject.prototype
 * @return
 */
 MyTriangle.prototype = Object.create(CGFobject.prototype);

 /**
  * Constructor
  * @type
  */
 MyTriangle.prototype.constructor = MyTriangle;

/**
 * Init Buffers
 * @method function
 * @return
 */
 MyTriangle.prototype.initBuffers = function() {
	var p1 = this.p1;
	var p2 = this.p2;
	var p3 = this.p3;
    this.vertices = [
			p1[0],p1[1], p1[2],
			p2[0],p2[1], p2[2],
			p3[0],p3[1], p3[2]
			];

	this.indices = [0, 1, 2];
	var x = ((p2[1] - p1[1])*(p3[2] - p1[2]) - (p2[2] - p1[2])*(p3[1] - p1[1]))/Math.sqrt(Math.pow((p2[1] - p1[1])*(p3[2] - p1[2]) - (p2[2] - p1[2])*(p3[1] - p1[1]),2) + Math.pow((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0]) * (p3[2] - p1[2]),2) + Math.pow((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]),2));
    var y = ((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0])*(p3[2] - p1[2]))/Math.sqrt(Math.pow((p2[1] - p1[1])*(p3[2] - p1[2]) - (p2[2] - p1[2])*(p3[1] - p1[1]), 2) + Math.pow((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0])*(p3[2] - p1[2]),2) + Math.pow((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]),2));
    var z = ((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]))/Math.sqrt(Math.pow((p2[1] - p1[1])*(p3[2] - p1[2])- (p2[2] - p1[2])*(p3[1] - p1[1]), 2) + Math.pow((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0])*(p3[2] - p1[2]),2) + Math.pow((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]), 2));

    this.normals =[  x, y, z,
   					 x, y, z,
   					 x, y, z
    			];
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/**
 * Function to set the amplif factor of a determined texture
 * @method setAmpSAmpT
 * @param      ampS
 * @param      ampT
 */
 MyTriangle.prototype.setAmpSAmpT = function (ampS, ampT) {
 	this.ampS = ampS;
	this.ampT = ampT;

	var p1 = this.p1;
	var p2 = this.p2;
	var p3 = this.p3;

	this.b = Math.sqrt((p1[0] - p3[0]) * (p1[0] - p3[0]) +
			 		   (p1[1] - p3[1]) * (p1[1] - p3[1]) +
			 		   (p1[2] - p3[2]) * (p1[2] - p3[2]));

	this.c = Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) +
			 		   (p2[1] - p1[1]) * (p2[1] - p1[1]) +
			 		   (p2[2] - p1[2]) * (p2[2] - p1[2]));

	this.a = Math.sqrt((p3[0] - p2[0]) * (p3[0] - p2[0]) +
			 		   (p3[1] - p2[1]) * (p3[1] - p2[1]) +
			 		   (p3[2] - p2[2]) * (p3[2] - p2[2]));

	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);

	this.beta = Math.acos(this.cosBeta);

	this.texCoords = [
	  0, 0,
	  this.c / this.ampS, 0,
	  (this.c - this.a * Math.cos(this.beta)) / this.ampS, (this.a*Math.sin(this.beta)) / this.ampT,
    ];

	this.setTex = true;
	this.updateTexCoordsGLBuffers();
}