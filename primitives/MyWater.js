class MyWater extends Plane {

    constructor(scene,textureN, textureBandW, parts, heightScale, texScale){
        super(scene, parts, parts);

        //initializing time variable
        this.time = 0;
        this.parts = parts;
        
        //color texture
        this.textureN = new CGFtexture(scene,textureN);

        //wavesmap
        this.textureBandW = new CGFtexture(scene,textureBandW);

        //initializing shader
        this.shader = new CGFshader(scene.gl, 'shaders/Water.vert', 'shaders/Water.frag');

        this.shader.setUniformsValues({uSampler2:1, heightScale: heightScale, texScale:texScale})
    }
    /*
    * Function to display the water primitive
    */
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
    /*
    * Function to update the height according to time
    */
    update(currTime){
        this.time += (currTime /30000);
        this.shader.setUniformsValues({timeFactor:this.time});
    }
}