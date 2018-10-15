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

        // add a group of controls (and open/expand by defult)

        return true;
    }

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
    *
    *
    */
    addCamerasGroup(cameras) {

        var group = this.gui.addFolder("Views")
        group.open();
        
        this.camerasID = [];

       for(const [k,v] of cameras.entries()){
            this.camerasID.push(k);
        }

        var views = group.add(this.scene,'selectedCamera',this.camerasID);

        views.onChange(value =>{
           this.scene.setCamera(cameras.get(value));
           this.setActiveCamera(cameras.get(value));
        });
       

    }
}