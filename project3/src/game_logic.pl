% Returns all valid moves
% B - board
% Player - current player
% ListMoves - list returned of all valid moves
valid_moves(B, Player, ListMoves):-
    findall([FromX,FromY,ToX,ToY],valid_play(B,Player,point(FromX,FromY),point(ToX,ToY)),ListMoves).

% Checks if valid play
% B - board
% Player - current player
% PFrom - coordinates of piece to be moved
% PTo - coordinates of desired position
valid_play(B, Player, PFrom, PTo):-
    between_board(PFrom),
    between_board(PTo),
    check_player_piece(B, Player,PFrom),
    valid_kill(B, Player,PFrom,PTo);
    valid_engage(B, Player, PFrom,PTo).

% Checks if valid kill
% B - board
% Player - current player
% PFrom - coordinates of piece to be moved
% PTo - coordinates of desired position
valid_kill(B, Player, PFrom, PTo):-
    check_destiny_target(B,Player, PTo),
    is_diagonal(PFrom,PTo),
    empty_spaces(B,PFrom,PTo).

% Checks if valid engage
% B - board
% Player - current player
% PFrom - coordinates of piece to be moved
% PTo - coordinates of desired position
valid_engage(B, Player, PFrom, PTo):-
    check_player_piece(B,Player,PFrom),
    findall([PFrom], valid_kill(B,Player,PFrom, point(_X,_Y)), ListOfKills),
    length(ListOfKills, 0),
    check_destiny_empty(B,PTo),
    is_diagonal(PFrom,PTo),
    empty_spaces(B,PFrom,PTo),
    valid_kill(B,Player,PTo,point(_X,_Y)).


%HELPER FUNCTIONS

% Checks if diagonal is empty
% B - board
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
empty_spaces(B, point(FromX,FromY), point(ToX,ToY)):-
    DirX is sign(ToX - FromX),
    DirY is sign(ToY - FromY),
    X2 is FromX+DirX,
    Y2 is FromY+DirY,
    empty_spaces_aux(B, point(X2, Y2), point(ToX,ToY), DirX, DirY).


% Checks if there if spaces in diagonal are empty
% B - board
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
empty_spaces_aux(_B, point(X,Y), point(X, Y), _DirX, _DirY).
empty_spaces_aux(B,point(FromX,FromY), point(ToX,ToY), DirX, DirY):-
    X2 is FromX+DirX,
    Y2 is FromY+DirY,
    get_piece(B,point(FromX,FromY),Piece),
    is_empty_piece(Piece),
    empty_spaces_aux(B,point(X2,Y2),point(ToX,ToY),DirX,DirY).


% Verifies is piece in determinate coordinates belogs to current player
% B - board
% Player - current player
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
check_player_piece(B,Player,point(FromX,FromY)):-
    Player is 1,
    get_piece(B, point(FromX,FromY), PlayerPiece) , PlayerPiece == 3.

check_player_piece(B,Player,point(FromX,FromY)):-
    Player is 2,
    get_piece(B, point(FromX,FromY), PlayerPiece) , PlayerPiece == 2.


% Checks if piece in determinate coordinates is empty
% B - board
% ToX - Row of desired position
% ToY - Collumn of desired position
check_destiny_empty(B, point(ToX,ToY)):-
    get_piece(B,point(ToX,ToY),Piece),
    is_empty_piece(Piece).


% Checks if destiny piece is from opposite player
% B - board
% Player - current player
% ToX - Row of desired position
% ToY - Collumn of desired position
check_destiny_target(B,Player, point(ToX,ToY)):-
        Player is 1,
        (get_piece(B,point(ToX,ToY), DestinyPiece) , DestinyPiece =:= 2).

check_destiny_target(B,Player, point(ToX,ToY)):-
        Player is 2,
        (get_piece(B,point(ToX,ToY), DestinyPiece) , DestinyPiece =:= 3). 


% Returns value of piece in determinate coordinates
% B - board
% Row - row of piece
% Column - column of piece
% Value - returned value
get_piece(B, point(Row, Column), Value):-
    nth0(Row, B, HelpRow),
    nth0(Column, HelpRow, Value).



% Transforms coordinate array into a move structure
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
list_to_move(A, move(point(FromX,FromY),point(ToX,ToY))):-
    nth0(0,A,FromX),
    nth0(1,A,FromY),
    nth0(2,A,ToX), 
    nth0(3,A,ToY). 


% Checks is cell is empty
% Piece - number of cell
is_empty_piece(Piece):-
    Piece =:= 1.

% Check if points form a diagonal
% FromX - Row of piece to move
% FromY - Collumn of piece to move
% ToX - Row of desired position
% ToY - Collumn of desired position
is_diagonal(point(FromX,FromY), point(ToX,ToY)):-
    abs(ToX - FromX) =:= abs(ToY - FromY).


% Checks if point respects board size
% X - row
% Y - collumn
between_board(point(X, Y)):-
        between(0, 9, X) , between(0,9,Y). 


% Generates random number in interval D-U
% D - lower limit 
% U - higher limit 
% RandomNum - number generated
generate_random_num(D,U,RandomNum):-
    random(D, U, RandomNum).


% Equals lists
% L1 - list 1
% L2 - list 2
same(L1,L2):-
    append(L1,[],L2).  


% Returns player type based on current player
% Player - current player
% TypeP1 - type of player 1
% TypeP2 - type of player 2
get_type(Player,Type, TypeP1, _TypeP2):-
    Player is 1,
    Type = TypeP1.

get_type(Player,Type, _TypeP1, TypeP2):-
    Player is 2,
    Type = TypeP2.             


% Replaces cell value in list
% [H|T] - list ([cell|tail])
% Y - index
% V - value
% [H|R] - new list 
replace_in_line([_|T], 0, V, [V|T]).
replace_in_line([H|T], Y, V, [H|R]) :-
    Y > 0,
    Y1 is Y - 1,
    replace_in_line(T, Y1, V, R).


% Replaces cell value in list of lists
% [H|T] - list of lists ([list|tail])
% X - row
% Y - column
% V - value
% [U|R] - new list 
replace_in_table([H|T], X, Y, V, [U|R]):-
    X is 0,
    replace_in_line(H,Y,V,U),
    same(T,R).
    
replace_in_table([H|T], X, Y, V, [U|R]):-
    same(H,U),
    X1 is X-1,
    replace_in_table(T,X1,Y,V,R).
