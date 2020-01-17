// variables globales
var boardSize = 4;
var boardStatus = new Array;
var boardPop = new Array;
var lastMove = '';
var score = 0;
var history = new Array;
var historique = new Array;
var historyCount = -1;
var continuePlay = 0;
var defaultValue = 512;


$(document).ready(function (){

    $("#win").hide();
    $("#lost").hide();
    $("#gameInfos").hide();
    $("#boardZone").hide();
    $("#error").hide();
    $("#remele").hide();

    // Boutons ------------------------------------------------
    $("#lost #bRestart").click(function (e) {
        $(document).newGameLost();
    });

    $("#win #bRestart").click(function (e) {
        $(document).newGameWin();
    });

    $("#win #bContinue").click(function (e) {
        $(document).continuePlaying();
    });

    $("#start").click(function(e){
        $(document).initialize();
    });

    $("#rebelotte").click(function(e){
        $(document).deleteStoredGame();
        $(document).initialize();
    }); //bouton restart game

    $("#resetGame").click(function(e){
        $(document).deleteStoredGame();
        var adresseActuelle = window.location;
        window.location = adresseActuelle;
    });

    $("#back").click(function(e){
        $(document).moveBack();
    });
    

    if($(document).getStoredGame()) {
        $(document).initialize();
    }

});
