
    /**
     * Function that sets up the request and sends it, using the request string given 
     * @param {*} requestString 
     * @param {*} onSuccess 
     * @param {*} onError 
     * @param {*} port 
     */
    function getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess;

        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
    /**
     * Helper that calls the main function. This one is the one that is called on every ServerAPI.js function to establish the connection between js and prolog code
     * @param {*} requestString 
     * @param {*} handleReply 
     */
    function makeRequest(requestString, handleReply) {			 
            // Make Request
            getPrologRequest(requestString, handleReply);
    }
    /**
     * Function that makes the request to check if a certain play(using 2 points of the board) is valid or not
     * @param {*} b 
     * @param {*} player 
     * @param {*} fromX 
     * @param {*} fromY 
     * @param {*} toX 
     * @param {*} toY 
     * @param {*} callback 
     */
    function validPlay(b, player, fromX, fromY, toX, toY, callback){
        let requestString = 'valid_play('
        + JSON.stringify(b) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
        + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ')';

        console.log(fromX, fromY, toX, toY);

        makeRequest(requestString, callback);

    }
    /**
     * Function that makes the request to check if the game is over using the board and the number of pieces for each player
     * @param {*} b 
     * @param {*} piecesP1 
     * @param {*} piecesP2 
     * @param {*} callback 
     */
    function gameOver(b, piecesP1, piecesP2, callback){
        let requestString = 'gameOver('
        + JSON.stringify(b) + ','
        + JSON.stringify(piecesP1) + ','
        + JSON.stringify(piecesP2) + ')';

        makeRequest(requestString, callback);

    }
    /**
     * Function that makes the request to get a move from the Easy AI using the board and the current playing player
     * @param {*} b 
     * @param {*} player 
     * @param {*} callback 
     */
    function aiEasy(b, player, callback){
        let requestString = 'ai_easy('
        + JSON.stringify(b) + ','
        + JSON.stringify(player) + ')';

        makeRequest(requestString, callback);
    }

    /**
     * Function that makes the request to check if a certain play(using 2 points of the board) is valid or not
     * @param {*} b 
     * @param {*} player 
     * @param {*} piecesP1 
     * @param {*} piecesP2 
     * @param {*} callback 
     */
    function aiMedium(b, player, piecesP1, piecesP2, callback){
        console.log('hey');
        let requestString = 'ai_medium('
        + JSON.stringify(b) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(piecesP1) + ','
        + JSON.stringify(piecesP2) + ')';

        makeRequest(requestString, callback);
    }
    /**
     * Function that makes the request responsible for making a move in PROLOG, updating the board state, player and pieces of each player
     * @param {*} fromX 
     * @param {*} fromY 
     * @param {*} toX 
     * @param {*} toY 
     * @param {*} oldBoard 
     * @param {*} piecesP1 
     * @param {*} piecesP2 
     * @param {*} player 
     * @param {*} callback 
     */
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

        console.log(fromX, fromY, toX, toY);



        makeRequest(requestString, callback);

    }

    