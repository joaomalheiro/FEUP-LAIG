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
                //this.onXMLMinorError("tag <scene> out of order");

            //Parse SCENE block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <VIEWS>
        var index;
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
        var index;
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
        this.views = [];

        for(var i = 0; i < children.length; i++){
            if(children[i].nodeName === 'perspective' || children[i].nodeName === 'ortho')
            nodeNames.push(children[i].nodeName);
            else  this.onXMLMinorError("unable to parse the type of the view, not perspective or ortho");
        }
        
        console.log(nodeNames[0]);
        for(var j = 0; j < children.length; j++) {
            
            //this.views[j].type = nodeNames[j];
            // Gets indices of each element.
            view.name = this.reader.getString(children[j], 'id');
            view.near = this.reader.getFloat(children[j], 'near');
            view.far = this.reader.getFloat(children[j], 'far');
       
            if(nodeNames[j] === 'perspective'){
                
                this.views[j].angle = this.reader.getFloat(children[j], 'angle');
    //improvement is possible down here..
                this.views[j].fromX = this.reader.getFloat(children[j].children[0],'x');
                this.views[j].fromY = this.reader.getFloat(children[j].children[0],'y');
                this.views[j].fromZ = this.reader.getFloat(children[j].children[0],'z');

                this.views[j].toX = this.reader.getFloat(children[j].children[1],'x');
                this.views[j].toY = this.reader.getFloat(children[j].children[1],'y');
                this.views[j].toZ = this.reader.getFloat(children[j].children[1],'z');

            } else if (nodeNames[j] === 'ortho'){
                    
                this.views[j].left = this.reader.getFloat(children[j],'left');
                this.views[j].right = this.reader.getFloat(children[j],'right');
                this.views[j].top = this.reader.getFloat(children[j],'top');
                this.views[j].bottom = this.reader.getFloat(children[j],'bottom');
            }

        }

        console.log(this.views[1].left);

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
     * Parses the <ILLUMINATION> block.
     * @param {illumination block element} illuminationNode
     */
    parseIllumination(illuminationNode) {
        // TODO: Parse Illumination node

        this.log("Parsed illumination");

        return null;
    }


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

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
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

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
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

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
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
        // TODO: Parse block

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
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
    }


}