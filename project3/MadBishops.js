class MadBishops extends CGFobject {

	constructor(scene){
        super(scene);
        this.scene = scene;

        this.activeBishop = null;
        this.pause = false;
        
        this.board = new Board(scene);

        this.boardState = null;
        this.whitePieces = 25;
        this.blackPieces = 25;
        this.playerTurn = null;

        makeRequest("initial_state", data => this.initializeBoard(data));
    }

    checkValidPlay(startRow,startColumn,endRow,endColumn){
        validPlay(this.boardState, this.playerTurn, startColumn,startRow,endColumn, endRow, data => this.validPlayHandler(data,startRow,startColumn,endRow,endColumn));
    }
        
    initializeBoard(data) {
        
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];
        this.playerTurn = JSON.parse(data.target.response)[3];

        console.log(this.boardState);

    }

    isGameOver(data){
        let gameOver = JSON.parse(data.target.response);
        if(gameOver == 1)
            console.log('Player 1 WONNERED ! :)');
        else if(gameOver == 2)
            console.log('Player 2 WONNERED ! :)');
    }

    aiEasyPickHandler(data) {
        this.aiEasyMoveFromX = JSON.parse(data.target.response)[0];
        this.aiEasyMoveFromY = JSON.parse(data.target.response)[1];
        this.aiEasyMoveToX = JSON.parse(data.target.response)[2];
        this.aiEasyMoveToY = JSON.parse(data.target.response)[3];

        console.log(this.aiEasyMoveFromX);
        console.log(this.aiEasyMoveFromY);
        console.log(this.aiEasyMoveToX);
        console.log(this.aiEasyMoveToY);
    }

    aiMediumPickHandler(data) {
        this.aiMediumMoveFromX = JSON.parse(data.target.response)[0];
        this.aiMediumMoveFromY = JSON.parse(data.target.response)[1];
        this.aiMediumMoveToX = JSON.parse(data.target.response)[2];
        this.aiMediumMoveToY = JSON.parse(data.target.response)[3];

        console.log(this.aiMediumMoveFromX);
        console.log(this.aiMediumMoveFromY);
        console.log(this.aiMediumMoveToX);
        console.log(this.aiMediumMoveToY);
    }

    validPlayHandler(data,startRow,startColumn,endRow,endColumn){

        this.valid = JSON.parse(data.target.response);
        if(this.valid == 1){
            this.board.makeMove(startRow,startColumn,endRow,endColumn);
            this.playerTurn = (this.playerTurn % 2) + 1;
            serverMove(startColumn,startRow,endColumn,endRow,this.boardState,this.whitePieces,this.blackPieces,this.playerTurn, data2 => this.serverMoveHandler(data2));
            this.activeBishop = null;
            gameOver(this.boardState,this.whitePieces,this.blackPieces, data3 => this.isGameOver(data3));
            aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
        } else 
            console.log('Invalid Move',startColumn,startRow,endColumn,endRow);
    }

    serverMoveHandler(data) {
    	
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];
        console.log(this.boardState,this.whitePieces,this.blackPieces)
    }
    
    handleClickBoard(obj,customId) {
        if(obj instanceof Bishop) {
            if((this.activeBishop == null && obj instanceof WhiteBishop && this.playerTurn == 1)
                || (this.activeBishop == null && obj instanceof BlackBishop && this.playerTurn == 2)){
                this.activeBishop = obj;
            } else if(this.activeBishop == obj){
                this.activeBishop = null;
                console.log('thesame');
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof WhiteBishop){
                this.activeBishop = obj;
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof BlackBishop) {
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof BlackBishop){
                this.activeBishop = obj;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof WhiteBishop){
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
            }
        } else if (obj instanceof Plane) {
            let endRow = Math.floor(customId / 10);
            let endColumn = customId % 10;
            if(this.activeBishop != null) {
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,endRow,endColumn);
            }
        }

        console.log(this.activeBishop);
    }

    update(deltaTime){
        this.board.update(deltaTime);
    }

	display() {
		this.board.display();
	}
}