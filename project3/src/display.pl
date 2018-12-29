% displays board, current player and pieces left on board
% T - Board
% Pieces1 - number os player 1's pieces 
% Pieces2 - number os player 2's pieces 
% P - player
display_game([],_PiecesP1,_Pieces2, _P).
display_game(T,Pieces1,Pieces2,P) :-
print_line, nl,
  write('PLAYER TURN: '),
  printPlayer(P),
  nl,nl,
  write('RED BISHOPS: '), write(Pieces2),
  write('  |  BLUE BISHOPS: '), write(Pieces1),nl,nl,
  write('    0   1   2   3   4   5   6   7   8   9'),
  print_seperation,
  nl,
  table_print(T,-1).


% Prints player(P) color
printPlayer(1):-
  write('BLUE').

printPlayer(2):-
  write('RED').

% Prints a seperation line separation
print_seperation :- 
  nl,
  write('  |---|---|---|---|---|---|---|---|---|---|').

% Prints the board
% [L|T] - list of lists ([list|tail])
% X - row counter 
table_print([], _X).
table_print([L|T],X) :-
  C is X+1,
  write(C),
  print_list(L),
  write(' |'),
  print_seperation,
  nl,
  table_print(T,C).

% Prints a row of the board
% [C|L] - list ([cell|tail])
print_list([]).
print_list([C|L]) :-
  write(' | '),
  print_cell(C),
  print_list(L).

% Prints a single board cell
% X - symbol
print_cell(X) :-
  print_symbol(X,S),
  write(S).

% Prints dashed line
print_line :-
nl,
write('-------------------------------------------'),
nl.  

% Prints correspondent symbol to number
% _ - number
% S - symbol
print_symbol(0,S) :- S='.'.
print_symbol(1,S) :- S=' '.
print_symbol(2,S) :- S='V'.
print_symbol(3,S) :- S='B'.
