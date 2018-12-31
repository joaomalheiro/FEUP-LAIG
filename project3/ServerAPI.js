
    
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
            getPrologRequest(requestString, handleReply);
    }

    function validPlay(b, player, fromX, fromY, toX, toY, callback){
        let requestString = 'valid_play('
        + JSON.stringify(b) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
        + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ')';

        makeRequest(requestString, callback);

    }

    function gameOver(b, piecesP1, piecesP2, callback){
        let requestString = 'gameOver('
        + JSON.stringify(b) + ','
        + JSON.stringify(piecesP1) + ','
        + JSON.stringify(piecesP2) + ')';

        makeRequest(requestString, callback);

    }

    function serverMove(fromX, fromY, toX, toY,oldBoard,piecesP1,piecesP2,player,callback){
        let requestString = 'make_move('
        + JSON.stringify(fromX) + ','
        + JSON.stringify(fromY) + ','
        + JSON.stringify(toX) + ',' 
        + JSON.stringify(toY) + ','
        + JSON.stringify(oldBoard) + ','
        + JSON.stringify(piecesP1) + ','
        + JSON.stringify(piecesP2) + ','   
        + JSON.stringify(player) + ')';

        makeRequest(requestString, callback);

    }

    