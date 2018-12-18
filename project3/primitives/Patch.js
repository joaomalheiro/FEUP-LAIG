/** Represents a patch */
class Patch extends CGFobject{

    constructor(scene, nrDivsU, nrDivsV, degreeU, degreeV, controlPoints)
	{
		super(scene);

		// nrDivs = 1 if not provided
		nrDivsU = typeof nrDivsU !== 'undefined' ? nrDivsU : 1;
		nrDivsV = typeof nrDivsV !== 'undefined' ? nrDivsV : 1;
		
		this.controlPoints = controlPoints;
		this.degreeU = degreeU;
		this.degreeV = degreeV;
		this.nrDivsU = nrDivsU;
		this.nrDivsV = nrDivsV;

		this.createSurface();

	};
	//creating surfaces using nurbs provided objects
	createSurface() {

        var nurbsSurface = new CGFnurbsSurface(this.degreeU,this.degreeV, this.controlPoints);
        
        this.obj = new CGFnurbsObject(this.scene, this.nrDivsU, this.nrDivsV, nurbsSurface);
	}
	//displays the primitive
	display() {
		this.obj.display();
	}
}
