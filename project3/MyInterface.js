/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

       this.initKeys();

        // add a group of controls (and open/expand by defult)

        return true;
    }
    /**
    * Initializes the use of keys in the program
    */
    initKeys() {
  		this.scene.gui=this;
  		this.processKeyboard=function(){};
  		this.activeKeys={};
  	};

    /**
    * Detect when an keyboard event received is a keyDown
    */
  	processKeyDown(event) {
  		this.activeKeys[event.code]=true;
  	};

    /**
    * Detect when an keyboard event received is a keyUp(M) and then increment the material counter used to keep track of every components materials
    */
  	processKeyUp(event) {
          if(event.code === "KeyM"){
              this.scene.materialCounter++;
          }
  		this.activeKeys[event.code]=false;
  	};
    /**
    * Detect when a certain key is pressed
    */
  	isKeyPressed(keyCode) {
  		return this.activeKeys[keyCode] || false;
  	};

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {
        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
        console.log(group);
    }

    /**
     * Adds a folder containing the IDs of the cameras passed as parameter.
     * @param {Map} cameras
     */
    addCamerasGroup(cameras) {

        var group = this.gui.addFolder("Views")
        group.open();

        this.camerasID = [];

       for(const [k,v] of cameras.entries()){

       		if(k != null)
            this.camerasID.push(k);
        }

        var views = group.add(this.scene,'selectedCamera',this.camerasID);

        views.onChange(value =>{
           this.scene.setCamera(cameras.get(value));
        });

    }
    
    addGameGroup(){

        var group = this.gui.addFolder("Game");
        group.open();

        this.addUndoButton(group);
        this.addTypeOfPlayer(1,group);
        this.addTypeOfPlayer(2,group);

        this.addNewGame(group);
        this.addPause(group);

    }

    addTypeOfPlayer(player, group){

        this.gameTypes = ['Human Player', 'Random AI', 'Hard AI'];
        group.add(this.scene, 'playerType' + player, this.gameTypes);

    }

    addNewGame(group){
        group.add(this.scene,'newGame');
    }

    addPause(group){
        group.add(this.scene,'pauseGame');
    }

    addUndoButton(group){
        group.add(this.scene, 'undoMove');
    }
}
