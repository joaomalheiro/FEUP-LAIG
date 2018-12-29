class ServerAPI extends CGFobject {

	constructor(scene){
        super(scene);
        this.scene = scene;
    }
    
    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess;

        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString, handleReply) {			 
            // Make Request
            this.getPrologRequest(requestString, handleReply);
	}
}