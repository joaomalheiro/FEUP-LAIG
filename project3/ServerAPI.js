
    
    function getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess;

        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    function makeRequest(requestString, handleReply) {			 
            // Make Request
            this.getPrologRequest(requestString, handleReply);
    }

    function validPlay(b, player, fromX, fromY, toX, toY){
        console.log(b);
        let requestString = 'valid_play('
        + JSON.stringify(b) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
        + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ')';

        makeRequest(requestString, data => validPlayHandler(data));

    }

    function validPlayHandler(data){

        this.valid = JSON.parse(data.target.response);
        console.log(this.valid);
    }