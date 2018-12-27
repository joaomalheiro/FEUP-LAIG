class Board extends CGFobject {

    /*
    * Consctructor for the board object
    */
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.initComponents();
        this.initTextures();
        this.addBishops();
    }

    initComponents(){

        this.plane = new Plane(this.scene,10,10);

        this.square = new MyRectangle(this.scene,-0.5,-0.5,0.5,0.5);
        this.whiteBishops = [];
        this.blackBishops = [];
    }
    
    initTextures(){
        //wooden appearance
        this.grid = new CGFappearance(this.scene);
        this.grid.loadTexture("scenes/images/gridini.jpg");
		this.grid.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.grid.setAmbient(1,1,1,1);
		this.grid.setDiffuse(0.5,0.5,0.5,1);
		this.grid.setSpecular(0.5,0.5,0.5,1);
        this.grid.setShininess(10.0);

        //glass appearance
        this.glassAppearance = new CGFappearance(this.scene);
        this.glassAppearance.loadTexture("scenes/images/glass.jpg");
		this.glassAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.glassAppearance.setAmbient(1,1,1,1);
		this.glassAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.glassAppearance.setSpecular(0.5,0.5,0.5,1);
        this.glassAppearance.setShininess(10.0);
    }

    addBishops(){
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++){
                if(i % 2 == 0 && j % 2 != 0){
                    this.whiteBishops.push(new WhiteBishop(this.scene,i,j));
                }

                if(i % 2 !=0 && j % 2 == 0) {
                    this.blackBishops.push(new BlackBishop(this.scene,i,j));
                }
            }
        }
    }

    //register for picking
    registerPicking(){
        for(let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++) {
                this.scene.pushMatrix();
                    //console.log(i*10 + j);
                    this.scene.registerForPick( i * 10 + j, this.square);
                   
                    this.scene.translate(-4.5,0,-4.5);
                    this.scene.translate(i, 0, j);
                    this.scene.rotate(-Math.PI/2.0,1,0,0);
                   
                    if(this.scene.pickMode){
                        this.square.display();
                    }
                this.scene.popMatrix();
            }
        }
    }

    display(){

        //display the top sphere of the bishop
        this.scene.pushMatrix();
            this.scene.scale(10, 1, 10);
            this.grid.apply();
            this.plane.display();
        this.scene.popMatrix();
        this.bishopsDisplay();

        this.registerPicking();
    }

    bishopsDisplay() {
        this.whiteBishopsDisplay();
        this.blackBishopsDisplay();
    }

    whiteBishopsDisplay() {
        for(let i = 0; i < this.whiteBishops.length; i++){
            let x = this.whiteBishops[i].row;
            let z = this.whiteBishops[i].column;
        this.scene.pushMatrix();
            this.scene.translate(-4.5 + x ,0,-4.5 + z);
            this.scene.scale(0.55,0.70,0.55);
            this.whiteBishops[i].display();
        this.scene.popMatrix();

        }
    }

    blackBishopsDisplay() {
        for(let i = 0; i < this.blackBishops.length; i++){
            let x = this.blackBishops[i].row;
            let z = this.blackBishops[i].column;
        this.scene.pushMatrix();
            this.scene.translate(-4.5 + x ,0,-4.5 + z);
            this.scene.scale(0.55,0.70,0.55);
            this.blackBishops[i].display();
        this.scene.popMatrix();
        }
    }
}