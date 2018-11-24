/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class Plane extends CGFobject{

	constructor(scene, nrDivsU, nrDivsV)
	{
		super(scene);

		// nrDivs = 1 if not provided
		nrDivsU = typeof nrDivsU !== 'undefined' ? nrDivsU : 1;
		nrDivsV = typeof nrDivsV !== 'undefined' ? nrDivsV : 1;

		this.createSurface("0", nrDivsU, nrDivsV);

	};

	createSurface(id, nrDivsU, nrDivsV) {

		let controlPoints = [
			[
				[0.5,0.0,-0.5,1],
				[0.5,0.0, 0.5,1]
			],
			[
				[-0.5,0.0,-0.5,1],
				[-0.5,0.0, 0.5,1]
			]
		]
    	
        var nurbsSurface = new CGFnurbsSurface(1,1, controlPoints);
        
        this.obj = new CGFnurbsObject(this.scene, nrDivsU, nrDivsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display() {
		this.obj.display();
	}
};