/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject{

  constructor(scene, height, radiusBottom, radiusTop, stacks, slices) {
  
    super(scene);
    this.scene =scene;
    this.height = height;
    this.radiusBottom = radiusBottom;
    this.radiusTop = radiusTop;
    this.slices = slices;
    this.stacks = stacks;
    this.baselessCylinder = new MyBaselessCylinder(scene,height,radiusBottom,radiusTop,stacks,slices);

    this.topCircle = new MyCircle(scene, slices);
    this.botCircle = new MyCircle(scene,slices);

    this.initBuffers();
  }

  display() {


    this.baselessCylinder.display();

    this.scene.pushMatrix();
    this.scene.scale(this.radiusTop,this.radiusTop, 1);
    this.scene.translate(0, 0, this.height);
    this.topCircle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(this.radiusBottom, this.radiusBottom, 1);
    this.botCircle.display();
    this.scene.popMatrix();
};

  updateTexCoords(afS, afT) {
  this.updateTexCoordsGLBuffers();
};
}