/**
 * MadBishops class, representing the game that is to be played.
 */
class MadBishops extends CGFobject {

    /*
    * Constructor for the game object, this is where all the arrays and other attributes needed to play all the game will be initialized
    */
	constructor(scene,player1,player2, timePerPlay){
        super(scene);
        this.scene = scene;
        //Currently selected bishop
        this.activeBishop = null;
        this.pause = false;
        this.board = new Board(scene, timePerPlay);
        //The type of players (Human/AI/Random)
        this.player1 = player1;
        this.player2 = player2;
        //Current boardState in PROLOG list
        this.boardState = null;
        //Previous State that would be implemented if a play was undone
        this.previousBoardState = null;
        //Previous Bishops in the last play that would revert the animations
        this.previousBishops = [];
        //Array of all the moves done in the game
        this.gameMoves = [];
        //Piece count
        this.whitePieces = 25;
        this.blackPieces = 25;

        this.playerTurn = 2;
        this.displayMovie = false;
        this.tempGameMoves = [];

        makeRequest("initial_state", data => this.initializeBoard(data));
    }

    /*
    * Responsible for showing the game Movie till this point
    */
    showMovie(){
        this.board = new Board(this.scene,this.timePerPlay);
        this.displayMovie = true;
    }

    /*
    * Changes the Player that is going to play next. Called when the time on a play is up
    */
    loseTurn(){
        this.playerTurn = (this.playerTurn % 2) + 1;
        this.scene.rotateCamera();
        this.previousBishops = ['LostTurn'];
        this.activeBishop = null;
    }

    /*
    * Makes the connection between the interface button undoMove and the board. Responsible for changing the board state to it's previous one
    */
    undoMove(){
        if(this.boardState != this.previousBoardState && this.previousBoardState != null && this.previousBishops[0] != 'AI' && this.previousBishops[0] != 'LostTurn'){
            this.boardState = this.previousBoardState;
            //Revert the animation
            for(let i = 0; i < this.previousBishops.length; i++){
                this.previousBishops[i].animation.done = false;
                this.previousBishops[i].animation.reverse = true;
            }
            this.playerTurn = (this.playerTurn % 2) + 1;
            this.scene.rotateCamera();
            console.log('Undoing Move',this.previousBoardState,this.boardState);
        }
    }

