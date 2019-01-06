class Board extends CGFobject {

    /*
    * Consctructor for the board object
    */
    constructor(scene, timePerPlay) {
        super(scene);
        this.scene = scene;
        this.timePerPlay = timePerPlay;
        this.animationCounter = 0;
        this.initComponents();
        this.initTextures();
        this.addBishops();
    }
    /**
     * Inits all the components that make a board, including the counter, the body, the grid and the holders
     */
    initComponents(){

        this.plane = new Plane(this.scene,10,10);

        this.whiteBishops = [];
        this.blackBishops = [];
        this.deadBlackBishops = [];
        this.deadWhiteBishops = [];
        
        this.counter = new Counter(this.scene, this, this.timePerPlay);

        this.body = new MyCylinder(this.scene, 1, 1, 1, 4, 4);

        this.holder = new Holder(this.scene);
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

        //glass appearance
        this.woodenAppearance = new CGFappearance(this.scene);
        this.woodenAppearance.loadTexture("scenes/images/wood.jpg");
		this.woodenAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.woodenAppearance.setAmbient(1,1,1,1);
		this.woodenAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.woodenAppearance.setSpecular(0.5,0.5,0.5,1);
        this.woodenAppearance.setShininess(10.0);
    }
    /**
     * Creates the bishops(both black and white), and push them into the board array of alive bishops
     */
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
                    this.scene.registerForPick( i * 10 + j, this.plane);
                   
                    this.scene.translate(-4.5,0.01,-4.5);
                    this.scene.translate(i, 0, j);
                    //this.scene.rotate(-Math.PI/2.0,1,0,0);
                   
                    if(this.scene.pickMode){
                        this.plane.display();
                    }
                this.scene.popMatrix();
            }
        }
    }

    //register bishops for picking
    bishopRegisterPicking(){
        
        for(let i = 0; i < this.whiteBishops.length; i++){
            this.scene.pushMatrix();

            if(this.scene.pickMode){
                let x = this.whiteBishops[i].row;
                let z = this.whiteBishops[i].column;
                let active = this.whiteBishops[i].active;
            this.scene.pushMatrix();
                if(active){
                    this.scene.translate(-4.5 + x ,0,-4.5 + z);   
                } else {
                    this.scene.translate(-6.5,0,-4.5 + this.whiteBishops[i].deadId);
                }
                this.scene.scale(0.55,0.70,0.55);
                if(active)
                this.scene.registerForPick(this.whiteBishops[i].row * 10 + this.whiteBishops[i].column, this.whiteBishops[i]);
                this.whiteBishops[i].display();
            this.scene.popMatrix();
    
            }
            this.scene.popMatrix();
        }

        for(let i = 0; i < this.blackBishops.length; i++){
            this.scene.pushMatrix();

            if(this.scene.pickMode){
                let x = this.blackBishops[i].row;
                let z = this.blackBishops[i].column;
                let active = this.blackBishops[i].active;
            this.scene.pushMatrix();
                if(active){
                    this.scene.translate(-4.5 + x ,0,-4.5 + z);   
                } else {
                    this.scene.translate(6,0,-4.5 + this.blackBishops[i].deadId);
                }
                this.scene.scale(0.55,0.70,0.55);
                if(active)
                this.scene.registerForPick(this.blackBishops[i].row * 10 + this.blackBishops[i].column, this.blackBishops[i]);
                this.blackBishops[i].display();
            this.scene.popMatrix();
    
            }
            this.scene.popMatrix();
        }
    }

    /**
     * Display function
     */
    display(){

        
        //display the top sphere of the bishop
        this.scene.pushMatrix();
            this.scene.scale(10, 1, 10);
            this.grid.apply();
            this.plane.display();
        this.scene.popMatrix();
        this.bishopsDisplay();

        this.scene.pushMatrix();
            this.scene.translate(0,0,-10);
            //this.scene.rotate(Math.PI/2.0,0,1,0);
            this.counter.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,10);
            this.scene.rotate(Math.PI,0,1,0);
            this.counter.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,-0.1,0);
            this.scene.scale(8,1,8);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI/4.0,0,0,1);
            this.woodenAppearance.apply();
            this.body.display();
        this.scene.popMatrix();

        this.registerPicking();
        this.bishopRegisterPicking();

        this.scene.pushMatrix();
        this.scene.translate(10,0.01,0);
        this.scene.scale(0.4,0.7,0.4);
        this.scene.rotate(Math.PI,0,1,0);
        this.holder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10,0.01,0);
        this.scene.scale(0.4,0.7,0.4);
        this.holder.display();
        this.scene.popMatrix();
    }
    /**
     * Function that updates the board
     * @param {*} deltaTime 
     */
    update(deltaTime){
        let isOver = this.counter.update(deltaTime);
        return isOver;
      }
    
    /**
     * Responsible for display both of the game bishops array
     */
    bishopsDisplay() {
        this.whiteBishopsDisplay();
        this.blackBishopsDisplay();
    }

    whiteBishopsDisplay() {
        for(let i = 0; i < this.whiteBishops.length; i++){
            let x = this.whiteBishops[i].row;
            let z = this.whiteBishops[i].column;
            let active = this.whiteBishops[i].active;
        this.scene.pushMatrix();
            if(active){
                this.scene.translate(-4.5 + x ,0,-4.5 + z);   
            } else {
                this.scene.translate(-10 - Math.floor(this.whiteBishops[i].deadId / 13),1.4,-6 + (this.whiteBishops[i].deadId % 13));
            }
            if(this.whiteBishops[i].animation != null && !this.whiteBishops[i].animation.done){
                this.whiteBishops[i].animation.update(Date.now());
                this.whiteBishops[i].animation.apply();  
                if(this.whiteBishops[i].animation.done)
                    this.animationCounter--; 
            }
            this.scene.scale(0.55,0.70,0.55);
            this.whiteBishops[i].display();
        this.scene.popMatrix();

        }
    }

    blackBishopsDisplay() {
        for(let i = 0; i < this.blackBishops.length; i++){
            let x = this.blackBishops[i].row;
            let z = this.blackBishops[i].column;
            let active = this.blackBishops[i].active;
        this.scene.pushMatrix();
            if(active){
                this.scene.translate(-4.5 + x ,0,-4.5 + z);   
            } else {
               this.scene.translate(10 + Math.floor(this.blackBishops[i].deadId / 13),1.4,-6 + (this.blackBishops[i].deadId % 13));
            }
            if(this.blackBishops[i].animation != null && !this.blackBishops[i].animation.done){
                this.blackBishops[i].animation.update(Date.now());
                this.blackBishops[i].animation.apply();
                if(this.blackBishops[i].animation.done)
                    this.animationCounter--;   
            }
            this.scene.scale(0.55,0.70,0.55);
            this.blackBishops[i].display();
        this.scene.popMatrix();
        }
    }

    /**
     * Called after a undoMove call. Reactivates a certain bishop
     * @param {*} bishop 
     */
    reactivate(bishop){
        bishop.active = true;
        bishop.deadId = null;
        if(this.deadBlackBishops[this.deadBlackBishops.length-1] === bishop){
            this.deadBlackBishops.pop();
        } else if(this.deadWhiteBishops[this.deadWhiteBishops.length-1] === bishop){
            this.deadWhiteBishops.pop();
        }
    }

    /**
     * Board function that makes a move, calling animations and changes in the bishop object and array
     * @param {*} startRow 
     * @param {*} startColumn 
     * @param {*} endRow 
     * @param {*} endColumn 
     * @param {*} rotate 
     */
    makeMove(startRow,startColumn,endRow,endColumn,rotate = true){
        if(rotate)
            this.scene.rotateCamera();
        
        let movingBishop = null;
        let deadBishop = null;
        for(let i = 0; i < this.whiteBishops.length ; i++) {
            if(startRow == this.whiteBishops[i].row && startColumn == this.whiteBishops[i].column
                && this.whiteBishops[i].active){
                movingBishop = this.whiteBishops[i];
            }
        }
        if(movingBishop == null) {
            for(let i = 0; i < this.blackBishops.length ; i++) {
                if(startRow == this.blackBishops[i].row && startColumn == this.blackBishops[i].column
                    && this.blackBishops[i].active){
                    movingBishop = this.blackBishops[i];
                }
            }
        }
        for(let i = 0; i < this.whiteBishops.length ; i++) {
            if(endRow == this.whiteBishops[i].row && endColumn == this.whiteBishops[i].column
                && this.whiteBishops[i].active){
                deadBishop = this.whiteBishops[i];
            }
        }
        if(deadBishop == null) {
            for(let i = 0; i < this.blackBishops.length ; i++) {
                if(endRow == this.blackBishops[i].row && endColumn == this.blackBishops[i].column
                    && this.blackBishops[i].active){
                    deadBishop = this.blackBishops[i];
                }
            }
        }
        
        if(movingBishop != null) {
            let controlPoints = [];
                controlPoints[0] = vec3.fromValues(startRow - endRow,0,startColumn - endColumn);
                controlPoints[1] = vec3.fromValues(startRow - endRow,1.5,startColumn - endColumn);
                controlPoints[2] = vec3.fromValues(0,1.5,0);
                controlPoints[3] = vec3.fromValues(0,0,0);

            this.animationCounter++;   
            movingBishop.animation = new LinearAnimation(this.scene,'moving',4,controlPoints);
            movingBishop.move(endRow,endColumn);
            console.log('MOVING', movingBishop);
        }
        if(deadBishop != null) {
            if(deadBishop instanceof BlackBishop){
                this.animationCounter++;   
                deadBishop.dead(this.deadBlackBishops.length);
                this.deadBlackBishops.push(deadBishop);
            } else  if(deadBishop instanceof WhiteBishop){
                this.animationCounter++;   
                deadBishop.dead(this.deadWhiteBishops.length);
                this.deadWhiteBishops.push(deadBishop);
            }
        }
        this.counter.clock.reset();
    }
}