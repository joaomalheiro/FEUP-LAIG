var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATION_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     * @param filename name of the XML file
     * @param scene XMLscene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        //array that will contain all the nodes in the XML file
        this.nodes = [];

        // The id of the root element
        this.idRoot = null;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        //stacks that will help in the display of the scene
        this.materialStack = [];
        this.auxStack = [];
        this.textureStack = [];
        /*let controlPoints = [];
        controlPoints[0] = vec3.fromValues(0,0,0);
        controlPoints[1] = vec3.fromValues(6,0,0);
        controlPoints[2] = vec3.fromValues(0,0,6);
        controlPoints[3] = vec3.fromValues(8,6,12);
        this.testAnimation = new LinearAnimation(scene,"room",10,controlPoints);*/
        /*let center = vec3.fromValues(5,0,0);
        this.testAnimation = new CircularAnimation(scene,"room",10,center,5,30,60);*/
        this.previousUpdate = Date.now();

        this.scene.movingShader = [];
        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;
        
        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <SCENE>
        var index;

        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse SCENE block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <VIEWS>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse VIEWS block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        //<AMBIENT>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse AMBIENT block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <LIGHTS>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <TEXTURES>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <TRANSFORMATIONS>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse TRANSFORMATIONS block
            if ((error = this.parseTransformations(nodes[index])) != null)
               return error;
        }

        // <ANIMATIONS>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATION_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse ANIMATIONS block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <PRIMITIVES>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse PRIMITIVES block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <COMPONENTS>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse COMPONENTS block
            if ((error = this.parseComponents(nodes[index])) != null)
               return error;
        }
    }

    /**
    * Parses the <scene> block
    * @param {scene block element}
    */
    parseScene(sceneNode) {

        //gets the string of the root and the float axis_length
        this.root = this.reader.getString(sceneNode, 'root');
        this.axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (this.parserStringMinorError(this.root, "root", "scene") != 0)
            this.root = 1;

         if (this.parserFloatMinorError(this.axisLength,"axisLength", "scene") != 0 )
           this.axisLength = 1;

        console.log("Parsed scene");
    }

    /**
    * Parses the <views> block
    * @param {views block element}
    */
    parseViews(viewsNode) {

        var children = viewsNode.children;
        var nodeNames = [];

        //array to hold the information that will be required to create all the perspective cameras in the XMLscene file
        this.perspectives = [];
        //array to hold the information that will be required to create all the ortho cameras in the XMLscene file
        this.orthos = [];

        this.defaultViewID = this.reader.getString(viewsNode,'default');
        this.parserStringMinorError(this.defaultViewID,"defaultViewID","views");

        //cycle to guarantee every view is either perspective or ortho
        for(var i = 0; i < children.length; i++){
            if(children[i].nodeName === 'perspective' || children[i].nodeName === 'ortho')
            nodeNames.push(children[i].nodeName);
            else  this.onXMLMinorError("unable to parse the type of the view, not perspective or ortho");
        }


        for(var j = 0; j < children.length; j++) {

            if(nodeNames[j] === 'perspective'){

                let perspective = { id:"",near:0 ,far:0,angle:0,from:[],to:[]};

                perspective.id = this.reader.getString(children[j], 'id');
                perspective.near = this.reader.getFloat(children[j], 'near');
                perspective.far = this.reader.getFloat(children[j], 'far');
                perspective.angle =this.reader.getFloat(children[j], 'angle');

                perspective.from.push(this.reader.getFloat(children[j].children[0],'x'));
                perspective.from.push(this.reader.getFloat(children[j].children[0],'y'));
                perspective.from.push(this.reader.getFloat(children[j].children[0],'z'));

                perspective.to.push(this.reader.getFloat(children[j].children[1],'x'));
                perspective.to.push(this.reader.getFloat(children[j].children[1],'y'));
                perspective.to.push(this.reader.getFloat(children[j].children[1],'z'));

                //section in which the values passed are tested and if they are null or they are not a number, they are fixed
                if (this.parserStringMinorError(perspective.id, "perspective_id","views") != 0)
                   this.onXMLError("Variable ID of a perspective view is null");

                if(this.parserFloatMinorError(perspective.near, "perspective_near","views") != 0)
                  perspective.near = 0.2;

                if(this.parserFloatMinorError(perspective.far, "perspective_far","views") != 0)
                  perspective.far = 500;

                if(this.parserFloatMinorError(perspective.angle, "perspective_angle","views") != 0)
                  perspective.angle = 0;

                if(this.parserFloatMinorError(perspective.from[0], "perspective_from","views") != 0)
                  perspective.from[0] = 0;

                 if(this.parserFloatMinorError(perspective.from[1], "perspective_from","views") != 0)
                  perspective.from[1] = 0;

                 if(this.parserFloatMinorError(perspective.from[2], "perspective_from","views") != 0)
                  perspective.from[2] = 0;

                 if(this.parserFloatMinorError(perspective.to[0], "perspective_to","views") != 0)
                    perspective.to[0] = 1;

                 if(this.parserFloatMinorError(perspective.to[1], "perspective_to","views") != 0)
                  perspective.to[1] = 1;

                 if(this.parserFloatMinorError(perspective.to[2], "perspective_to","views") != 0)
                  perspective.to[2] = 1;

                //all the info is pushed to the respective array
                this.perspectives.push(perspective);

            } else if (nodeNames[j] === 'ortho'){

                let ortho = {id:"",near:0,far:0,left:0,right:0,top:0,bottom:0,from:[],to:[]};

                ortho.id = this.reader.getString(children[j], 'id');
                ortho.near = this.reader.getFloat(children[j], 'near');
                ortho.far = this.reader.getFloat(children[j], 'far');
                ortho.left = this.reader.getFloat(children[j],'left');
                ortho.right = this.reader.getFloat(children[j],'right');
                ortho.top = this.reader.getFloat(children[j],'top');
                ortho.bottom = this.reader.getFloat(children[j],'bottom');

                ortho.from.push(this.reader.getFloat(children[j].children[0],'x'));
                ortho.from.push(this.reader.getFloat(children[j].children[0],'y'));
                ortho.from.push(this.reader.getFloat(children[j].children[0],'z'));

                ortho.to.push(this.reader.getFloat(children[j].children[1],'x'));
                ortho.to.push(this.reader.getFloat(children[j].children[1],'y'));
                ortho.to.push(this.reader.getFloat(children[j].children[1],'z'));

                //section in which the values passed are tested and if they are null or they are not a number, they are fixed
                if (this.parserStringMinorError(ortho.id, "ortho_id", "views") != 0)
                  ortho.id == "def_ortho_ID"+j;

                if(this.parserFloatMinorError(ortho.near, "ortho_near", "views") != 0)
                  ortho.near = 0.2;

                if(this.parserFloatMinorError(ortho.far, "ortho_far", "views") != 0)
                  ortho.far = 500;

                if(this.parserFloatMinorError(ortho.left, "ortho_left", "views") != 0)
                  ortho.left = -10;

                if(this.parserFloatMinorError(ortho.right, "ortho_right", "views") != 0)
                  ortho.right = 10;

                if(this.parserFloatMinorError(ortho.top, "ortho_top", "views") != 0)
                  ortho.top = 5;

                if(this.parserFloatMinorError(ortho.bottom, "ortho_bottom", "views") != 0)
                  ortho.bottom = -5;

                if(this.parserFloatMinorError(ortho.from[0], "ortho_from", "views") != 0)
                  ortho.from[0] = 10.0;

                 if(this.parserFloatMinorError(ortho.from[1], "ortho_from", "views") != 0)
                  ortho.from[1] = 5;

                 if(this.parserFloatMinorError(ortho.from[2], "ortho_from", "views") != 0)
                  ortho.from[2] = 5;

                 if(this.parserFloatMinorError(ortho.to[0], "ortho_to", "views") != 0)
                    ortho.to[0] = 0;

                 if(this.parserFloatMinorError(ortho.to[1], "ortho_to", "views") != 0)
                  ortho.to[1] = 5;

                 if(this.parserFloatMinorError(ortho.to[2], "ortho_to", "views") != 0)
                  ortho.to[2] = 5;

                //al the info regarding ortho cameras is pushed to the respective array
                this.orthos.push(ortho);
            }
        }
        console.log("Parsed views !");
    }

    /**
    * Parses the <ambient> block
    * @param {ambient block element}
    */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;
        var ambient = children[0];
        var background = children[1];

        //data reader for the ambient section of the ambient node
        this.ambientR = this.reader.getFloat(ambient,"r");
        this.ambientG = this.reader.getFloat(ambient,"g");
        this.ambientB = this.reader.getFloat(ambient,"b");
        this.ambientA = this.reader.getFloat(ambient,"a");

        //section in which the values passed are tested and if they are null or they are not a number, they are fixed
        if(this.parserFloatMinorError(this.ambientR, "ambientR", "ambient") != 0)
          this.ambientR = 0.5;

        if(this.parserFloatMinorError(this.ambientG, "ambientG", "ambient") != 0)
          this.ambientG = 0.5;

        if(this.parserFloatMinorError(this.ambientB, "ambientB", "ambient") != 0)
          this.ambientB = 0.5;

        if(this.parserFloatMinorError(this.ambientA, "ambientA", "ambient") != 0)
          this.ambientA = 1;

        //data reader for the background section of the ambient node
        this.backgroundR = this.reader.getFloat(background,"r");
        this.backgroundG = this.reader.getFloat(background,"g");
        this.backgroundB = this.reader.getFloat(background,"b");
        this.backgroundA = this.reader.getFloat(background,"a");

        //section in which the values passed are tested and if they are null or they are not a number, they are fixed
        if(this.parserFloatMinorError(this.backgroundR, "backgroundR", "background") != 0)
          this.backgroundR = 0.5;
        if(this.parserFloatMinorError(this.backgroundG, "backgroundG", "background") != 0)
          this.backgroundG = 0.5;
        if(this.parserFloatMinorError(this.backgroundB, "backgroundB", "background") != 0)
          this.backgroundB = 0.5;
        if(this.parserFloatMinorError(this.backgroundA, "backgroundR", "background") != 0)
          this.backgroundR = 1;

        console.log("Parsed ambient block!");
    }

    /**
    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];
        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName == 'omni' && children[i].nodeName === 'spot'){
                this.onXMLMinorError("unknown tag <" + this.reader.getString(children[i], 'id') + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            if(children[i].nodeName == 'omni'){
                // Gets indices of each element.
                var locationIndex = nodeNames.indexOf("location");
                var ambientIndex = nodeNames.indexOf("ambient");
                var diffuseIndex = nodeNames.indexOf("diffuse");
                var specularIndex = nodeNames.indexOf("specular");

                 // Light enable/disable
                 const enableLight = this.reader.getBoolean(children[i], 'enabled');
                 if(enableLight == null){
                     this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
                 }
            // Retrieves the light position.
            var locationLight = [];
            if (locationIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            //Retrieves the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)){
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                }
                else
                    diffuseIllumination.push(r);


                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                }
                else
                    diffuseIllumination.push(g);
                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;

                }
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                }
                else
                   diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            //Retrieves the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)){
                return "unable to parse R component of the specular illumination for ID = " + lightId;
            }
            else
                specularIllumination.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))  {
                return "unable to parse G component of the specular illumination for ID = " + lightId;
            }
            else
                 specularIllumination.push(g);


            // B
            var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if(!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the specular illumination for ID = " + lightId;
            else
                specularIllumination.push(b);


            // A
            var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
                return "unable to parse A component of the specular illumination for ID = " + lightId;
            }
            else
                specularIllumination.push(a);

        }
        else
            return "specular component undefined for ID = " + lightId;

        // Light global information.
        this.lights[lightId] = [enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination];
        numLights++;

            }
        else if(children[i].nodeName == 'spot'){
                // Gets indices of each element.
                var locationIndex = nodeNames.indexOf("location");
                var ambientIndex = nodeNames.indexOf("ambient");
                var diffuseIndex = nodeNames.indexOf("diffuse");
                var specularIndex = nodeNames.indexOf("specular");
                var targetIndex = nodeNames.indexOf("target");

                 // Light enable/disable
                 var angleLight;
                 if (this.reader.getFloat(children[i], 'angle') == null || isNaN(this.reader.getFloat(children[i], 'angle') )) {
                     this.onXMLMinorError("angle value missing for ID = " + lightId);
                    }
                    else {
                        angleLight = this.reader.getString(children[i], 'angle');
                    }
                const enableLight = this.reader.getBoolean(children[i], 'enabled');
                if(enableLight == null){
                    this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
                }

                 var exponentLight;
                 if (this.reader.getFloat(children[i], 'exponent') == null || isNaN(this.reader.getFloat(children[i], 'exponent') )) {
                     this.onXMLMinorError("exponent value missing for ID = " + lightId);
                    }
                    else {
                        exponentLight = this.reader.getString(children[i], 'exponent');
                    }
            // Retrieves the light position.
            var locationLight = [];
            if (locationIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    locationLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            var targetLight = [];
            if (targetIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the target position for ID = " + lightId;
                else
                    targetLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the target position for ID = " + lightId;
                else
                    targetLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the target position for ID = " + lightId;
                else
                    targetLight.push(z);

            }
            else
                return "light target undefined for ID = " + lightId;


            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieves the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)){
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                }
                else
                    diffuseIllumination.push(r);


                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                }
                else
                    diffuseIllumination.push(g);
                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;

                }
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                }
                else
                   diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            //Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)){
                return "unable to parse R component of the specular illumination for ID = " + lightId;
            }
            else
                specularIllumination.push(r);

            // G
            var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))  {
                return "unable to parse G component of the specular illumination for ID = " + lightId;
            }
            else
                 specularIllumination.push(g);


            // B
            var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if(!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the specular illumination for ID = " + lightId;
            else
                specularIllumination.push(b);


            // A
            var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
                return "unable to parse A component of the specular illumination for ID = " + lightId;
            }
            else
                specularIllumination.push(a);

        }
        else
            return "specular component undefined for ID = " + lightId;

        // Light global information.
        this.lights[lightId] = [enableLight,angleLight,exponentLight ,locationLight,targetLight,ambientIllumination, diffuseIllumination, specularIllumination];
        numLights++;

        }
    }


        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        //map created with the id as key and the texture object as the other element of the pair
        this.textures =new Map();

        for(var i = 0; i < children.length; i++){

            //model for a texture object
            let texture = {id:this.reader.getString(children[i],'id'),file:this.reader.getString(children[i],'file')};

            //check to see if there is no texture with the same ID (name)
            if (!this.textures.has(texture.id))
              this.textures.set(texture.id,texture);
            else this.onXMLMinorError("at least two textures with the same id, only the first was parsed and loaded");
        }
        console.log("Parsed textures !");
        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var children = materialsNode.children;
        //map created with the id as key and the material object with the parsed info as the other element of the pair
        this.materials = new Map();

        for(var i = 0; i < children.length; i++){

            var grandChildren = children[i].children;

            //model for a material object containing all the requeriments
            let mat = {id: "", shininess:0, emission:[],ambient:[],diffuse:[],specular:[]};

            mat.id = this.reader.getString(children[i],'id');
            mat.shininess = this.reader.getFloat(children[i],'shininess');

            this.parserStringMinorError(mat.id,"id","materials");

            if(this.parserFloatMinorError(mat.shininess,"shininess","materials")!=0)
              mat.shininess = 10;

            for(var j = 0; j < grandChildren.length ; j++) {

              var arr = [];
              arr.push(this.reader.getFloat(grandChildren[j],'r'));
              arr.push(this.reader.getFloat(grandChildren[j],'g'));
              arr.push(this.reader.getFloat(grandChildren[j],'b'));
              arr.push(this.reader.getFloat(grandChildren[j],'a'));

              //section in which the values passed are tested and if they are null or they are not a number, they are fixed
              if(this.parserFloatMinorError(arr[0],"r","materials")!=0)
                arr[0] = 0.5;

               if(this.parserFloatMinorError(arr[1],"g","materials")!=0)
                arr[1] = 0.5;

               if(this.parserFloatMinorError(arr[2],"b","materials")!=0)
                arr[2] = 0.5;

               if(this.parserFloatMinorError(arr[3],"a","materials")!=0)
                arr[3] = 0.5 ;

              //switch to see if it is the emission, ambient, diffuse or specular section and save the data accordingly
              switch(j){
                case 0: mat.emission = arr;
                break;
                case 1: mat.ambient = arr;
                break;
                case 2: mat.diffuse = arr;
                break;
                case 3: mat.specular = arr;
                break;
              }

            }

        //checks if there is already a material with the same ID
        if (!this.materials.has(mat.id))
            this.materials.set(mat.id,mat);
          else this.onXMLMinorError("at least two materials with the same id, only the first was parsed and loaded");
        }
        console.log("Parsed materials");
        return null;

    }
     /**
     * Parses the <Transformations> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;
        this.transformations = [];

        for(var i = 0; i < children.length; i++){

            var grandChildren = children[i].children;

            let transfor = [];

            let id = this.reader.getString(children[i],'id');

            for(var j = 0; j < grandChildren.length ; j++) {

              var arr = [];
              if(grandChildren[j].nodeName == "translate"){
                arr.push(grandChildren[j].nodeName);
                arr.push(this.reader.getFloat(grandChildren[j],'x'));
                arr.push(this.reader.getFloat(grandChildren[j],'y'));
                arr.push(this.reader.getFloat(grandChildren[j],'z'));
                transfor.push(arr)
              }
              else if (grandChildren[j].nodeName == "rotate"){
                arr.push(grandChildren[j].nodeName);
                arr.push(this.reader.getString(grandChildren[j],'axis'));
                arr.push(this.reader.getFloat(grandChildren[j],'angle'));
                transfor.push(arr);
              }
              else if (grandChildren[j].nodeName == "scale"){
                arr.push(grandChildren[j].nodeName);
                arr.push(this.reader.getFloat(grandChildren[j],'x'));
                arr.push(this.reader.getFloat(grandChildren[j],'y'));
                arr.push(this.reader.getFloat(grandChildren[j],'z'));
                transfor.push(arr);
              } else
                    this.onXMLMinorError("Not a valid transformation tag");

            }

        if (this.transformations[id] == null)
          this.transformations[id] = transfor;
          else this.onXMLMinorError("at least two transformations with the same id, only the first was parsed and loaded");

        }
        console.log("Parsed transformations");
        return null;

    }

      /**
     * Parses the <Animations> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        this.animations = [];

        for(var i = 0; i < children.length; i++){

            var grandChildren = children[i].children;

            let id = this.reader.getString(children[i],'id');
            let span = this.reader.getFloat(children[i],'span');
            let controlPoints = [];

            if(children[i].nodeName == "linear"){
                for(let j = 0; j < grandChildren.length ; j++) {
                    if(grandChildren[j].nodeName == "controlpoint"){
                      let x = this.reader.getFloat(grandChildren[j],'xx');
                      let y = this.reader.getFloat(grandChildren[j],'yy');
                      let z = this.reader.getFloat(grandChildren[j],'zz');
                      controlPoints.push(vec3.fromValues(x,y,z));
                    }
                    else
                          this.onXMLMinorError("Not a valid transformation tag");
      
                  }
                  if(controlPoints.length < 2){
                      while(controlPoints.length < 2) {
                          controlPoints.push(vec3.fromValues(0,0,0));
                      }
                      this.onXMLMinorError("Linear animation must have at least 2 control points (Assuming (0,0,0) on missing points)");
                  }

                if (this.animations[id] == null)
                    this.animations[id] = new LinearAnimation(this.scene,id,span,controlPoints);
                else this.onXMLMinorError("at least two animations with the same id, only the first was parsed and loaded");
                } 
                else if(children[i].nodeName == "circular"){
                    let center = this.reader.getVector3(children[i],'center');
                    let radius = this.reader.getFloat(children[i],'radius');
                    let startang = this.reader.getFloat(children[i],'startang');
                    let rotang = this.reader.getFloat(children[i],'rotang');

                    if (this.animations[id] == null)
                        this.animations[id] = new CircularAnimation(this.scene,id,span,center,radius,startang,rotang);
                    else this.onXMLMinorError("at least two animations with the same id, only the first was parsed and loaded");
                }

        }
        console.log("Parsed Animations");
        return null;

    }

     /**
     * Parses the <primitives> block.
     * @param {primitives block element} nodesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;
        var grandChildren = [];
        var nodeNames = [];

        this.primitives = [];

        for(var i = 0; i < children.length; i++) {

          let prim = {};
          var grandChildren = children[i].children[0];

          //checks if the tag for the primitive is a valid one
          for(var j = 0; j < grandChildren.length; j++){
            if(!(grandChildren[j].nodeName == 'rectangle' || grandChildren[j].nodeName == 'triangle' || grandChildren[j].nodeName == 'cylinder' || grandChildren[j].nodeName == 'sphere' || grandChildren[j].nodeName == 'thorus' || grandChildren[j].nodeName == 'patch' || grandChildren[j].nodeName == 'plane'))
              this.onXMLMinorError("unable to parse the primitive, not an accepted primitive type");
            }


          switch(grandChildren.nodeName){

              case 'rectangle':
                var x1 = this.reader.getFloat(grandChildren,'x1');
                var x2 = this.reader.getFloat(grandChildren,'x2');
                var y1 = this.reader.getFloat(grandChildren,'y1');
                var y2 = this.reader.getFloat(grandChildren,'y2');

                //section in which the values passed are tested and if they are null or they are not a number, they are fixed
                if(this.parserFloatMinorError(x1,"rectangle","primitives")!=0)
                  x1 = 0;

                if(this.parserFloatMinorError(y1,"rectangle","primitives")!=0)
                  y1 = 2;

                if(this.parserFloatMinorError(x2,"rectangle","primitives")!=0)
                  x2 = 2;

                if(this.parserFloatMinorError(y2,"rectangle","primitives")!=0)
                  y2 = 4;

                prim = new MyRectangle(this.scene,x1,y1,x2,y2);
              break;

              case 'triangle':
                var x1 = this.reader.getFloat(grandChildren,'x1');
                var y1 = this.reader.getFloat(grandChildren,'y1');
                var z1 = this.reader.getFloat(grandChildren,'z1');
                var x2 = this.reader.getFloat(grandChildren,'x2');
                var y2 = this.reader.getFloat(grandChildren,'y2');
                var z2 = this.reader.getFloat(grandChildren,'z2');
                var x3 = this.reader.getFloat(grandChildren,'x3');
                var y3 = this.reader.getFloat(grandChildren,'y3');
                var z3 = this.reader.getFloat(grandChildren,'z3');

                  //section in which the values passed are tested and if they are null or they are not a number, they are fixed
                if(this.parserFloatMinorError(x1,"triangle","primitives")!=0)
                  x1 = 0;
                if(this.parserFloatMinorError(x2,"triangle","primitives")!=0)
                  x2 = 1;
                if(this.parserFloatMinorError(x3,"triangle","primitives")!=0)
                  x3 = 2;
                if(this.parserFloatMinorError(y1,"triangle","primitives")!=0)
                  y1 = 0;
                if(this.parserFloatMinorError(y2,"triangle","primitives")!=0)
                  y2 = 1;
                if(this.parserFloatMinorError(y3,"triangle","primitives")!=0)
                  y3 = 2;
                 if(this.parserFloatMinorError(z1,"triangle","primitives")!=0)
                  z1 = 0;
                 if(this.parserFloatMinorError(z2,"triangle","primitives")!=0)
                  z2 = 1;
                 if(this.parserFloatMinorError(z3,"triangle","primitives")!=0)
                  z3 = 2;

                prim = new MyTriangle(this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3);
                break;

              case 'sphere':
                var radius = this.reader.getFloat(grandChildren,'radius');
                var slices = this.reader.getFloat(grandChildren,'slices');
                var stacks = this.reader.getFloat(grandChildren,'stacks');

                //section in which the values passed are tested and if they are null or they are not a number, they are fixed
                if(this.parserFloatMinorError(radius,"sphere","primitives")!=0)
                  radius = 1;
                if(this.parserFloatMinorError(stacks,"sphere","primitives")!=0)
                  stacks = 10;
                if(this.parserFloatMinorError(slices,"sphere","primitives")!=0)
                  slices = 30;

                prim = new MySphere(this.scene,radius,slices,stacks);
              break;

              case 'cylinder':

                var height = this.reader.getFloat(grandChildren,'height');
                var base = this.reader.getFloat(grandChildren,'base');
                var top = this.reader.getFloat(grandChildren,'top');
                var stacks = this.reader.getFloat(grandChildren,'stacks');
                var slices = this.reader.getFloat(grandChildren,'slices');

                //section in which the values passed are tested and if they are null or they are not a number, they are fixed
                if(this.parserFloatMinorError(height,"cylinder","primitives")!=0)
                  height = 1;
                if(this.parserFloatMinorError(base,"cylinder","primitives")!=0)
                  base = 0.5;
                if(this.parserFloatMinorError(top,"cylinder","primitives")!=0)
                  top = 0.5;
                if(this.parserFloatMinorError(stacks,"cylinder","primitives")!=0)
                  stacks = 10;
                if(this.parserFloatMinorError(slices,"cylinder","primitives")!=0)
                  slices = 30;

                prim = new MyCylinder(this.scene,height,base,top,stacks,slices);
              break;

              case 'torus':
                var inner = this.reader.getFloat(grandChildren,'inner');
                var outer = this.reader.getFloat(grandChildren,'outer');
                var slices = this.reader.getFloat(grandChildren,'slices');
                var loops = this.reader.getFloat(grandChildren,'loops');

                if(this.parserFloatMinorError(inner,"torus","primitives")!=0)
                  inner = 1;
                if(this.parserFloatMinorError(outer,"torus","primitives")!=0)
                  outer = 3;
                if(this.parserFloatMinorError(slices,"torus","primitives")!=0)
                  slices = 30;
                if(this.parserFloatMinorError(loops,"torus","primitives")!=0)
                  loops = 10;

                prim = new MyTorus(this.scene,inner, outer ,slices, loops);
              break;

              case 'plane':
                var nPartsU = this.reader.getFloat(grandChildren,'npartsU');
                var nPartsV = this.reader.getFloat(grandChildren,'npartsV');

                if(this.parserFloatMinorError(nPartsU,"patch","primitives")!=0)
                  nPartsU = 1;
                if(this.parserFloatMinorError(nPartsV,"patch","primitives")!=0)
                  nPartsV = 1;

                prim = new Plane(this.scene,nPartsU,nPartsV);
              break;

              case 'patch':
                var nPartsU = this.reader.getFloat(grandChildren,'npartsU');
                var nPartsV = this.reader.getFloat(grandChildren,'npartsV');
                var nPointsU = this.reader.getFloat(grandChildren,'npointsU');
                var nPointsV = this.reader.getFloat(grandChildren,'npointsV');
                
                var controlPoints = [];
                var x,y,z;
                
                for(var j = 0; j < grandChildren.children.length; j++){
                   
                    x = this.reader.getFloat(grandChildren.children[j],'xx');
                    y = this.reader.getFloat(grandChildren.children[j],'yy');
                    z = this.reader.getFloat(grandChildren.children[j],'zz');

                    if(this.parserFloatMinorError(x,"patch","primitives")!=0)
                        x = j;
                    if(this.parserFloatMinorError(y,"patch","primitives")!=0)
                        y = j;
                    if(this.parserFloatMinorError(z,"patch","primitives")!=0)
                        z = j;

                    controlPoints.push([x,y,z,1.0]);

                }
                
                var degreeU = nPointsU - 1;
                var degreeV = nPointsV - 1;
                var controlPointsList = [];
                
                for (var a = 0; a <= degreeU; a++) {
                    var tmp = [];
                    for (var b = 0; b <= degreeV; b++)
                        tmp.push(controlPoints.shift());
                    
                    controlPointsList.push(tmp);
                }
                                        
                if(this.parserFloatMinorError(nPartsU,"patch","primitives")!=0)
                  nPartsU = 1;
                if(this.parserFloatMinorError(nPartsV,"patch","primitives")!=0)
                  nPartsV = 1;

                prim = new Patch(this.scene,nPartsU,nPartsV, degreeU, degreeV,controlPointsList);
              break;

                case 'cylinder2':
                 var base = this.reader.getFloat(grandChildren,'base');
                 var top = this.reader.getFloat(grandChildren, 'top');
                 var height = this.reader.getFloat(grandChildren, 'height');
                 var slices = this.reader.getFloat(grandChildren, 'slices');
                 var stacks = this.reader.getFloat(grandChildren, 'stacks');
                 prim = new Cylinder2(this.scene, height, base, top, stacks, slices);
              break;

              case 'terrain':
                 var idtexture = this.reader.getString(grandChildren,'idtexture');
                 var idheightmap = this.reader.getString(grandChildren,'idheightmap');
                 var parts = this.reader.getFloat(grandChildren, 'parts');
                 var heightscale = this.reader.getFloat(grandChildren, 'heightscale');
                 
                 prim = new MyTerrain(this.scene, idtexture, idheightmap, parts, heightscale);
              break;

              case 'water':
                 var idtexture = this.reader.getString(grandChildren,'idtexture');
                 var idheightmap = this.reader.getString(grandChildren,'idwavemap');
                 var parts = this.reader.getFloat(grandChildren, 'parts');
                 var heightscale = this.reader.getFloat(grandChildren, 'heightscale');
                 var texscale = this.reader.getFloat(grandChildren, 'texscale');
                 
                 prim = new MyWater(this.scene, idtexture, idheightmap, parts, heightscale, texscale);
                 
                 this.scene.movingShader.push(prim);
              break;

          }
      this.primitives[this.reader.getString(children[i],'id')] = prim;
      }
    console.log("Parsed primitives");
    return null;
    }

  /**
     * Parses the <components> block.
     * @param {components block element} nodesNode
     */
    parseComponents(nodesNode) {
        this.children = nodesNode.children;
        this.components = [];
        this.transfCounter = 0;

        for(var i = 0; i < this.children.length; i++){
            let component = {id: "", transformation: [], materials:[] ,tex_id:"",tex_length_s:0,tex_length_t:0,componentref:[],primitiveref:[],animations:[]};

            component.id = this.reader.getString(this.children[i],'id');

            this.componentInfo = this.children[i].children;
            if(this.componentInfo.length < 4){
                this.onXMLError("Component does not have all required attributes");
            } else {
                 for (let j=0; j < this.componentInfo[0].children.length;j++){

                            var grandChildren = this.componentInfo[0].children;
                            if(grandChildren[j].nodeName == "transformationref"){
                                component.transformation.push(this.reader.getString(this.componentInfo[0].children[j],'id'));
                            } else {

                            let transfor = [];

                            let id = "default" + this.transfCounter;
                            this.transfCounter++;
                            component.transformation.push(id);

                

                              var arr = [];
                              if(grandChildren[j].nodeName == "translate"){
                                arr.push(grandChildren[j].nodeName);
                                arr.push(this.reader.getFloat(grandChildren[j],'x'));
                                arr.push(this.reader.getFloat(grandChildren[j],'y'));
                                arr.push(this.reader.getFloat(grandChildren[j],'z'));
                                transfor.push(arr)
                              }
                              else if (grandChildren[j].nodeName == "rotate"){
                                arr.push(grandChildren[j].nodeName);
                                arr.push(this.reader.getString(grandChildren[j],'axis'));
                                arr.push(this.reader.getFloat(grandChildren[j],'angle'));
                                transfor.push(arr);
                              }
                              else if (grandChildren[j].nodeName == "scale"){
                                arr.push(grandChildren[j].nodeName);
                                arr.push(this.reader.getFloat(grandChildren[j],'x'));
                                arr.push(this.reader.getFloat(grandChildren[j],'y'));
                                arr.push(this.reader.getFloat(grandChildren[j],'z'));
                                transfor.push(arr);
                              } else
                                    this.onXMLMinorError("Not a valid transformation tag");

                            

                        if (this.transformations[id] == null)
                          this.transformations[id] = transfor;

            }
        }

                var materials = this.componentInfo[1].children;
                for(var j = 0; j < materials.length; j++){
                    component.materials.push(this.reader.getString(materials[j],'id'));
                }

                component.tex_id = this.reader.getString(this.componentInfo[2],'id');

                if(component.tex_id != "none"){
                component.tex_length_s = this.reader.getString(this.componentInfo[2],'length_s',false);
                component.tex_length_t = this.reader.getString(this.componentInfo[2],'length_t',false);
                if(component.tex_length_s == null || component.tex_length_t == null){
                    component.tex_length_s = 1;
                    component.tex_length_t = 1;
                }
              }

                var componentChildren = this.componentInfo[3].children;

                for(var j = 0; j < componentChildren.length; j++){
                    if(componentChildren[j].nodeName == "componentref"){
                        component.componentref.push(this.reader.getString(componentChildren[j],'id'));
                    } else if(componentChildren[j].nodeName == "primitiveref"){
                        component.primitiveref.push(this.reader.getString(componentChildren[j],'id'));
                    } else {
                        console.log(componentChildren[j].nodeName);
                        this.onXMLError("Unidentified tag name");
                    }
                }

                this.components[component.id] = component;

                if(this.componentInfo[4] != undefined){
                    let componentAnimations = this.componentInfo[4].children;
                    for(let k = 0; k < componentAnimations.length; k++)
                    if(componentAnimations[k].nodeName == "animationref"){
                        let animationId = this.reader.getString(componentAnimations[k],'id');
                        component.animations.push(this.animations[animationId]);
                    }
                }
          
            }

        }
        
        this.log("Parsed components");
        return null;
    }
    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
    * Auxiliary function to check if a value is valid or not
    *@param {float} value to be tested
    *@param {string} text what the value represents
    *@param {string} section the main tag this data belongs to
    */
    parserFloatMinorError(value, text, section) {
       if (!(value != null && !isNaN(value))) {
            this.onXMLMinorError("unable to parse " + text + " of " + section +" section");
            return 1;
        }
        return 0;
    }

    /**
    * Auxiliary function to check if a value is valid or not
    *@param {float} value to be tested
    *@param {string} text what the value represents
    *@param {string} section the main tag this data belongs to
    */
    parserStringMinorError(value, text, section) {
       if (value == null) {
            this.onXMLMinorError("unable to parse " + text + " of " + section +" section");
            return 1;
        }
        return 0;
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

        /**
     * Displays the scene, processing each node, starting in the root node.
     */
     /**
     * Displays the scene, processing each node, starting in the root node.
     */
  displayScene() {
    
    this.pushMaterial("default");
    this.displayComponent(this.root);
    return null;
}

// Places the most recent material on top of the stack
pushMaterial(mat_id) {
    if(mat_id === "inherit") {
        this.materialStack.push(this.materialStack[this.materialStack.length-1]);
        this.auxStack.push(this.auxStack[this.auxStack.length-1]);
    } else {
        this.materialStack.push(this.scene.materials[mat_id]);
        this.auxStack.push(mat_id);
    }
}
applyMaterialAndTexture() {

    if(this.textureStack[this.textureStack.length-1] != "none")
      this.materialStack[this.materialStack.length-1].setTexture(this.textureStack[this.textureStack.length-1]);
    this.materialStack[this.materialStack.length-1].apply();
    if(this.textureStack[this.textureStack.length-1] != "none")
      this.materialStack[this.materialStack.length-1].setTexture(null);
}

popMaterial() {
    this.materialStack.pop();
}

pushTexture(tex_id) {
  if(tex_id === "inherit")
    this.textureStack.push(this.textureStack[this.textureStack.length-1]);
  else if(tex_id == "none") this.textureStack.push("none");
  else this.textureStack.push(this.scene.textures[tex_id]);
}

popTexture(){
  this.textureStack.pop();
}
//Retrieves the transformation matrix and applies it
applyTransformations(componentID) {
    const matrix = this.getTransformationMatrix(componentID);
    this.scene.multMatrix(matrix);
}
applyAnimations(componentID) {
    for(let i = 0; i < this.components[componentID].animations.length; i++){
        if(!this.components[componentID].animations[i].done || i == this.components[componentID].animations.length - 1)
        {    
            console.log("Animating ",componentID,"Animation ",i);
            this.components[componentID].animations[i].update(Date.now());
            this.components[componentID].animations[i].apply();
            break;
        }
    }
}

displayComponent(componentID) {
    //console.log(`For material with id ${componentID} the stack is `, this.auxStack);
    const current_component = this.components[componentID];
    this.scene.pushMatrix();

    //In charge of changing materials once the "m" key is pressed
    let m_movedMaterial = this.scene.materialCounter%current_component.materials.length;
    let current_material_id = current_component.materials[m_movedMaterial];

    this.pushMaterial(current_material_id);
    let current_texture_id = current_component.tex_id;
    this.pushTexture(current_texture_id);


    this.applyMaterialAndTexture();
    this.applyTransformations(componentID);

    this.applyAnimations(componentID);
    for(let i = 0; i < current_component.primitiveref.length; i++) {
        this.displayPrimitive(current_component,i);
    }

    //Recursively displays the tree
    for(let i = 0; i < current_component.componentref.length; i++) {
        //console.log(current_component.componentref[i]);
        this.displayComponent(this.components[current_component.componentref[i]].id);
    }

    this.scene.popMatrix();
    this.popMaterial();
    this.popTexture();
}

getTransformationMatrix(componentID){
    var mat = mat4.create();
    for(let i = 0;i<this.components[componentID].transformation.length;i++){
        var transf = this.components[componentID].transformation[i];
    var transfor = this.transformations[transf];
    if(transfor != null){
        for(let j = 0; j < transfor.length; j++ ){
            switch(transfor[j][0]){
                case "translate":

                var x = transfor[j][1];
                var y = transfor[j][2];
                var z = transfor[j][3];
                //console.log(x)
                var vec = vec3.fromValues(x,y,z);
                //console.log("vec: ", vec);
                mat4.translate(mat,mat,vec3.fromValues(x,y,z));
                break;

                case "scale":
                var sx = transfor[j][1];
                var sy = transfor[j][2];
                var sz = transfor[j][3];

                mat4.scale(mat, mat, vec3.fromValues(sx,sy,sz));
                break;

                case "rotate":
                var angle = transfor[j][2];
                switch (transfor[j][1]){
                    case "x":
                    mat4.rotate(mat, mat, angle * DEGREE_TO_RAD,vec3.fromValues(1,0,0));
                    break;

                    case "y":
                    mat4.rotate(mat, mat, angle * DEGREE_TO_RAD,vec3.fromValues(0,1,0));
                    break;
                    case "z":
                    mat4.rotate(mat, mat, angle * DEGREE_TO_RAD,vec3.fromValues(0,0,1));
                    break;

                    default:
                    break;
                }
                default:
                break;

            }
        }


    }

    }
    
    return mat;

}

    /**
    * Function that displays a primitive that belongs to the current_component array of primitives and has the index i
    * @param {current_component}
    * @param {float} id of the primitive
    */
    displayPrimitive(current_component, i){
      if(this.primitives[current_component.primitiveref[i]] instanceof(MyRectangle) || this.primitives[current_component.primitiveref[i]] instanceof(MyTriangle)){
        this.primitives[current_component.primitiveref[i]].set_lengths_texture(current_component.tex_length_s, current_component.tex_length_t);
      }
    this.primitives[current_component.primitiveref[i]].display();
  }
}
