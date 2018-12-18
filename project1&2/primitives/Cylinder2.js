class Cylinder2 extends CGFobject{

    /*
    * Consctructor of Cylinder2 primitive that will use nurbs surfaces
    */
   constructor(scene, height, baseRadius, topRadius, stacks, slices) {

        super(scene);

        this.height = height;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.nrDivsU = slices;
        this.nrDivsV = stacks;
        this.degreeU = 3;
        this.degreeV = 1;
        
        this.createControlPoints();
        this.createSurface();
    };
    /*
    * Auxiliary function requeried to create the control points for the cylinder based on height and radius
    */
    createControlPoints() {

        let xBottom = this.baseRadius;
        let xTop = this.topRadius;
        let z = this.height;
        let yBottom = 2* 2/3 * xBottom;
        let yTop = 2* 2/3 * xTop;

        var controlPoints = [];

        //control points will be created using 2 rectangles that will create half of the cylinder. the other half will be created with a rotate
        controlPoints.push([xBottom,0,0,1.0]);
        controlPoints.push([xTop,0,z,1.0]);
        controlPoints.push([xBottom,yBottom,0,1.0]);
        controlPoints.push([xTop,yTop,z,1.0]);
        controlPoints.push([-xBottom,yBottom,0,1.0]);
        controlPoints.push([-xTop,yTop,z,1.0]);
        controlPoints.push([-xBottom,0,0,1.0]);
        controlPoints.push([-xTop,0,z,1.0]);
        
        this.controlPointsList = [];
                
        for (var a = 0; a <= this.degreeU; a++) {
            var tmp = [];
            for (var b = 0; b <= this.degreeV; b++)
                tmp.push(controlPoints.shift());

            this.controlPointsList.push(tmp);
        }
    }
    /*
    * Function that will call the consctructors of the nurb objects with all the info generated previously
    */
    createSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.degreeU,this.degreeV, this.controlPointsList);
        
        this.obj = new CGFnurbsObject(this.scene, this.nrDivsU, this.nrDivsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

    /*
    * Display function for the primitive cylinder
    */
	display() {
		this.obj.display();
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI,0,0,1);
		this.obj.display();
		this.scene.popMatrix();
	}
};