class Counter extends CGFobject {

    /*
    * Constructor for the counter game object
    */
    constructor(scene, board, timePerPlay) {
        super(scene);
        this.timePerPlay = timePerPlay;
        this.board = board;
        this.scene = scene;
        this.initTextures();
        this.initComponents();
       // this.updateNumberPieces();

       this.blackPiecesText1 = this.numbers[2];
       this.blackPiecesText2 = this.numbers[5];
       this.whitePiecesText1 = this.numbers[2];
       this.whitePiecesText2 = this.numbers[5];

       this.time = 0;
    }

    initComponents(){

        this.base = new MyCylinder(this.scene, 0.4, 1.0, 0.7, 4, 4);

        this.body = new MyCylinder(this.scene, 2.4, 3, 3, 4, 4);

        this.square = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.top_cylinder = new MyCylinder(this.scene, 0.3, 0.1, 0.1, 30, 30);

        this.top_sphere = new MySphere(this.scene, 0.2, 30, 30);

        this.clock = new Clock(this.scene, this.numbers, this.timePerPlay);

        this.plane = new Plane(this.scene,1,1);

        this.whitePieces1 = 2;
        this.whitePieces2 = 5;

        this.blackPieces1 = 2;
        this.blackPieces2 = 5;
    }

    updateNumberPieces() {

        let blackHelper = this.board.blackBishops.length - this.board.deadBlackBishops.length;
        let whiteHelper = this.board.whiteBishops.length - this.board.deadWhiteBishops.length;

        this.blackPieces1 = Math.floor(blackHelper / 10);
        this.blackPieces2 = blackHelper % 10;

        this.whitePieces1 = Math.floor(whiteHelper / 10);
        this.whitePieces2 = whiteHelper % 10;

        this.blackPiecesText1 = this.numbers[this.blackPieces1];
        this.blackPiecesText2 = this.numbers[this.blackPieces2];
        this.whitePiecesText1 = this.numbers[this.whitePieces1];
        this.whitePiecesText2 = this.numbers[this.whitePieces2];
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

    update(deltaTime){
        let isOver = false;
        this.time = this.time + deltaTime;

        if(this.time >= 1000) {

            isOver = this.clock.decTime();
            this.time = 0;
        }
        return isOver;
    }

    display(){

        this.woodenAppearance.apply();

        this.scene.pushMatrix();
            this.scene.translate(0,0.5,0);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);       
            this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,2.9,0);
            this.scene.scale(3.5,1.8,0.4);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);    
            this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.blackAppearance.apply();
            this.scene.scale(12, 2.5, 1.0);
            this.scene.translate(0, 0.3, 0.9);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-2.0,3.2,0);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);      
            this.top_cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2.0,3.2,0);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);      
            this.top_cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2.0,3.2,0);
            this.scene.scale(1,0.2,1);
            this.top_sphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-2.0,3.2,0);
            this.scene.scale(1,0.2,1);
            this.top_sphere.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.scale(1,2.3,1);
            this.scene.translate(-0.4,0.3,1);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.clock.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.blackPiecesText1.apply();
            this.scene.translate(-4,0.8,1);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.blackPiecesText2.apply();
            this.scene.translate(-2.8,0.8,1);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.whitePiecesText1.apply();
            this.scene.translate(2.8,0.8,1);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.whitePiecesText2.apply();
            this.scene.translate(4,0.8,1);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.plane.display();
        this.scene.popMatrix();
    }
}