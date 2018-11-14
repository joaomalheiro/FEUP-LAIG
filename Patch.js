/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class Patch extends CGFobject{

    constructor(scene, nrDivsU, nrDivsV, degreeU, degreeV, controlPoints)
	{
		super(scene);

		// nrDivs = 1 if not provided
		nrDivsU = typeof nrDivsU !== 'undefined' ? nrDivsU : 1;
		nrDivsV = typeof nrDivsV !== 'undefined' ? nrDivsV : 1;
		
		console.log(controlPoints);
		this.controlPoints = controlPoints;
		this.degreeU = degreeU;
		this.degreeV = degreeV;
		this.nrDivsU = nrDivsU;
		this.nrDivsV = nrDivsV;

		this.createSurface();

	};

	createSurface() {
    	console.log(this.controlPoints);
    	console.log(this.degreeU);
    	console.log(this.degreeV);
    	console.log(this.nrDivsU);
    	console.log(this.nrDivsV);

        var nurbsSurface = new CGFnurbsSurface(this.degreeU,this.degreeV, this.controlPoints);
        
        this.obj = new CGFnurbsObject(this.scene, this.nrDivsU, this.nrDivsV, nurbsSurface );

        console.log(this.obj); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display() {
		this.obj.display();
	}
}
