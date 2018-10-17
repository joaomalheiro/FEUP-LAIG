class MyBaselessCylinder extends CGFobject{

   constructor(scene, height, baseRadius, topRadius, stacks, slices) {

        super(scene);

        this.height = height;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    };

    initBuffers() {

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {

                // defines the vertices
                this.vertices.push(
                    Math.cos(j * 2 * Math.PI / this.slices) * ((this.stacks - i) * (this.baseRadius - this.topRadius) / (this.stacks) + this.topRadius),
                    Math.sin(j * 2 * Math.PI / this.slices) * ((this.stacks - i) * (this.baseRadius - this.topRadius) / (this.stacks) + this.topRadius),
                    i / this.stacks * this.height);

                // defines the normals
                this.normals.push(Math.cos(j * 2 * Math.PI / this.slices),  Math.sin(j * 2 * Math.PI / this.slices), 0);

                // defines the texture coordinates
                this.texCoords.push(j / this.slices, i / this.stacks);
            }
        }

        // defines the indices
        for (var i = 0; i < this.stacks; i++) {
            for (j = 0; j < this.slices - 1; j++) {
                this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
                this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
            }

            this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
            this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    };
};