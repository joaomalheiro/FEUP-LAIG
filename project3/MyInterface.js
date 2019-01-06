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
    }

    /**
     * Adds a folder containing the IDs of the cameras passed as parameter.
     * @param {Map} cameras
     */
    addCamerasGroup(cameras) {

        if(!this.views){
        this.views = this.gui.addFolder("Views");
        this.views.open();

        this.cameras = cameras;
        this.camerasID = [];

       for(const [k,v] of cameras.entries()){

       		if(k != null)
            this.camerasID.push(k);
        }

        var views = this.views.add(this.scene,'selectedCamera',this.camerasID);

        views.onChange(value =>{
           this.scene.setCamera(cameras.get(value));
        });
    }
    }
    
    addGameGroup(){

        if(!this.game){
        this.game = this.gui.addFolder("Game");
        this.game.open();

        this.addScenes();

        this.addUndoButton();
        this.addTimeSlider();
        this.addTypeOfPlayer(1);
        this.addTypeOfPlayer(2);

        this.addNewGame();
        this.addPause();
        this.addShowMovie();
        }

    }

    addTypeOfPlayer(player){

        this.gameTypes = ['Human Player', 'Random AI', 'Hard AI'];
        this.game.add(this.scene, 'playerType' + player, this.gameTypes);

    }

    addScenes(){

        this.scenes = this.gui.addFolder("Scenes");
  	    this.scenes.open();
  	    this.gui.scene = 'Poker';
  	    this.gui.sceneList = this.scenes.add(this.gui, 'scene', ['Poker', 'Simplistic']);
        this.gui.sceneList.onFinishChange(function(){
            this.removeFolder("Lights",this.gui);
            this.scene.changeGraph(this.gui.scene + '.xml');
            //this.scene.setCamera(this.cameras.get(value));
  	    }.bind(this))
    }

    removeFolder(name,parent) {
        console.log('heeeeeeeeeeey');
        if(!parent)
            parent = this.gui;
      var folder = parent.__folders[name];
      if (!folder) {
        return;
      }
      folder.close();
      parent.__ul.removeChild(folder.domElement.parentNode);
      delete parent.__folders[name];
      parent.onResize();
    }
    

    addNewGame(){
        this.game.add(this.scene,'newGame');
    }

    addPause(){
        this.game.add(this.scene,'pauseGame');
    }

    addUndoButton(){
        this.game.add(this.scene, 'undoMove');
    }

    addTimeSlider(){
        this.game.add(this.scene, 'timePerPlay', 10, 59).step(1);
    }

    addShowMovie(){
        this.game.add(this.scene, 'showMovie');
    }

}
