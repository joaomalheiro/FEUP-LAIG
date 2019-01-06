class TorusTower extends CGFobject {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initComponents();
    }

    initComponents(){

        this.torus = new MyTorus(this.scene, 0.3, 0.9, 30, 30);
    }

    display(){

        this.scene.pushMatrix();
        this.scene.scale(1,2,1);

        this.scene.pushMatrix();
            this.scene.scale(0.8,0.6,0.8);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.3,0);
            this.scene.scale(0.7,0.6,0.7);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.6,0);
            this.scene.scale(0.6,0.6,0.6);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.9,0);
            this.scene.scale(0.5,0.6,0.5);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,1.2,0);
            this.scene.scale(0.4,0.6,0.4);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,1.5,0);
            this.scene.scale(0.5,0.6,0.5);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,1.8,0);
            this.scene.scale(0.6,0.6,0.6);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,2.1,0);
            this.scene.scale(0.7,0.6,0.7);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,2.4,0);
            this.scene.scale(0.8,0.6,0.7);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.torus.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}