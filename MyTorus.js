
class MyTorus extends CGFobject{

    constructor(scene, inner, outer, slices, loops){

        super(scene);

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var nLoop = 0; nLoop <= this.loops; nLoop++) {

            let theta = nLoop * 2 * Math.PI / this.loops;

            let cTheta = Math.cos(theta);
            let sTheta = Math.sin(theta);


        for (var slice = 0; slice <= this.slices; slice++) {

            var phi = slice * 2 * Math.PI / this.slices;

            var sPhi = Math.sin(phi);
            var cPhi = Math.cos(phi);

            var x = (this.outer + (this.inner * cTheta)) * cPhi;
            var y = (this.outer + (this.inner * cTheta)) * sPhi;
            var z = this.inner * sTheta;
            var s = (nLoop / this.loops);
            var t = (slice / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(t, s);
        }
    }

    for (var nLoop = 0; nLoop < this.loops; nLoop++) {
        for (var slice = 0; slice < this.slices; slice++) {

            var a = (nLoop * (this.slices + 1)) + slice;
            var b = a + this.slices + 1;

            this.indices.push(a, b + 1, b);
            this.indices.push(a, a + 1, b + 1);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    };
}
