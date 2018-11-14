class Cylinder2 extends CGFobject{

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
    
    createControlPoints() {

        let xBottom = 2 * this.baseRadius;
        let xTop = 2 * this.topRadius;
        let z = this.height;
        let yBottom = 2/3 * xBottom;
        let yTop = 2/3 * xTop;

        var controlPoints = [];

        controlPoints.push([xBottom,0,0,1.0]);
        controlPoints.push([xTop,0,z,1.0]);
        controlPoints.push([xBottom,yBottom,0,1.0]);
        controlPoints.push([xTop,yTop,z,1.0]);
        controlPoints.push([0,yBottom,0,1.0]);
        controlPoints.push([0,yTop,z,1.0]);
        controlPoints.push([0,0,0,1.0]);
        controlPoints.push([0,0,z,1.0]);
        
        this.controlPointsList = [];
                
        for (var a = 0; a <= this.degreeU; a++) {
            var tmp = [];
            for (var b = 0; b <= this.degreeV; b++)
                tmp.push(controlPoints.shift());

            this.controlPointsList.push(tmp);
        }
    }

    createSurface() {
    	console.log(this.controlPointsList);
    	console.log(this.degreeU);
    	console.log(this.degreeV);
    	console.log(this.nrDivsU);
    	console.log(this.nrDivsV);

        var nurbsSurface = new CGFnurbsSurface(this.degreeU,this.degreeV, this.controlPointsList);
        
        this.obj = new CGFnurbsObject(this.scene, this.nrDivsU, this.nrDivsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	
        console.log(this.obj);
	}

	display() {
		this.obj.display();
	}
};