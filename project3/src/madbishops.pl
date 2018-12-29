:- consult('display.pl').
:- consult('menu.pl').
:- consult('game_logic.pl').
:- consult('game_cycle.pl').
:- consult('game_ai.pl').
:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(random)).
:- use_module(library(system)).

% starts game
play:-main_menu.