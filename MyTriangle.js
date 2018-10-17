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

    this.normals =[ x, y, z,
   					x, y, z,
   					x, y, z
    			];
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/**
 * Function to set the ratio of the texture using length_s and length_t
 * @method set_lengths_texture
 * @param      ampS
 * @param      ampT
 */
 MyTriangle.prototype.set_lengths_texture = function (length_s, length_t) {
 	this.length_s = length_s;
	this.length_t = length_t;

	var p1 = this.p1;
	var p2 = this.p2;
	var p3 = this.p3;

	this.a = Math.sqrt(math.pow(p1[0] - p3[0],2) +
			 		  math.pow(p1[1] - p3[1],2) +
			 		  math.pow(p1[2] - p3[2],2));

	this.b = Math.sqrt(math.pow(p2[0] - p1[0],2) +
			 		   math.pow(p2[1] - p1[1],2) +
			 		   math.pow(p2[2] - p1[2],2));

	this.c = Math.sqrt(math.pow(p3[0] - p2[0],2) +
			 		   math.pow(p3[1] - p2[1],2) +
			 		   math.pow(p3[2] - p2[2],2));

	this.cosBeta =  ( math.pow(this.a,2) - math.pow(this.b,2)+ math.pow(this.c,2)) / (2 * this.a * this.c);

	this.beta = Math.acos(this.cosBeta);

	this.texCoords = [
	
		
    ];

	this.setTex = true;
	this.updateTexCoordsGLBuffers();
}