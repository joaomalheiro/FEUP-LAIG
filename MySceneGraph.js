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
        
        this.defaultViewID = this.reader.getString(viewsNode,'default');
        
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

                this.orthos.push(ortho);
            }
        
        }
        
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
        this.textures =new Map();
        
        for(var i = 0; i < children.length; i++){

            let texture = {id:this.reader.getString(children[i],'id'),file:this.reader.getString(children[i],'file')};
                
            if (!this.textures.has(texture.id))
              this.textures.set(texture.id,texture);
            else this.onXMLMinorError("at least two textures with the same id, only the first was parsed and loaded");

        }

        console.log(this.textures);
        console.log("Parsed textures !");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        
        var children = materialsNode.children;
        this.materials = new Map();
        
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
                case 2: mat.diffuse = arr;
                break;
                case 3: mat.specular = arr;
                break;
              }

            }

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

            let transfor = {id: "", translate:[],rotate:[],scale:[]};

            transfor.id = this.reader.getString(children[i],'id');

            for(var j = 0; j < grandChildren.length ; j++) {
              
              var arr = [];
              if(grandChildren[j].nodeName == "translate"){
                arr.push(this.reader.getFloat(grandChildren[j],'x'));
                arr.push(this.reader.getFloat(grandChildren[j],'y'));
                arr.push(this.reader.getFloat(grandChildren[j],'z'));
                transfor.translate = arr;
              } 
              else if (grandChildren[j].nodeName == "rotate"){
                arr.push(this.reader.getString(grandChildren[j],'axis'));
                arr.push(this.reader.getFloat(grandChildren[j],'angle'));
                transfor.rotate = arr;
              }
              else if (grandChildren[j].nodeName == "scale"){
                arr.push(this.reader.getFloat(grandChildren[j],'x'));
                arr.push(this.reader.getFloat(grandChildren[j],'y'));
                arr.push(this.reader.getFloat(grandChildren[j],'z'));
                transfor.scale = arr;
              } else
                    this.onXMLMinorError("Not a valid transformation tag");

            }

        if (this.transformations[transfor.id] == null)
          this.transformations[transfor.id] = transfor;
          else this.onXMLMinorError("at least two transformations with the same id, only the first was parsed and loaded");
           
        } 
        console.log(this.transformations);
        console.log("Parsed transformations");
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
                prim = new MyCylinder(this.scene,this.reader.getFloat(grandChildren,'height'),this.reader.getFloat(grandChildren,'base'),this.reader.getFloat(grandChildren,'top'),this.reader.getFloat(grandChildren,'stacks'),this.reader.getFloat(grandChildren,'slices'));
              break;

              case 'torus':
                prim = new MyTorus(this.scene,this.reader.getFloat(grandChildren,'inner'), this.reader.getFloat(grandChildren,'outer'),this.reader.getFloat(grandChildren,'slices'),this.reader.getFloat(grandChildren,'loops'));
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

        for(var i = 0; i < this.children.length; i++){
            let component = {id: "", transformation: "", materials:[] ,tex_id:"",tex_length_s:0,tex_length_t:0,componentref:[],primitiveref:[]};

            component.id = this.reader.getString(this.children[i],'id');

            this.componentInfo = this.children[i].children;
            if(this.componentInfo.length != 4){
                this.onXMLError("Component does not have all required attributes");
            } else {
                if(this.componentInfo[0].children.length != 0){
                 component.transformation = this.reader.getString(this.componentInfo[0].children[0],'id'); 
                }

                var materials = this.componentInfo[1].children;
                for(var j = 0; j < materials.length; j++){
                    component.materials.push(this.reader.getString(materials[j],'id'));
                }

                component.tex_id = this.reader.getString(this.componentInfo[2],'id');
                component.tex_length_s = this.reader.getString(this.componentInfo[2],'length_s');
                component.tex_length_t = this.reader.getString(this.componentInfo[2],'length_t');

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
                console.log(component);

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

    parserFloatMinorError(value, section, text) {
       if (!(value != null && !isNaN(value))) {
            this.onXMLMinorError("unable to parse" + text + "of" +section +"section");
        }
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
    this.materialStack = [];
    this.auxStack = [];
    this.textureStack = [];
    this.displayComponent(this.root);
    return null;
}

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
   
    this.materialStack[this.materialStack.length-1].setTexture(this.textureStack[this.textureStack.length-1]);
    this.materialStack[this.materialStack.length-1].apply();
    this.materialStack[this.materialStack.length-1].setTexture(null);
}

popMaterial() {
    this.materialStack.pop();
}

pushTexture(tex_id) {
  if(tex_id === "inherit")
    this.textureStack.push(this.textureStack[this.textureStack.length-1]);
  else this.textureStack .push(this.scene.textures[tex_id]);
}

popTexture(){
  this.textureStack.pop();
}

applyTransformations(componentID) {
    const matrix = this.getTransformationMatrix(componentID);
    this.scene.multMatrix(matrix);
}

displayComponent(componentID) {
    //console.log(`For material with id ${componentID} the stack is `, this.auxStack);

    const current_component = this.components[componentID];

    this.scene.pushMatrix();

    let m_movedMaterial = this.scene.materialCounter%current_component.materials.length;
    let current_material_id = current_component.materials[m_movedMaterial];
    this.pushMaterial(current_material_id);
    let current_texture_id = current_component.tex_id;
    this.pushTexture(current_texture_id);



    this.applyMaterialAndTexture();
    this.applyTransformations(componentID);

    for(let i = 0; i < current_component.primitiveref.length; i++) {
        this.displayPrimitive(current_component,i);
    }

    //Recursively displays the tree
    for(let i = 0; i < current_component.componentref.length; i++) {
        this.displayComponent(this.components[current_component.componentref[i]].id);    
    }

    this.scene.popMatrix();
    this.popMaterial();
    this.popTexture();
}

    getTransformationMatrix(componentID){
        var mat = mat4.create();

        var transf = this.components[componentID].transformation;
        var transfor = this.transformations[transf];

            if(transfor != null){
                if(transfor.translate.length !== 0) {
                    //console.log(this.transformations);
                    var x = transfor.translate[0];
                    var y = transfor.translate[1];
                    var z = transfor.translate[2];
                    //console.log(x)
                    var vec = vec3.fromValues(x,y,z);
                    //console.log("vec: ", vec);
                    mat4.translate(mat,mat,vec3.fromValues(x,y,z));
                }
                if(transfor.rotate.length != 0) {
                    var angle = transfor.rotate[1];
                    switch (transfor.rotate[0]){
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
                }

                if(transfor.scale.length != 0) {
                    var sx = transfor.scale[0];
                    var sy = transfor.scale[1];
                    var sz = transfor.scale[2];

                    mat4.scale(mat, mat, vec3.fromValues(sx,sy,sz));
                }

            }

        return mat;

    }
    displayPrimitive(current_component, i){
      if(this.primitives[current_component.primitiveref[i]] instanceof(MyRectangle) || this.primitives[current_component.primitiveref[i]] instanceof(MyTriangle))
    this.primitives[current_component.primitiveref[i]].set_lengths_texture(current_component.tex_length_s, current_component.tex_length_t);
    

    this.primitives[current_component.primitiveref[i]].display();
  }
}