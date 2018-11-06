class Animation {

    constructor(scene, id, speed) {
        this.scene = scene;
        this.id = id;
        this.speed = speed;
        this.done = false;
    }

    isDone() {
        return this.done;
    }
}