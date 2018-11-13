class Animation {

    constructor(scene, id, time) {
        this.scene = scene;
        this.id = id;
        this.time = time * 1000;
        this.done = false;
        this.currentTime = 0;
        this.matrix = mat4.create();
    }

    apply(){
        this.scene.multMatrix(this.matrix);
    }

    isDone() {
        return this.done;
    }
}

