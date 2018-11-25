class MyWater extends Plane {

    constructor(scene,textureN, textureBandW, parts, heightScale, texScale){
        super(scene, parts, parts);

        this.time = 0;
        this.parts = parts;
        this.textureN = new CGFtexture(scene,textureN);
        this.textureBandW = new CGFtexture(scene,textureBandW);

        this.shader = new CGFshader(scene.gl, 'shaders/Water.vert', 'shaders/Water.frag');

        this.shader.setUniformsValues({uSampler2:1, heightScale: heightScale, texScale:texScale})
    }

    display() {
    
        // draw
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.shader);
        this.textureBandW.bind(0);
        this.textureN.bind(1);
        super.display();
        this.textureBandW.unbind(0);
        this.textureN.unbind(1);
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();

    }

    update(currTime){
        this.time += (currTime % 3000*0.0001);
        console.log(this.time);
        this.shader.setUniformsValues({timeFactor:this.time});
    }
}