    /*
    * Calls the server API function validPlay that checks if a certain move is valid depending on the player, board and coordinates
    */
    checkValidPlay(startRow,startColumn,endRow,endColumn){
        validPlay(this.boardState, this.playerTurn, startColumn, startRow,endColumn, endRow, data => this.validPlayHandler(data,startRow,startColumn,endRow,endColumn));
    }
    /*
    * Gets the initial state of the GameBoard from the API 
    */
    initializeBoard(data) {
        
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];
        this.playerTurn = JSON.parse(data.target.response)[3];


    }
    /*
    * Handles the response of the server API function. It checks if the game is over and alerts the player that won, in that case.
    */
    isGameOver(data){
        let gameOver = JSON.parse(data.target.response);
        if(gameOver == 1)
            alert('Player 1 Wins (White), Press New Game to play again');
        else if(gameOver == 2)
            alert('Player 2 Wins (Black), Press New Game to play again')
    }

    /*
    * Handler for the response of the server API function that gets an easy AI move.
    */
    aiEasyPickHandler(data) {
        this.aiEasyMoveFromX = Number(JSON.parse(data.target.response)[0]);
        this.aiEasyMoveFromY = Number(JSON.parse(data.target.response)[1]);
        this.aiEasyMoveToX = Number(JSON.parse(data.target.response)[2]);
        this.aiEasyMoveToY = Number(JSON.parse(data.target.response)[3]);

        this.checkValidPlay(this.aiEasyMoveFromY,this.aiEasyMoveFromX,this.aiEasyMoveToY,this.aiEasyMoveToX);
    }
    /*
    * Handler for the response of the server API function that gets a medium AI move.
    */
    aiMediumPickHandler(data) {
        this.aiMediumMoveFromX = Number(data.target.response[5]);
        this.aiMediumMoveFromY = Number(data.target.response[7]);
        this.aiMediumMoveToX = Number(data.target.response[9]);
        this.aiMediumMoveToY = Number(data.target.response[11]);

        this.checkValidPlay(this.aiMediumMoveFromY,this.aiMediumMoveFromX,this.aiMediumMoveToY,this.aiMediumMoveToX);
    }  

    /*
    * Handler for valid play call to the server. It is the main server handling function because it calls everything that makes the game move. It is the update function that restaurs the game state to be ready to handle another play.
    */
    validPlayHandler(data,startRow,startColumn,endRow,endColumn){

        this.valid = JSON.parse(data.target.response);
        if(this.valid == 1){
            this.board.makeMove(startRow,startColumn,endRow,endColumn);
            serverMove(startColumn,startRow,endColumn,endRow,this.boardState,this.whitePieces,this.blackPieces,this.playerTurn, data2 => this.serverMoveHandler(data2));
            this.playerTurn = (this.playerTurn % 2) + 1;
            this.gameMoves.push([startRow,startColumn,endRow,endColumn]);
            this.activeBishop = null;
            this.board.counter.updateNumberPieces();
        } else 
            console.log('Invalid Move',startColumn,startRow,endColumn,endRow);
    }

    /**
     * Function that handles the move call to the server. It stores the new boardState and the number of pieces of each player after a move is performed.
     * @param {} data 
     */
    serverMoveHandler(data) {
    	this.previousBoardState = this.boardState;
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];

        gameOver(this.boardState,this.whitePieces,this.blackPieces, data2 => this.isGameOver(data2));
    }
    /**
     * Handles a click on the board, depending on if it is a click on a bishops, square, or other object.
     * @param {*} obj 
     * @param {*} customId 
     */
    handleClickBoard(obj,customId) {
        //State machine for dealing with the click
        if((this.playerTurn == 1 && this.player1 == 'Human Player') || (this.playerTurn == 2 && this.player2 == 'Human Player')){
        if(obj instanceof Bishop) {
            if((this.activeBishop == null && obj instanceof WhiteBishop && this.playerTurn == 1)
                || (this.activeBishop == null && obj instanceof BlackBishop && this.playerTurn == 2)){
                this.activeBishop = obj;
            } else if(this.activeBishop == obj){
                this.activeBishop = null;
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof WhiteBishop){
                this.activeBishop = obj;
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof BlackBishop) {
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
                
                let bishops = [];
                bishops.push(this.activeBishop);
                bishops.push(obj);
                this.previousBishops = bishops;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof BlackBishop){
                this.activeBishop = obj;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof WhiteBishop){
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
                let bishops = [];
                bishops.push(this.activeBishop);
                bishops.push(obj);
                this.previousBishops = bishops;
            }
        } else if (obj instanceof Plane) {
            let endRow = Math.floor(customId / 10);
            let endColumn = customId % 10;
            if(this.activeBishop != null) {
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,endRow,endColumn);
                let bishops = [];
                bishops.push(this.activeBishop);
                this.previousBishops = bishops;
            }
        }

    } else  {
        if(this.playerTurn == 1){
            switch(this.player1){
                case 'Random AI':
                    aiEasy(this.boardState, this.playerTurn, data5 => this.aiEasyPickHandler(data5));
                    break;
                case 'Hard AI':
                    aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
                    break;                
                default:
                break;
            }
        } else if(this.playerTurn == 2){
            switch(this.player2){
                case 'Random AI':
                    aiEasy(this.boardState, this.playerTurn, data5 => this.aiEasyPickHandler(data5));
                    break;
                case 'Hard AI':
                    aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
                    break;                
                default:
                break;
            }
        }
        this.previousBishops = ['AI'];

    } 
    }

    update(deltaTime){
        let timeOver = this.board.update(deltaTime);
        //console.log(timeOver);
        if(timeOver && !this.pause)
            this.loseTurn();
        for(let i = 0; i < this.board.whiteBishops.length; i++){
            if(this.activeBishop == this.board.whiteBishops[i]){
                this.board.whiteBishops[i].selected = true;
            } else {
                this.board.whiteBishops[i].selected = false;
            }
            this.board.whiteBishops[i].isSelected();
            if(this.board.whiteBishops[i].animation != null && this.board.whiteBishops[i].animation.reverseDone){
                this.handleUndo();
                this.board.counter.updateNumberPieces();
            }
        }
        for(let i = 0; i < this.board.blackBishops.length; i++){
            if(this.activeBishop == this.board.blackBishops[i]){
                this.board.blackBishops[i].selected = true;
            } else {
                this.board.blackBishops[i].selected = false;
                }
            this.board.blackBishops[i].isSelected();
            if(this.board.blackBishops[i].animation != null && this.board.blackBishops[i].animation.reverseDone){
                this.handleUndo();
                this.board.counter.updateNumberPieces();
            }
            }
            if(this.displayMovie){
                if(this.gameMoves.length > 0) {
                    if(this.board.animationCounter < 2){
                        let move = this.gameMoves[0];
                        let startRow = move[0];
                        let startColumn = move[1];
                        let endRow = move[2];
                        let endColumn = move[3];
                        this.board.makeMove(startRow,startColumn,endRow,endColumn,false);
                        this.tempGameMoves.push(move);
                        this.gameMoves.shift();
                    }
                } else {
                    this.displayMovie = false;
                    this.gameMoves = this.tempGameMoves;
                    this.tempGameMoves = [];
                }
            }
        }
    /**
     * Handles the undoMove button on the game state, reversing the game and the player to the previous play.
     */
    handleUndo(){
        let undoneMove = this.gameMoves.pop();
        this.previousBishops[0].row = undoneMove[0];
        this.previousBishops[0].column = undoneMove[1];
        for(let i = 0; i < this.previousBishops.length; i++){
            this.previousBishops[i].animation = null;
            if(i == 1)
                this.board.reactivate(this.previousBishops[i]);
        }

    }
    /**
     * Displays the game object calling the board display function.
     */
	display() {
        this.scene.pushMatrix();
        this.scene.translate(10.6,1.7,9.2);
        this.scene.scale(0.1,0.1,0.1);
        this.board.display();
        this.scene.popMatrix();
	}
}