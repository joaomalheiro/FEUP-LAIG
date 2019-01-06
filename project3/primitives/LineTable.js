class LineTable extends CGFobject {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initComponents();
    }

    initComponents(){

        this.leg = new MyCylinder(this.scene, 2, 0.2, 0.2, 4, 4);

        this.slice = new MyCylinder(this.scene, 0.05, 0.2, 0.2, 4, 4);
    }

    display(){

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2,0,2);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0)
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,2);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0)
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2,0,0);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.scale(1,1,2);
            this.scene.translate(1,1,1);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();
    }
}