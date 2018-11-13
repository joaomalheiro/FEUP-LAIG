class CircularAnimation extends Animation {
    constructor(scene,id,time,center,radius,initAngle,rotAngle){
        super(scene,id,time);
        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
    }

    update(deltaTime) {
    //Updates the animation counter, if it reaches the end it resets
    this.currentTime += deltaTime;
    if(this.currentTime > this.time) {
        this.currentTime = 0;
    }
    //Translating the scene to the center point
    let mat = mat4.create();
    mat4.translate(mat,mat,this.center);
    
    let animationPercentage = this.currentTime / this.time;
    let rotAngle = this.initAngle + (animationPercentage * this.rotAngle);
    mat4.rotate(mat,mat,rotAngle * DEGREE_TO_RAD,vec3.fromValues(0,1,0));

    let radius = vec3.fromValues(this.radius,0,0);
    mat4.translate(mat,mat,radius);
    
    this.matrix = mat;
    }


}