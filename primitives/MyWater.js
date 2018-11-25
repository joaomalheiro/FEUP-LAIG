class MyWater extends Plane {

    constructor(scene,textureN, textureBandW, parts, heightScale, texScale){
        super(scene, parts, parts);

        this.speed = 0.1;
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
        this.scene.scale(2,1,2);
        super.display();
        this.textureBandW.unbind(0);
        this.textureN.unbind(1);
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();

    }

    update(currTime){
        this.time += currTime/30000;
        this.shader.setUniformsValues({timeFactor:this.time});
    }
}