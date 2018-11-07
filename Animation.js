class Animation {

    constructor(scene, id, time) {
        this.scene = scene;
        this.id = id;
        this.time = time;
        this.done = false;
        this.currentTime = 0;
    }

    isDone() {
        return this.done;
    }
}

class LinearAnimation extends Animation {
    constructor(scene,id,time,controlPoints){
        super(scene,id,time);
        this.controlPoints = controlPoints;
    }

    update(deltaTime) {
        super.currentTime += deltaTime;
        let animPercentage = super.currentTime / super.time;
        let animState = this.controlPoints.length * animPercentage;
        let controlPoint = Math.floor(animState);
        let percentageControlPoint = animState - controlPoint;

        let vecDistance = vec3.subtract(this.controlPoints[controlPoint],this.controlPoints[controlPoint + 1]);
        vecDistance *= percentageControlPoint;

        let mat = mat4.create();
        mat4.translate(mat,mat,vecDistance);
        scene.multMatrix(matrix);
    }
}