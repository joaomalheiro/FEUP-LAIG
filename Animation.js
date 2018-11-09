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

class LinearAnimation extends Animation {
    constructor(scene,id,time,controlPoints){
        super(scene,id,time);
        this.controlPoints = controlPoints;
        this.totalDist = 0;
        //The increasing distance between control points
        this.vecDists = [];
        for(let i = 0; i < controlPoints.length - 1 ; i++) {
            let vectorDistance = Math.abs(vec3.distance(controlPoints[i],controlPoints[i + 1]));
            this.totalDist += vectorDistance;
            this.vecDists[i] = this.totalDist;
        }
    }

    update(deltaTime) {
        //Updates the animation counter, if it reaches the end it resets
        this.currentTime += deltaTime;
        if(this.currentTime > this.time) {
            this.currentTime = 0;
        }
        //How much distance the animation has travelled
        let currentDist = (this.currentTime / this.time) * this.totalDist;
        //Determines the controlPoint where the animation is ahead of
        let controlPoint;
        for(let i = 0; i < this.vecDists.length; i++){
            if(currentDist < this.vecDists[i]){
                controlPoint = i;
                break;
            }
        }

        //Calculates the distance between the start of the controlPoint vector to the point of the animation
        let distBetweenPoints = currentDist;
        if(controlPoint != 0){
            distBetweenPoints = currentDist - this.vecDists[controlPoint - 1];
        }

        //Translating the scene to the current animation point
        let mat = mat4.create();
        mat4.translate(mat,mat,this.controlPoints[controlPoint]);
        //The vector made by the 2 control points where the object is between
        let activeVector = vec3.create();
        activeVector = vec3.subtract(activeVector,this.controlPoints[controlPoint + 1],this.controlPoints[controlPoint]);

        let activeVectorSize = this.vecDists[controlPoint];
        if(controlPoint != 0) {
            activeVectorSize = this.vecDists[controlPoint] - this.vecDists[controlPoint - 1];
        }
        let distInVec = distBetweenPoints / activeVectorSize;
        vec3.multiply(activeVector,activeVector,vec3.fromValues(distInVec,distInVec,distInVec));
        mat4.translate(mat,mat,activeVector);
        this.matrix = mat;
    }
}