class MyVehicle extends CGFobject {

    /*
    * Consctructor for the spaceship object
    */
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.initComponents();
        this.initTextures();
    }

    initComponents(){
        this.head = new Patch(this.scene, 50, 50, 2, // degree on U: 3 control vertexes U 
            2,  // degree on V: 3 control vertexes on V
            [ // U = 0
                [ // V = 0..1..2
                    [-1.0, 0.0, 0.0,1],
                    [-1.0, 0.0, 0.0,1],
                    [-1.0, 0.0, 0.0,1]
                ],
                // U = 1
                [ // V = 0..1..2
                    [0.0, 0.0, 2.0,1],
                    [0.0, 7.0, 0.0,1],
                    [0.0, 0.0, -2.0,1]
                ],
                // U = 2
                [ // V = 0..1..2
                    [1.0, 0.0, 0.0,1],
                    [1.0, 0.0, 0.0,1],
                    [1.0, 0.0, 0.0,1]
                ]
            ])

        //body
        this.cylinder = new Cylinder2(this.scene, 0.5, 1, 2, 30, 30);
        //legs 
        this.leg = new Cylinder2(this.scene, 1.3, 0.1,0.1,30,30);
        //top of cylinder2
        this.circle = new MyCircle(this.scene, 30);
        //ring of the spaceship
        this.torus = new MyTorus(this.scene, 0.1, 1.8, 30, 30);
    }

    initTextures(){
        //appearance for the windShield 
		this.glassAppearance = new CGFappearance(this.scene);
    	this.glassAppearance.loadTexture("scenes/images/glass.jpg");
		this.glassAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.glassAppearance.setAmbient(1,1,1,1);
		this.glassAppearance.setDiffuse(0,0,0,1);
		this.glassAppearance.setSpecular(1,1,1,1);
        this.glassAppearance.setShininess(120);

        //grey appearance
        this.grey = new CGFappearance(this.scene);
        this.grey.loadTexture("scenes/images/metal-knob.jpg");
		this.grey.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.grey.setAmbient(0.3,0.3,0.3,1);
		this.grey.setDiffuse(0.5,0.5,0.5,1);
		this.grey.setSpecular(0.5,0.5,0.5,1);
        this.grey.setShininess(10.0);

        //lightblue appearance for the bottom of the body
        this.lightBlue = new CGFappearance(this.scene);
        this.lightBlue.loadTexture("scenes/images/glass.jpg");
		this.lightBlue.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.lightBlue.setAmbient(0.5,0.8,1,1);
		this.lightBlue.setDiffuse(0.8,0.8,0.8,1);
		this.lightBlue.setSpecular(0.5,0.5,0.5,1);
        this.lightBlue.setShininess(10.0);

        this.red = new CGFappearance(this.scene);
        this.red.loadTexture("scenes/images/glass.jpg");
		this.red.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.red.setAmbient(1,0.3,0.3,1);
		this.red.setDiffuse(0.8,0.8,0.8,1);
		this.red.setSpecular(0.5,0.5,0.5,1);
        this.red.setShininess(10.0);
    
    }
    
    display(){

        //display the body
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.grey.apply();
            this.cylinder.display();
            this.scene.rotate(Math.PI,1,0,0);
            this.scene.translate(0,0,-1);
            this.lightBlue.apply();
            this.cylinder.display();
        this.scene.popMatrix();
        
        //displays the head
        this.scene.pushMatrix();
            this.glassAppearance.apply();
            this.head.display();
        this.scene.popMatrix();

        //displays the bottom
        this.scene.pushMatrix();
            this.scene.translate(0,-1,0);
            this.scene.scale(1.05,1,1.05);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.circle.display();
        this.scene.popMatrix();

        //displays the top
        this.scene.pushMatrix();
            this.scene.scale(1.05,1,1.05);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.circle.display();
        this.scene.popMatrix();

        //displays the torus
        this.scene.pushMatrix();
            this.scene.scale(1.05,1,1.05);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.red.apply();
            this.torus.display();
        this.scene.popMatrix();

        //displays legs
        this.scene.pushMatrix();
            this.red.apply();
            this.scene.translate(1,-0.8,1);
            this.scene.rotate(Math.PI/2.0,1,1,0);
            this.leg.display();
        this.scene.popMatrix();

        //displays legs
        this.scene.pushMatrix();
            this.red.apply();
            this.scene.translate(1,-0.8,-0.8);
            this.scene.rotate(Math.PI/2.0,1,1,0);
            this.leg.display();
        this.scene.popMatrix();

        //displays legs
        this.scene.pushMatrix();
            this.red.apply();
            this.scene.translate(1,-0.8,-0.8);
            this.scene.rotate(Math.PI/2.0,1,1,0);
            this.leg.display();
        this.scene.popMatrix();

        //displays legs
        this.scene.pushMatrix();
            this.red.apply();
            this.scene.translate(-1,-0.88,-0.8);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(-Math.PI/3.0,0,1,0);
            this.leg.display();
        this.scene.popMatrix();

        //displays legs
        this.scene.pushMatrix();
            this.red.apply();
            this.scene.translate(-1,-0.88,1);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(-Math.PI/3.0,0,1,0);
            this.leg.display();
        this.scene.popMatrix();
    }
}