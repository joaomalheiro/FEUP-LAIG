class BlackBishop extends Bishop {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene,row,column) {
        super(scene,row,column);
        this.scene = scene;
        this.selected = false;
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

    dead(deadId){
    let controlPoints = [];
        controlPoints[0] = vec3.fromValues(-14.5 - Math.floor(deadId / 13) + this.row,-1.4,1.5 -(deadId % 13) + this.column);
        controlPoints[1] = vec3.fromValues(-14.5 - Math.floor(deadId / 13) + this.row,3.5,1.5 -(deadId % 13) + this.column);
        controlPoints[2] = vec3.fromValues(0,3.5,0);
        controlPoints[3] = vec3.fromValues(0,0,0);
    super.animation = new LinearAnimation(this.scene,'dead',4,controlPoints);
    super.dead(deadId);
    }

    isSelected(){
        if(this.selected){
            this.woodenAppearance.setAmbient(0.5,0.5,0,5,1);
        } else {
            this.woodenAppearance.setAmbient(1,1,1,1);
        }
    }

}