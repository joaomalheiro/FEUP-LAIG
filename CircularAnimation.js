class CircularAnimation extends Animation {
    constructor(scene,id,time,center,radius,initAngle,rotAngle){
        super(scene,id,time);
        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
    }

    update(time) {
    if(this.previousUpdate == 0) {
        this.previousUpdate = time;
    }
    let deltaTime = time - this.previousUpdate;
    this.previousUpdate = time;        
    this.currentTime += deltaTime;
    //Updates the animation counter, if it reaches the end it resets
    if(this.currentTime > this.time) {
        this.currentTime = this.time;
        this.done = true;
    }
    //Translating the scene to the center point
    let animationPercentage = this.currentTime / this.time;
    let rotAngle = this.initAngle + (animationPercentage * this.rotAngle);

    let mat = mat4.create();
    mat4.translate(mat,mat,this.center);
    
    
    mat4.rotate(mat,mat,rotAngle * DEGREE_TO_RAD,vec3.fromValues(0,1,0));

    let radius = vec3.fromValues(this.radius,0,0);
    mat4.translate(mat,mat,radius);
    
    this.matrix = mat;
    }


}