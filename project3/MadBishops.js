class MadBishops extends CGFobject {

	constructor(scene){
        super(scene);
        this.scene = scene;

        this.activeBishop = null;
        this.pause = false;
        
        this.board = new Board(scene);

        this.boardState = null;
        this.whitePieces = null;
        this.blackPieces = null;
        this.playerTurn = null;

        makeRequest("initial_state", data => this.initializeBoard(data));
    }

    checkValidPlay(startRow,startColumn,endRow,endColumn){
        validPlay(this.boardState, this.playerTurn, startRow,startColumn,endRow,endColumn, data => this.validPlayHandler(data,startRow,startColumn,endRow,endColumn));
        /*let newBoard;
        let newP1;
        let newP2;
        serverMove(startRow,startColumn,endRow,endColumn,this.boardState,this.whitePieces,this.blackPieces,newBoard,newP1,newP2,player);*/

    }
        
    initializeBoard(data) {
        
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];
        this.playerTurn = JSON.parse(data.target.response)[3];

        console.log(this.boardState);

    }

    validPlayHandler(data,startRow,startColumn,endRow,endColumn){

        this.valid = JSON.parse(data.target.response);
        if(this.valid == 1){
            this.board.makeMove(startRow,startColumn,endRow,endColumn);
        } else 
            console.log('Invalid Move',startRow,startColumn,endRow,endColumn);
    }
    
    handleClickBoard(obj,customId) {
        if(obj instanceof Bishop) {
            if(this.activeBishop == null){
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