/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class Patch extends CGFobject{

    constructor(scene, nrDivsU, nrDivsV, controlPoints, degreeU, degreeV)
	{
		super(scene);

		// nrDivs = 1 if not provided
		nrDivsU = typeof nrDivsU !== 'undefined' ? nrDivsU : 1;
		nrDivsV = typeof nrDivsV !== 'undefined' ? nrDivsV : 1;

		this.controlPoints = controlPoints;

		this.createSurface("0", nrDivsU, nrDivsV, controlPoints,degreeU,degreeV);

	};

	createSurface(id, nrDivsU, nrDivsV, controlPoints, degreeU, degreeV) {
    	
        var nurbsSurface = new CGFnurbsSurface(degreeU,degreeV, controlPoints);
        
        this.obj = new CGFnurbsObject(this.scene, nrDivsU, nrDivsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display() {
		this.obj.display();
	}
}
