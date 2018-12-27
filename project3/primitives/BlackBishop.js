class BlackBishop extends Bishop {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene,row,column) {
        super(scene,row,column);
        this.scene = scene;
        this.initTextures();
    }
    initTextures(){
        //wooden appearance
        this.woodenAppearance = new CGFappearance(this.scene);
        this.woodenAppearance.loadTexture("scenes/images/leather.jpg");
        this.woodenAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
        this.woodenAppearance.setAmbient(1,1,1,1);
        this.woodenAppearance.setDiffuse(0,0,0,1);
        this.woodenAppearance.setSpecular(0,0,0,1);
        this.woodenAppearance.setShininess(10.0);
    }

}