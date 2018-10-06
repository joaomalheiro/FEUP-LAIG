var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

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
            //if ((error = this.parseLights(nodes[index])) != null)
              //  return error;
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
            //if ((error = this.parseTransformations(nodes[index])) != null)
              //  return error;
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
            //if ((error = this.parseComponents(nodes[index])) != null)
               // return error;
        }
    }
    
    /**
    * Parses the <scene> block
    */
    parseScene(sceneNode) {

        this.root = this.reader.getString(sceneNode, 'root');
        this.axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (this.root == null) {
            this.root = 1;
            this.onXMLMinorError("unable to parse value for root; assuming 'root = 1'");
            }

         if (!(this.axisLength != null && !isNaN(this.axisLength))) {
            this.axisLength = 1;
            this.onXMLMinorError("unable to parse value for axisLength; assuming 'axisLength = 1'");
            }
         
        console.log("Parsed scene");
    }

    /**
    * Parses the <views> block
    */

    parseViews(viewsNode) {
    
        var children = viewsNode.children;
        var nodeNames = [];
        this.perspectives = [];
        this.orthos = [];

        for(var i = 0; i < children.length; i++){
            if(children[i].nodeName === 'perspective' || children[i].nodeName === 'ortho')
            nodeNames.push(children[i].nodeName);
            else  this.onXMLMinorError("unable to parse the type of the view, not perspective or ortho");
        }
        
        for(var j = 0; j < children.length; j++) {
            
            // Gets indices of each element.
            var view = [];
            view.push(this.reader.getString(children[j], 'id'));
            view.push(this.reader.getFloat(children[j], 'near'));
       
            if(nodeNames[j] === 'perspective'){
                
                view.push(this.reader.getFloat(children[j], 'angle'));
                view.push(this.reader.getFloat(children[j].children[0],'x'));
                view.push(this.reader.getFloat(children[j].children[0],'y'));
                view.push(this.reader.getFloat(children[j].children[0],'z'));

                view.push(this.reader.getFloat(children[j].children[1],'x'));
                view.push(this.reader.getFloat(children[j].children[1],'y'));
                view.push(this.reader.getFloat(children[j].children[1],'z'));

                this.perspectives.push(view);

            } else if (nodeNames[j] === 'ortho'){
                
                view.push(this.reader.getFloat(children[j], 'far'));
                view.push(this.reader.getFloat(children[j],'left'));
                view.push(this.reader.getFloat(children[j],'right'));
                view.push(this.reader.getFloat(children[j],'top'));
                view.push(this.reader.getFloat(children[j],'bottom'));

                this.orthos.push(view);
            }
        
        }

        console.log(this.orthos[0][2]); //left value
        console.log("Parsed views !");

    }

    /**
    * Parses the <ambient> block
    */

    parseAmbient(ambientNode) {
        
        var children = ambientNode.children;
        var ambient = children[0];
        var background = children[1];

        this.ambientR = this.reader.getFloat(ambient,"r");
        this.ambientG = this.reader.getFloat(ambient,"g");
        this.ambientB = this.reader.getFloat(ambient,"b");
        this.ambientA = this.reader.getFloat(ambient,"a");

        this.backgroundR = this.reader.getFloat(background,"r");
        this.backgroundG = this.reader.getFloat(background,"g");
        this.backgroundB = this.reader.getFloat(background,"b");
        this.backgroundA = this.reader.getFloat(background,"a");

        if (!(this.ambientR != null && !isNaN(this.ambientR))) {
            this.onXMLMinorError("unable to parse red component of ambient illumination");
        }
        if (!(this.ambientG != null && !isNaN(this.ambientG))) {
            this.onXMLMinorError("unable to parse green component of ambient illumination");
        }
        if (!(this.ambientB != null && !isNaN(this.ambientB))) {
            this.onXMLMinorError("unable to parse blue component of ambient illumination");
        }
        if (!(this.ambientA != null && !isNaN(this.ambientA))) {
            this.onXMLMinorError("unable to parse alpha component of ambient illumination");
        }

        if (!(this.backgroundR != null && !isNaN(this.backgroundR))) {
            this.onXMLMinorError("unable to parse red component of background illumination");
        }
        if (!(this.backgroundG != null && !isNaN(this.backgroundG))) {
            this.onXMLMinorError("unable to parse green component of background illumination");
        }
        if (!(this.backgroundB != null && !isNaN(this.backgroundB))) {
            this.onXMLMinorError("unable to parse blue component of background illumination");
        }
        if (!(this.backgroundA != null && !isNaN(this.backgroundA))) {
            this.onXMLMinorError("unable to parse alpha component of background illumination");
        }

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
 
            if ((this.reader.getString(children[i], 'id') != "omni") && (this.reader.getString(children[i], 'id') != "spot") ){
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
            if(this.reader.getString(children[i], 'id') == "omni"){
                // Gets indices of each element.
                var locationIndex = nodeNames.indexOf("location");
                var ambientIndex = nodeNames.indexOf("ambient");
                var diffuseIndex = nodeNames.indexOf("diffuse");
                var specularIndex = nodeNames.indexOf("specular");
 
                 // Light enable/disable
                 var enableLight = true;
                 if (this.reader.getString(children[i], 'enabled') != 0 && (this.reader.getString(children[i], 'enabled') != 1)) {
                     this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
                    }
                    else {
                        enableLight = this.reader.getString(children[i], 'enabled');                      
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
 
            // TODO: Retrieve the diffuse component
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
 
            // TODO: Retrieve the specular component
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
        else if(this.reader.getString(children[i], 'id') == "spot"){
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
                 var enableLight = true;
                 if (this.reader.getString(children[i], 'enabled') != 0 && (this.reader.getString(children[i], 'enabled') != 1)) {
                     this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
                    }
                    else {
                        enableLight = this.reader.getString(children[i], 'enabled');                      
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
 
            // TODO: Retrieve the diffuse component
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
 
            // TODO: Retrieve the specular component
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
        this.textures = [];

        var sameID;
        
        for(var i = 0; i < children.length; i++){

            sameID = false;
            let texture = {id:this.reader.getString(children[i],'id'),file:this.reader.getString(children[i],'file')};
            //console.log(this.textures);
            
            for(var j = 0; j < this.textures.length; j++){
                if (texture.id == this.textures[j].id)
                sameID = true;
            }
            if (!sameID)
                this.textures.push(texture);
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
        this.materials = [];
        
        for(var i = 0; i < children.length; i++){

            var grandChildren = children[i].children;

            let mat = {id: "", shininess:0, emission:[],ambient:[],difuse:[],specular:[]};

            mat.id = this.reader.getString(children[i],'id');
            mat.shininess = this.reader.getFloat(children[i],'shininess');

            for(var j = 0; j < grandChildren.length ; j++) {
              
              var arr = [];
              arr.push(this.reader.getFloat(grandChildren[i],'r'));
              arr.push(this.reader.getFloat(grandChildren[i],'g'));
              arr.push(this.reader.getFloat(grandChildren[i],'b'));
              arr.push(this.reader.getFloat(grandChildren[i],'a'));

              switch(j){
                case 0: mat.emission = arr;
                break;
                case 1: mat.ambient = arr;
                break;
                case 2: mat.difuse = arr;
                break;
                case 3: mat.specular = arr;
                break;
              }

            }

        if (this.materials[mat.id] == null)
          this.materials[mat.id] = mat;
          else this.onXMLMinorError("at least two materials with the same id, only the first was parsed and loaded");
           
        } 
        
        console.log(this.materials["material-1"]);
        console.log("Parsed materials");
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

        //let primitive = {primitiveID,rectX1,rectY1,rectX2,rectY2, triX1, triX2, triX3, triY1,triY2,triY3,triZ1,triZ2,triZ3};

        for(var i = 0; i < children.length; i++) {
            
          let prim = {};
          var grandChildren = children[i].children[0];

          for(var j = 0; j < grandChildren.length; j++){
            if(!(grandChildren[j].nodeName == 'rectangle' || grandChildren[j].nodeName == 'triangle' || grandChildren[j].nodeName == 'cylinder' || grandChildren[j].nodeName == 'sphere' || grandChildren[j].nodeName == 'thorus'))
              this.onXMLMinorError("unable to parse the primitive, not an accepted primitive type");
            }
            
            
          switch(grandChildren.nodeName){

              case 'rectangle': 
                prim = new MyRectangle(this.scene,this.reader.getFloat(grandChildren,'x1'),this.reader.getFloat(grandChildren,'y1'),this.reader.getFloat(grandChildren,'x2'),this.reader.getFloat(grandChildren,'y2'));
              break;

              case 'triangle':
                prim = new MyTriangle(this.scene,this.reader.getFloat(grandChildren,'x1'),this.reader.getFloat(grandChildren,'y1'),this.reader.getFloat(grandChildren,'z1'),this.reader.getFloat(grandChildren,'x2'),this.reader.getFloat(grandChildren,'y2'),this.reader.getFloat(grandChildren,'z2'),this.reader.getFloat(grandChildren,'x3'),this.reader.getFloat(grandChildren,'y3'),this.reader.getFloat(grandChildren,'z3'));
                break;

              case 'sphere':
                prim = new MySphere(this.scene,this.reader.getFloat(grandChildren,'radius'),this.reader.getFloat(grandChildren,'slices'),this.reader.getFloat(grandChildren,'stacks'));
              break;

              case 'cylinder':
                prim = new MyCylinder(this.scene,this.reader.getFloat(grandChildren,'height'),this.reader.getFloat(grandChildren,'height'),this.reader.getFloat(grandChildren,'base'),this.reader.getFloat(grandChildren,'top'),this.reader.getFloat(grandChildren,'stacks'),this.reader.getFloat(grandChildren,'slices'),1,1);
              break;
          }

      this.primitives.push(prim);

      }
        
    console.log("Parsed primitives");
    return null;
    }

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block

        var children = nodesNode.children;

        this.log("Parsed nodes");
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
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph

        for(var i = 0; i < this.primitives.length; i++){

          //if(this.primitives[i] != null){
            this.displayPrimitive(this.primitives[i]);
          //}
        }
        return null;
    }

  displayPrimitive(primitive){
    primitive.display();
  }
}