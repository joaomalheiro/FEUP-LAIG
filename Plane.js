/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class Plane extends CGFobject{

	constructor(scene, nrDivsU, nrDivsV)
	{
		super(scene);

	    this.surfaces = [];
	    this.translations = [];

		// nrDivs = 1 if not provided
		nrDivsU = typeof nrDivsU !== 'undefined' ? nrDivsU : 1;
		nrDivsV = typeof nrDivsV !== 'undefined' ? nrDivsV : 1;

		this.nrDivsU = nrDivsU;
		this.nrDivsV = nrDivsV;

		this.patchLengthU = 1.0 / nrDivsU;
		this.patchLengthV = 1.0 / nrDivsV;

		createSurface("plane-0",1,1, [
		              [-0.5,0,-0.5],
		              [-0.5,0, 0.5],
		              [0.5,0,-0.5 ],
		              [0.5,0, 0.5 ]
		              ], 0
		              );

		this.initBuffers();

	};

	createSurface(id, degreeU, degreeV, controlPoints, translation) {
    
        var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
        var obj = new CGFnurbsObject(this, 20, 20, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

        this.surfaces.push(obj);	
		this.translations.push(translation);
	}
};