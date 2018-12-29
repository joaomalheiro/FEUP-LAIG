% Gets move from ai bot, medium difficulty
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Player - current player
% Move - move to be returned by ai
ai_medium(state(board(B,PiecesP1,PiecesP2),Player),Move):-
    findall(Value-FromX-FromY-ToX-ToY,(valid_play(B, Player, point(FromX,FromY),point(ToX,ToY)),
    move(move(point(FromX, FromY),point(ToX,ToY)),board(B,PiecesP1,PiecesP2),board(NewBoard,NewPiecesP1,NewPiecesP2),Player),
    change_player(Player,NewPlayer),
    value(state(board(NewBoard,NewPiecesP1,NewPiecesP2),NewPlayer),Value)),ListValues),
    choose_best_move(ListValues, Move,-100,move(0,0,0,0)).


% Chooses recursively best possible move by checking if current best value is better than the next and so on
% [ActualValue-FromX-FromY-ToX-ToY|T] - array of board values
% BestMove - returned move
% CurrBestValue - auxiliar value to be compared to all values
% CurrBestMove - auxiliar move
choose_best_move([],BestMove, _CurrBestValue, BestMove).
choose_best_move([ActualValue-FromX-FromY-ToX-ToY|T],BestMove, CurrBestValue, _CurrBestMove):-
    ActualValue > CurrBestValue,
    choose_best_move(T,BestMove,ActualValue,move(FromX,FromY,ToX,ToY)).
    
choose_best_move([ActualValue-FromX-FromY-ToX-ToY|T], BestMove, CurrBestValue,CurrBestMove):-
    (ActualValue =:= CurrBestValue,
    generate_random_num(0,2,1),
    choose_best_move(T, BestMove, ActualValue,move(FromX,FromY,ToX,ToY))); choose_best_move(T, BestMove, CurrBestValue, CurrBestMove).


% Attributes value to board
% B - board
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Player - current player
% Value - value attributed
value(state(board(B,PiecesP1,PiecesP2),Player),Value):-
    value_kills(PiecesP1, PiecesP2, Player, Value_kills),
    value_killable(B, Player, Value_killable),
    Value is Value_kills - Value_killable.


% Returns value of a kill
% PiecesP1 - pieces of player 1 left on board
% PiecesP2 - pieces of player 2 left on board
% Player - current player
% Value - value attributed
value_kills(PiecesP1, PiecesP2, Player, Value):-
    Player is 1, 
    Value is PiecesP2*(PiecesP2-PiecesP1).

value_kills(PiecesP1, PiecesP2, Player, Value):-  
    Player is 2,
    Value is PiecesP1*(PiecesP1-PiecesP2).


% Returns value related to if opposite player can kill current player after the move
% B - board
% Player - current player
% Value - value attributed
value_killable(B, Player, Value):-
    findall([FromX,FromY,ToX,ToY],(check_player_piece(B, Player,point(FromX,FromY)),valid_kill(B,Player,point(FromX,FromY),point(ToX,ToY))),ListKills),
    length(ListKills, ListSize),
    Value is ListSize.


% Gets move from ai bot, medium difficulty
% B - board
% Player - current player
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
ai_easy(B, Player, move(point(FromX,FromY),point(ToX,ToY))):-
    valid_moves(B, Player, ListMoves),
    length(ListMoves, _ListSize),
    generate_random_num(0,_ListSize,RandomNum),
    nth0(RandomNum, ListMoves, Movement),
    list_to_move(Movement,move(point(FromX,FromY),point(ToX,ToY))).