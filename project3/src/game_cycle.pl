%initial board
starting_board([
[0,2,0,2,0,2,0,2,0,2],
[3,0,3,0,3,0,3,0,3,0],
[0,2,0,2,0,2,0,2,0,2],
[3,0,3,0,3,0,3,0,3,0],
[0,2,0,2,0,2,0,2,0,2],
[3,0,3,0,3,0,3,0,3,0],
[0,2,0,2,0,2,0,2,0,2],
[3,0,3,0,3,0,3,0,3,0],
[0,2,0,2,0,2,0,2,0,2],
[3,0,3,0,3,0,3,0,3,0]
]) :- !.

initial_board(board(B, PiecesP1, PiecesP2)) :- starting_board(B), PiecesP1 is 25, PiecesP2 is 25.
initial_player(2) :- !.

initial_state(state(board(B,PiecesP1,PiecesP2), Player)) :-
    initial_board(board(B,PiecesP1,PiecesP2)),
    initial_player(Player).


% Starts game
% TypeP1 - type of player 1
% TypeP2 - type of player 2
% Level - current level
start(TypeP1, TypeP2,Level) :-
    initial_state(state(board(B,PiecesP1,PiecesP2),Player)),
    display_game(B,PiecesP1,PiecesP2,Player),
    game_loop(state(board(B,PiecesP1,PiecesP2),Player), TypeP1, TypeP2, Level).  


% Game loop
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 1 left on board
% Player - current player
% TypeP1 - type of player 1
% TypeP2 - type of player 2
% Level - current level
game_loop(state(board(B,PiecesP1,PiecesP2), _Player), _TypeP1, _TypeP2,_Level):-
    game_over(board(B,PiecesP1,PiecesP2),Winner),
    Winner is 1,
    print_line,
    write(' BLUE PLAYER WON!'),
    print_line.

game_loop(state(board(B,PiecesP1,PiecesP2), _Player), _TypeP1, _TypeP2, _Level):-
    game_over(board(B,PiecesP1,PiecesP2),Winner),
    Winner is 2,
    print_line,
    write(' RED PLAYER WON!'),
    print_line.    

game_loop(state(board(B,PiecesP1,PiecesP2),Player), TypeP1, TypeP2, Level):-
    game_over(board(B,PiecesP1,PiecesP2),_Winner),
    get_type(Player,Type,TypeP1, TypeP2),
    update(state(board(B, PiecesP1, PiecesP2),Player), state(board(NewB, NewPiecesP1, NewPiecesP2), NewPlayer), Type, Level),
    nl,
    display_game(NewB,NewPiecesP1,NewPiecesP2,NewPlayer),
    game_loop(state(board(NewB, NewPiecesP1, NewPiecesP2), NewPlayer),TypeP1, TypeP2, Level).


% Checks is game is over and returns winner
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Winner - player 1 or 2
game_over(board(_B,PiecesP1,_PiecesP2), Winner):-
    PiecesP1 is 0, Winner is 2.

game_over(board(_B,_PiecesP1,PiecesP2), Winner):-
    PiecesP2 is 0, Winner is 1.
    
game_over(board(_B,_PiecesP1, _PiecesP2), 0).


% Updates game elements
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Player - current player
% NewB - board after move
% NewPiecesP1 - pieces of player 1 left on board after move
% NewPiecesP2 - pieces of player 2 left on board after move
% NewPlayer - next player
% TypePlayer - type of current player 
% Level - current level
update(state(board(B, PiecesP1, PiecesP2),Player), state(board(NewB, NewPiecesP1, NewPiecesP2), NewPlayer), TypePlayer, Level):-
    get_move(state(board(B, PiecesP1, PiecesP2),Player),point(FromX,FromY), point(ToX,ToY),TypePlayer, Level),
    move(move(point(FromX,FromY), point(ToX,ToY)), board(B,PiecesP1,PiecesP2), board(NewB,NewPiecesP1,NewPiecesP2), Player),
    change_player(Player,NewPlayer).


