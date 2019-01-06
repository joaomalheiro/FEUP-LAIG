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
            this.scene.translate(4,0,4);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0)
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,4);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0)
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(4,0,0);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.5,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.5,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2.5,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(3,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

         this.scene.pushMatrix();
            this.scene.translate(3.5,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(4,2.05,2);
            this.scene.scale(1,1,16);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(2,2,4);
            this.scene.scale(15.5,1,1);
            this.scene.rotate(Math.PI/4.0,0,1,0);
            this.scene.rotate(-Math.PI/2.0,1,0,0);
            this.slice.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2,2,0);
        this.scene.scale(15.5,1,1);
        this.scene.rotate(Math.PI/4.0,0,1,0);
        this.scene.rotate(-Math.PI/2.0,1,0,0);
        this.slice.display();
    this.scene.popMatrix();
    }
}