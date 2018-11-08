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
        //console.log(this.time);
        this.controlPoints = controlPoints;
        this.totalDist = 0;
        //The distance between control points
        this.vecDists = [];
        for(let i = 0; i < controlPoints.length - 1 ; i++) {
            this.vecDists[i] = Math.abs(vec3.distance(controlPoints[i],controlPoints[i + 1]));
            this.totalDist += this.vecDists[i];
           // console.log(this.vecDists[i],i);
        }
    }

    update(deltaTime) {
        this.currentTime += deltaTime;
        if(this.currentTime > this.time) {
            this.currentTime = 0;
        }
        let currentDist = (this.currentTime / this.time) * this.totalDist;
        console.log(currentDist / this.totalDist * 100);
        //Determines the controlPoint where the animation is ahead of
        let controlPoint;
        //console.log(this.vecDists[0]);
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

        let mat = mat4.create();
        //console.log(this.controlPoints[controlPoint]);
        mat4.translate(mat,mat,this.controlPoints[controlPoint]);

        let activeVector = vec3.create();
        activeVector = vec3.subtract(activeVector,this.controlPoints[controlPoint + 1],this.controlPoints[controlPoint]);
        console.log(distBetweenPoints , this.vecDists[controlPoint]);
        let distInVec = distBetweenPoints / this.vecDists[controlPoint];
        vec3.multiply(activeVector,activeVector,vec3.fromValues(distInVec,distInVec,distInVec));
        console.log(activeVector);
        mat4.translate(mat,mat,activeVector);
        this.matrix = mat;
    }
}