% Obtains move
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Player - current player
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
% TypePlayer - type of current player 
% Level - current level
get_move(state(board(B, PiecesP1, PiecesP2),Player),point(FromX,FromY), point(ToX,ToY),TypePlayer,Level):-
    TypePlayer is 1,
    choose_move(state(board(B, PiecesP1, PiecesP2),Player), Level, move(point(FromX,FromY),point(ToX,ToY))),
    write('\n Bot made move: '),
    write(point(FromX,FromY)),
    write(' -> '),
    write(point(ToX,ToY)), nl, 
    write(' Type enter:'),
    get_code(_Input). 

get_move(state(board(B, PiecesP1, PiecesP2),Player),point(FromX,FromY), point(ToX,ToY),TypePlayer,_Level):-
    TypePlayer is 0,
    get_user_move(state(board(B, PiecesP1, PiecesP2),Player),point(FromX,FromY), point(ToX,ToY)).       

% Obtains move from user
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Player - current player
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
get_user_move(state(board(B, PiecesP1, PiecesP2),Player),point(FromX,FromY), point(ToX,ToY)):-

    ask_for_move(point(AuxFromX,AuxFromY), point(AuxToX,AuxToY)),
    ((valid_play(B, Player, point(AuxFromX,AuxFromY), point(AuxToX,AuxToY)),
    FromX is AuxFromX, FromY is AuxFromY, ToX is AuxToX , ToY is AuxToY);
    (write('\nInvalid move. Try again\n\n'),
    get_user_move(state(board(B, PiecesP1, PiecesP2),Player),point(FromX,FromY), point(ToX,ToY)))).



% Chooses move according to current level (easy, medium)
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 1 left on board
% Player - current player
% TypeP1 - type of player 1
% TypeP2 - type of player 2
% Level - current level
% move - coordinates of from and to position
choose_move(state(board(B, _PiecesP1,_PiecesP2),Player), Level, move(point(FromX,FromY),point(ToX,ToY))):-
    Level is 1, ai_easy(B, Player,move(point(FromX,FromY),point(ToX,ToY))).

choose_move(state(board(B, PiecesP1, PiecesP2),Player), Level, move(point(FromX,FromY),point(ToX,ToY))):-
    Level is 2, ai_medium(state(board(B,PiecesP1,PiecesP2),Player),move(FromX,FromY,ToX,ToY)).


% Moves piece
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% NewB - board after move
% NewPiecesP1 - pieces of player 1 left on board after move
% NewPiecesP2 - pieces of player 2 left on board after move
move(move(point(FromX, FromY),point(ToX,ToY)),board(B,PiecesP1,PiecesP2),board(NewBoard,NewPiecesP1,NewPiecesP2),Player):-
    get_piece(B,point(FromX, FromY), Piece),
    replace_in_table(B,FromX,FromY,1,TempBoard),
    replace_in_table(TempBoard,ToX,ToY,Piece, NewBoard),
    check_destiny_target(B,Player,point(ToX,ToY)), 
    Player is 2,
    NewPiecesP1 is (PiecesP1-1), 
    NewPiecesP2 is PiecesP2.

move(move(point(FromX, FromY),point(ToX,ToY)),board(B,PiecesP1,PiecesP2),board(NewBoard,NewPiecesP1,NewPiecesP2),Player):-
    get_piece(B,point(FromX, FromY), Piece),
    replace_in_table(B,FromX,FromY,1,TempBoard),
    replace_in_table(TempBoard,ToX,ToY,Piece, NewBoard),
    check_destiny_target(B,Player,point(ToX,ToY)), 
    Player is 1,
    NewPiecesP2 is PiecesP2-1, 
    NewPiecesP1 is PiecesP1.

move(move(point(FromX, FromY),point(ToX,ToY)),board(B,PiecesP1,PiecesP2),board(NewBoard,NewPiecesP1,NewPiecesP2),_Player):-
    get_piece(B,point(FromX, FromY), Piece),
    replace_in_table(B,FromX,FromY,1,TempBoard),
    replace_in_table(TempBoard,ToX,ToY,Piece, NewBoard),
    NewPiecesP1 is PiecesP1, NewPiecesP2 is PiecesP2.


% Updates current player
% Player - current player
% NewPlayer - next player
change_player(Player, NewPlayer):-
    Player is 1, NewPlayer is 2.
change_player(Player, NewPlayer):-
    Player is 2, NewPlayer is 1.