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

        this.numbers = [];

        for(let i = 0; i < 10; i++) {
            
            let appearance = new CGFappearance(this.scene);
            appearance.loadTexture("scenes/images/numbers/" + i + ".jpg");
            appearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
        	appearance.setAmbient(1,1,1,1);
		    appearance.setDiffuse(0.5,0.5,0.5,1);
	        appearance.setSpecular(0.5,0.5,0.5,1);
            appearance.setShininess(10.0);

            this.numbers.push(appearance);
        }
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