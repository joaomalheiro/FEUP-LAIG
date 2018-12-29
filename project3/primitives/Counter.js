class Counter extends CGFobject {

    /*
    * Constructor for the counter game object
    */
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initComponents();
        this.initTextures();
    }

    initComponents(){

        this.base = new MyCylinder(this.scene, 0.4, 1.0, 0.7, 4, 4);

        this.body = new MyCylinder(this.scene, 2.4, 3, 3, 4, 4);

        this.square = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.top_cylinder = new MyCylinder(this.scene, 0.3, 0.1, 0.1, 30, 30);

        this.top_sphere = new MySphere(this.scene, 0.2, 30, 30);

        this.clock = new Clock(this.scene, 1, 0);
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

        //glass appearance
        this.glassAppearance = new CGFappearance(this.scene);
        this.glassAppearance.loadTexture("scenes/images/glass.jpg");
		this.glassAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.glassAppearance.setAmbient(1,1,1,1);
		this.glassAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.glassAppearance.setSpecular(0.5,0.5,0.5,1);
        this.glassAppearance.setShininess(10.0);

        //black appearance
        this.blackAppearance = new CGFappearance(this.scene);
        this.blackAppearance.loadTexture("scenes/images/black_plastic.jpg");
		this.blackAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.blackAppearance.setAmbient(1,1,1,1);
		this.blackAppearance.setDiffuse(0.8,0.8,0.8,1);
		this.blackAppearance.setSpecular(0.8,0.8,0.8,1);
        this.blackAppearance.setShininess(10.0);
    }

    update(){
        this.clock.decTime();
    }

    display(){

        this.woodenAppearance.apply();

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);       
            this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,2.4,0);
            this.scene.scale(1.3,1,0.4);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);    
            this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.glassAppearance.apply();
            this.scene.scale(4.5, 2.0, 1.0);
            this.scene.translate(0, 0.6, 0.9);
            this.square.display();
        this.scene.popMatrix();

        this.blackAppearance.apply();

        this.scene.pushMatrix();
            this.scene.translate(-2.0,2.7,0);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);      
            this.top_cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2.0,2.7,0);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);      
            this.top_cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2.0,2.7,0);
            this.scene.scale(1,0.2,1);
            this.top_sphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-2.0,2.7,0);
            this.scene.scale(1,0.2,1);
            this.top_sphere.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(0,0,2);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.clock.display();
        this.scene.popMatrix();
    }
}