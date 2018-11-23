class MyWater extends Plane {

    constructor(scene,textureN, textureBandW, parts, heightScale, texScale){
        super(scene, parts, parts);

        this.textureN = new CGFtexture(scene,textureN);
        this.textureBandW = new CGFtexture(scene,textureBandW);

        this.shader = new CGFshader(scene.gl, 'MyShader.vert', 'MyShader.frag');

        this.shader.setUniformsValues({uSampler2:1, heightScale: heightScale, texScale:texScale})
    }

    display() {
    
        // draw
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.shader);
        this.textureBandW.bind(0);
        this.textureN.bind(1);
        this.scene.scale(10,10,10);
        super.display();
        this.textureBandW.unbind(0);
        this.textureN.unbind(1);
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();

    }
}