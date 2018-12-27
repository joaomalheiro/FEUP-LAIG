class Clock extends CGFobject {

    /*
    * Constructor for the clock game object
    */
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initComponents();
        this.initTextures();
    }

    initComponents(){

        this.circle = new MyCircle(this.scene, 30);

        this.timePointer = new MyCylinder(this.scene, 1 , 0.1,0.1, 30 , 30);
    }
    
    initTextures(){
        //wooden appearance
        this.clockAppearance = new CGFappearance(this.scene);
        this.clockAppearance.loadTexture("scenes/images/clock.jpg");
		this.clockAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.clockAppearance.setAmbient(1,1,1,1);
		this.clockAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.clockAppearance.setSpecular(0.5,0.5,0.5,1);
        this.clockAppearance.setShininess(10.0);
    }

    display(){

        this.scene.pushMatrix();
            this.circle.display();
        this.scene.popMatrix();

        this.clockAppearance.apply();
        
        this.scene.pushMatrix();
            this.timePointer.display();
        this.scene.popMatrix();
    }
}