class Clock extends CGFobject {

    /*
    * Constructor for the clock game object
    */
    constructor(scene , minutes, seconds) {
        super(scene);
        this.scene = scene;
        
        this.minutes = minutes;
        this.seconds = seconds;

        this.initComponents();
        this.initTextures();

    }

    initComponents(){

        this.plane = new Plane(this.scene, 1, 1);
    }
    
    initTextures(){
        //wooden appearance
        this.clockAppearance = new CGFappearance(this.scene);
        this.clockAppearance.loadTexture("scenes/images//numbers/2.jpg");
		this.clockAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.clockAppearance.setAmbient(1,1,1,1);
		this.clockAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.clockAppearance.setSpecular(0.5,0.5,0.5,1);
        this.clockAppearance.setShininess(10.0);
    }

    decTime(){
        
        if(this.minutes == 0){
            if(this.seconds == 0){
                //PLAY CLOCK IS OVER
            } else {
                this.seconds--;
            }
        } else if(this.seconds == 0){
            this.seconds = 59;
            this.minutes--;
        } else {
            this.seconds--;
        }

        console.log(this.minutes);
        console.log(this.seconds);
    }

    display(){

        this.clockAppearance.apply();

        this.scene.pushMatrix();
            this.plane.display();
        this.scene.popMatrix();
    }
}