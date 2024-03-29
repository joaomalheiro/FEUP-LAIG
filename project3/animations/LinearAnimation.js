class LinearAnimation extends Animation {
    constructor(scene,id,time,controlPoints){
        super(scene,id,time);
        this.controlPoints = controlPoints;
        this.totalDist = 0;
        this.previousUpdateReverse = 0;
        //The increasing distance between control points
        this.vecDists = [];
        for(let i = 0; i < controlPoints.length - 1 ; i++) {
            let vectorDistance = Math.abs(vec3.distance(controlPoints[i],controlPoints[i + 1]));
            this.totalDist += vectorDistance;
            this.vecDists[i] = this.totalDist;
        }
    }

    update(time) {
        //Updates the animation counter, if it reaches the end will stay in the last position
        if(this.previousUpdate == 0) {
            this.previousUpdate = time;
        }
        if(this.previousUpdateReverse == 0 && this.reverse){
            this.previousUpdateReverse = time;
        }
        let deltaTime;
        if(this.reverse){
            deltaTime = time - this.previousUpdateReverse;
            this.previousUpdateReverse = time;
        } else {
            deltaTime = time - this.previousUpdate;
            this.previousUpdate = time;
        } 
        if(this.reverse){
            this.currentTime -= deltaTime;
        } else {
            this.currentTime += deltaTime;
        }
        if(this.currentTime < 0 && this.reverse) {
            this.currentTime = 0;
            this.done = true;
            this.reverseDone = true;
        }
        if(this.currentTime > this.time) {
            this.currentTime = this.time;
            this.done = true;
        }
        //How much distance the animation has travelled
        let currentDist = (this.currentTime / this.time) * this.totalDist;
        //Determines the controlPoint where the animation is ahead of
        let controlPoint;
        for(let i = 0; i < this.vecDists.length; i++){
            if(currentDist <= this.vecDists[i]){
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
        let distInActiveVec = distBetweenPoints / activeVectorSize;
        vec3.multiply(activeVector,activeVector,vec3.fromValues(distInActiveVec,distInActiveVec,distInActiveVec));
        mat4.translate(mat,mat,activeVector);

        //Calculating the orientation
        let rotationAngle;
        if(activeVector[0] == 0) {
            rotationAngle = 0;
            if(activeVector[2] < 0) {
                rotationAngle = -180;
            }
        } else {
            rotationAngle = Math.tan(activeVector[2] / activeVector[0]);
        }
        mat4.rotate(mat,mat,rotationAngle,vec3.fromValues(0,1,0));
        this.matrix = mat;
    }
}