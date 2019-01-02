class Animation {

    constructor(scene, id, time) {
        this.scene = scene;
        this.id = id;
        this.time = time * 1000;
        this.done = false;
        this.reverseDone = false;
        this.currentTime = 0;
        this.previousUpdate = 0;
        this.reverse = false;
        this.matrix = mat4.create();
    }

    apply(){
        this.scene.multMatrix(this.matrix);
    }


}

