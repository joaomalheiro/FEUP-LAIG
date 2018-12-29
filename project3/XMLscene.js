var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.materialCounter = 0;
        this.activeBishop = null;
        this.pause = false;
        this.time = new Date().getTime();
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initInitialCamera();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setPickEnabled(true);

        this.board = new Board(this);
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {   
                        var customId = this.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);

                        console.log(obj);
                        if(!this.pause)
                            this.handleClickBoard(obj,customId);
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    }

    handleClickBoard(obj,customId) {
        if(obj instanceof Bishop) {
            if(this.activeBishop == null){
                this.activeBishop = obj;
            } else if(this.activeBishop == obj){
                this.activeBishop = null;
                console.log('thesame');
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof WhiteBishop){
                this.activeBishop = obj;
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof BlackBishop) {
                this.board.makeMove(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof BlackBishop){
                this.activeBishop = obj;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof WhiteBishop){
                this.board.makeMove(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
            }
        } else if (obj instanceof Plane) {
            let endRow = Math.floor(customId / 10);
            let endColumn = customId % 10;
            if(this.activeBishop != null) {
                this.board.makeMove(this.activeBishop.row,this.activeBishop.column,endRow,endColumn);
            }
        }

        console.log(this.activeBishop);
    }
    /**
     * Initializes the scene cameras.
     */
    initCameras() {

       //initializes the views Map that will countain both the perspective cameras and the ortho ones, based on ID
       this.views = new Map();
       var def = 0;

       //cycle for the perspective cameras
       for(let perspective_model of this.graph.perspectives){

            if(this.graph.defaultViewID == perspective_model.id)
                def = perspective_model.id;
            this.views.set(perspective_model.id,new CGFcamera(DEGREE_TO_RAD *perspective_model.angle,perspective_model.near,perspective_model.far,perspective_model.from,perspective_model.to));
        }

        //cycle for the ortho cameras
        for(let ortho_model of this.graph.orthos){

            if(this.graph.defaultViewID == ortho_model.id)
                def = perpective_model.id;
            this.views.set(ortho_model.id,new CGFcameraOrtho(ortho_model.left,ortho_model.right,ortho_model.bottom,ortho_model.top,ortho_model.near,ortho_model.far,ortho_model.from,ortho_model.to,[0,1,0]));
        }

        //Setting up the default camera, if there is one that matches the default given
        if (def != null){
            this.camera = this.views.get(def);
            this.interface.setActiveCamera(this.views.get(def));
        } else {
            console.log('The default ID for the views did not match any parsed camera of the XML file')
        }

        console.log('Created Cameras!');
    }

    /**
    * Initializes the initial Camera
    */
    initInitialCamera(){
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
    * Initializes the scene materials
    */
    initMaterials() {

        this.materials = [];
        this.materials["default"] = new CGFappearance(this);
        this.materials["default"].setAmbient(0,0,0,0);
        this.materials["default"].setSpecular(0,0,0,0);
        this.materials["default"].setDiffuse(0,0,0,0);
        this.materials["default"].setEmission(0,0,0,0);
        this.materials["default"].setShininess(0);

        //Cycle to iterate the materials info map created in SceneGraph. Creates the material and pushes it into the CGFMaterial array
        for(const [k,v] of this.graph.materials.entries()) {
            this.materials[k] = new CGFappearance(this);
            this.materials[k].setAmbient(v.ambient[0],v.ambient[1],v.ambient[2],v.ambient[3]);
            this.materials[k].setSpecular(v.specular[0],v.specular[1],v.specular[2],v.specular[3]);
            this.materials[k].setDiffuse(v.diffuse[0],v.diffuse[1],v.diffuse[2],v.diffuse[3]);
            this.materials[k].setEmission(v.emission[0],v.emission[1],v.emission[2],v.emission[3]);
            this.materials[k].setShininess(v.shininess);
        }
        console.log("Materials created !")
    }

    /**
    * Initializes the scene textures
    */
    initTextures() {

       this.textures = [];

       //Cycle to iterate the texture info map created in SceneGraph. Creates the texture and pushes it into the CGFtexture array
       for(const [k,v] of this.graph.textures.entries()){
            this.textures[k] = new CGFtexture(this,v.file);
        }
        console.log("Textures created !")
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];
                //If it is an omni light
                if(light.length == 5){
                    this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                    this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                    this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                    this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
                }
                //If it is a spot light
                else if(light.length == 8){
                    this.lights[i].setPosition(light[3][0], light[3][1], light[3][2], light[3][3]);
                    this.lights[i].setAmbient(light[5][0], light[5][1], light[5][2], light[5][3]);
                    this.lights[i].setDiffuse(light[6][0], light[6][1], light[6][2], light[6][3]);
                    this.lights[i].setSpecular(light[7][0], light[7][1], light[7][2], light[7][3]);
                    this.lights[i].setSpotCutOff(light[1]);
                    this.lights[i].setSpotExponent(light[2]);
                    this.lights[i].setSpotDirection(light[4][0]-light[3][0],light[4][1]-light[3][1],light[4][2]-light[3][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.axis = new CGFaxis(this, this.graph.axisLength);
        this.selectedCamera = this.graph.defaultViewID;

        this.initMaterials();
        this.initTextures();
        this.initCameras();

        this.setGlobalAmbientLight(this.graph.ambientR,this.graph.ambientG,this.graph.ambientB,this.graph.ambientA);
        this.gl.clearColor(this.graph.backgroundR,this.graph.backgroundG,this.graph.backgroundB,this.graph.backgroundA);

        this.initLights();

        //adds lights group
        this.interface.addLightsGroup(this.graph.lights);
        //adds cameras group to the interface
        this.interface.addCamerasGroup(this.views);

        this.sceneInited = true;

        this.setUpdatePeriod(1000/120);

    }
    /**
    * Auxiliary function that sets the camera
    */
    setCamera(camera) {
        this.camera = camera;
        this.interface.setActiveCamera(camera);
        console.log('Camera has changed to');
        console.log(camera);
    }
    /**
    * Auxiliary function that sets up the movement of the waves
    */
    update(currTime){

        for(let i = 0; i < this.movingShader.length; i++){
            if (this.movingShader[i] instanceof(MyWater)){
                this.movingShader[i].update(currTime- this.time);
                this.time = currTime;
            }
        }

        /*for(let i = 0; i < this.board.whiteBishops.length; i++) {
            if(this.board.whiteBishops[i].animation != null){
                this.board.whiteBishops[i].animation.update(currTime - this.time);
            }
        }

        for(let i = 0; i < this.board.blackBishops.length; i++) {
            if(this.board.blackBishops[i].animation != null){
                this.board.blackBishops[i].animation.update(currTime - this.time);
            }
        }*/
    }

    /**
     * Displays the scene.
     */
    display() {

        this.logPicking();
        this.clearPickRegistration();
        
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.board.display();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
