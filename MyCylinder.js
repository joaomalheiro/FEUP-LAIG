/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject{

  constructor(scene, height, radiusBottom, radiusTop, stacks, slices, layerTop, layerBottom) {
  
    super(scene);
    this.scene =scene;
    this.height = height;
    this.radiusBottom = radiusBottom;
    this.radiusTop = radiusBottom;
    this.slices = slices;
    this.stacks = stacks;
    this.baselessCylinder = new MyBaselessCylinder(scene,height,radiusBottom,radiusTop,stacks,slices);
    this.layerTop = layerTop;
    this.layerBottom = layerBottom;

    this.circle = new MyCircle(scene, slices);

    this.initBuffers();
  }

  display() {


    this.baselessCylinder.display();

   this.scene.pushMatrix();
   this.scene.scale(this.radiusTop, this.radiusTop, 1);
   this.scene.translate(0, 0, this.height);
   this.circle.display();
   this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(this.radiusBottom, this.radiusBottom, 1);
    this.circle.display();
    this.scene.popMatrix();
};

  updateTexCoords(afS, afT) {
  this.updateTexCoordsGLBuffers();
};
}