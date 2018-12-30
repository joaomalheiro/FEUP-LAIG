class MadBishops extends CGFobject {

	constructor(scene){
        super(scene);
        this.scene = scene;

        this.activeBishop = null;
        this.pause = false;
        
        this.board = new Board(scene);

        makeRequest("initial_state", data => this.initializeBoard(data));
    }

    checkValidPlay(){
        validPlay(this.boardState, this.playerTurn, 1, 1, 1, 1);
    }
        
    initializeBoard(data) {
        
        this.boardState = JSON.parse(data.target.response)[0];
        this.playerTurn = JSON.parse(data.target.response)[3];

        console.log(this.boardState);

        //this.checkValidPlay();
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
                this.board.makeMove(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof BlackBishop){
                this.activeBishop = obj;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof WhiteBishop){
                this.board.makeMove(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
            }
        } else if (obj instanceof Plane) {
            let endRow = Math.floor(customId / 10);
            let endColumn = customId % 10;
            if(this.activeBishop != null) {
                this.board.makeMove(this.activeBishop.row,this.activeBishop.column,endRow,endColumn);
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