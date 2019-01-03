class Clock extends CGFobject {

    /*
    * Constructor for the clock game object
    */
    constructor(scene , minutes, seconds, numbers) {
        super(scene);
        this.scene = scene;
        
        this.minutes = minutes;
        this.seconds = seconds;

        this.numbers = numbers;

        this.initComponents();
        this.initTextures();

        this.updateMinutesText();
        this.updateSecondsText();

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
    
    reset() {
        this.minutes = 0;
        this.seconds = 59;
    }

    decTime(){
        
        if(this.minutes == 0){
            if(this.seconds == 0){
                //PLAY CLOCK IS OVER
            } else {
                this.seconds--;
                this.updateSecondsText();
            }
        } else if(this.seconds == 0){
            this.seconds = 59;
            this.minutes--;
            this.updateSecondsText();
            this.updateMinutesText();
        } else {
            this.seconds--;
            this.updateSecondsText();
        }
    }

    updateSecondsText(){

        this.secondsNum1 = Math.floor(this.seconds / 10);
        this.secondsNum2 = this.seconds % 10;

        this.secondsTex1 = this.numbers[this.secondsNum1];
        this.secondsTex2 = this.numbers[this.secondsNum2];

    }

    updateMinutesText(){

        this.minutesTex1 = this.numbers[this.minutes];

    }

    display(){

        this.scene.pushMatrix();
            this.minutesTex1.apply();
            this.scene.translate(1,0,0);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.secondsTex1.apply();
            this.scene.translate(-1,0,0);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.secondsTex2.apply();
            this.scene.translate(-2,0,0);
            this.plane.display();
        this.scene.popMatrix();
    }
}