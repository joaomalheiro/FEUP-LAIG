class Holder extends CGFobject {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene) {
        super(scene);
       
        this.initComponents();
        this.initTextures();
    }

    initComponents(){

        this.base = new MyCylinder(this.scene, 0.2, 0.7, 0.7, 4, 4);

        this.support = new MyCylinder(this.scene, 2, 0.1, 0.1, 30, 30);
        this.top = new MyCylinder(this.scene, 0.2, 0.5, 0.5, 30, 30);
    }
    
    initTextures(){
        //wooden appearance
        this.woodenAppearance = new CGFappearance(this.scene);
        this.woodenAppearance.loadTexture("scenes/images/wood.jpg");
		this.woodenAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.woodenAppearance.setAmbient(1,1,1,1);
		this.woodenAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.woodenAppearance.setSpecular(0.5,0.5,0.5,1);
        this.woodenAppearance.setShininess(10.0);

        //wooden appearance
        this.blackAppearance = new CGFappearance(this.scene);
        this.blackAppearance.loadTexture("scenes/images/black_plastic.jpg");
		this.blackAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.blackAppearance.setAmbient(1,1,1,1);
		this.blackAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.blackAppearance.setSpecular(0.5,0.5,0.5,1);
        this.blackAppearance.setShininess(10.0);
    }

    display(){

        this.blackAppearance.apply();

        for(let i = 0; i < 25 ; i++) {

            this.scene.pushMatrix();
                this.scene.translate(0,2,-17.5+i*1.5);
                this.scene.rotate(Math.PI/2.0,1,0,0);
                this.support.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0,2,-17.5+i*1.5);
                this.scene.rotate(Math.PI/2.0,1,0,0);
                this.top.display();
            this.scene.popMatrix();
        }

        this.woodenAppearance.apply();

        this.scene.pushMatrix();
            this.scene.scale(5,1,40);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.95,-19.9);
            this.scene.scale(5,2,1);
            this.scene.rotate(Math.PI/4.0,0,0,1);
            this.scene.rotate(Math.PI/2.0,0,0,1);
            this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.95,19.7);
            this.scene.scale(5,2,1);
            this.scene.rotate(Math.PI/4.0,0,0,1);
            this.scene.rotate(-Math.PI/2.0,0,0,1);
            this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-2.47,0.95,0);
            this.scene.scale(1,2,40);
            this.scene.rotate(Math.PI/4.0,1,0,0);
            this.scene.rotate(Math.PI/2.0,0,1,0);
            this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2.25,0.95,0);
            this.scene.scale(1,2,40);
            this.scene.rotate(Math.PI/4.0,1,0,0);
            this.scene.rotate(Math.PI/2.0,0,1,0);
            this.base.display();
        this.scene.popMatrix();


    }
}