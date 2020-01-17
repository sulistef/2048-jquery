(function($) {

    // -------------------------- LISTENERS -----------------------------------

    $.fn.addKbListener = function() {
        
            $(document).keydown(function (e) {
                                
                if (!e.metaKey) {
                    e.preventDefault();
                }
            
                switch(e.keyCode) {
                    case 37:
                        $(document).moveLeft()
                        break;
            
                    case 38:
                        $(document).moveUp();
                        break;
            
                    case 39:
                        $(document).moveRight()
                        break;
            
                    case 40:
                        $(document).moveDown()
                        break;
                }
            });
        return true;
    };

    $.fn.stopKbListener = function() {
        $(document).off("keydown");
        return true;
    };


// -------------------------- GAME INIT -----------------------------------


    $.fn.initialize = function() {
        
        if ($(document).getStoredGame()) {
            $("#error").hide();
            $(document).createBoard(boardSize);
            $(document).stopKbListener();
            $(document).addKbListener()
            $(document).renderBoard();
            $(document).setScore();
            $("#history").html("<strong>Turn: </strong> #" + historyCount);
            $("#remele").fadeIn(500);

        } else {
            $(document).resetGlobals();
            let boardSizeUserValue = parseInt($("#tailleBoard").val());

            if($(document).setBoardSize(boardSizeUserValue)){
                $("#error").hide();
                $(document).createBoard(boardSize);
                $(document).stopKbListener();
                $(document).addKbListener()
                $(document).initializeBoardStatus();
                $(document).renderBoard();
                $(document).newTile();
                $(document).newTile();
                $(document).setScore();
                $(document).setHistory();
                $("#remele").fadeIn(500);
            }
        }

        return true;
    };

    $.fn.resetGlobals = function() {
        boardStatus = [];
        lastMove = '';
        score = 0;
        history = [];
        historyCount = -1;
        continuePlay = 0;
    };
    
    
    $.fn.setBoardSize = function(size) {
        if(size < 4 || size > 8) {
            $("#error").text("The minimum size of the grid is 4 and maximum is 8");
            $("#error").show();
            return false;
        } else if (size >= 4 && size <= 8) {
            boardSize = size;
            return true;
        } else {
        boardSize = boardSize;
        return true;
        }
    };


    $.fn.createBoard = function(_size) {
        if($("#board")) {
            $("#board").remove();
        }
    
        $("#setup").fadeOut(500);
        $("#gameInfos").fadeIn(500);
        $("#lost").hide();
        $("#win").hide();
    
        let i = 1;
        let k = 1;
        
        let tableau = '<div id="board">';
        while(i <= _size) {
            let j = 1
            tableau += '<div class="boardRow">';
                while (j <= _size) {
                        tableau += '<div class="cellule"><div id = ' + k + '></div></div>';
                    j++;
                    k++;
                }
            tableau += '</div>';
            i++;
        }
        tableau += '</table>';
        $("#boardZone").css('width', 125 * boardSize+'px');
        $("#boardZone").css('height', 125 * boardSize +'px');
        $("#boardZone").css('margin-left', -((125 * boardSize) / 2) +'px');
        $("#boardZone").append(tableau);
        $("#boardZone").fadeTo(500, 1);
        return true;
    };


    $.fn.initializeBoardStatus = function() {
        let i = 1;
        boardStatus[0] = null;
        while(i <= boardSize * boardSize) {
            boardStatus[i] = 512;
            i++;
        }
        return true;
    };


    $.fn.renderBoard = function() {
        let i = 1;
        while(i <= (boardSize * boardSize)) {
            if(boardStatus[i] !== 0) {
                $("#" + i).text(boardStatus[i]);
                $("#" + i).removeClass();
                // if(boardPop.includes(i)) {
                //     $("#" + i).addClass("collision");
                // }
                $(document).styleTile(i);
            } else {
                $("#" + i).text('');
                $("#" + i).removeClass();
            }
            i++;
        }
        return true;
    };


    $.fn.generateRandomTile = function() {
            let tirage = Math.floor(Math.random() * 100);
            if(tirage < 90) {
                return 2;
            } else {
                return 4;
            }
    };


    $.fn.setRandomPosition = function() {
            if(boardStatus.includes(0)) {
                let tempArr = new Array;
                let j = 0;
        
                for (let i = 0; i < boardStatus.length; i++) {
                    if(boardStatus[i] === 0) {
                        tempArr[j] = i;
                        j++;
                    }
                }
        
                let aleatoire = Math.floor(Math.random() * tempArr.length);
        
                return tempArr[aleatoire];
            } else {
                return false;
            }
    };


    $.fn.newTile = function() {
        let numero = $(document).generateRandomTile();
        let position = $(document).setRandomPosition();

        if(position) {
            boardStatus[position] = numero;
            $("#" + position).text(numero);
            $("#" + position).addClass('newTile');
            $(document).styleTile(position);
        }
        return true;
    };



    $.fn.styleTile = function(pos) {
            if(boardStatus[pos] <= 2048) {
                $("#" + pos).addClass('t' + boardStatus[pos]);
            } else {
                $("#" + pos).addClass('tover');
            }
    };


    // ----------------------------- MOVEMENTS ----------------------------


    $.fn.moveLeft = function() {
            let i = 1; // numéro de la ligne
            let j = 1; // numéro de la colonne
            let k = 1; // id du tableau
            let pos = 1;

            while (i <= boardSize){
                j = (i * boardSize) - (boardSize - 1);

                while (j <= boardSize * i) {
                    if(boardStatus[j] !== 0 && (j - 1) > ((i * boardSize) - boardSize)) {
                        k = j;
                        while (boardStatus[k - 1] === 0 && (k - 1) > ((i * boardSize) - boardSize) && k <= i * boardSize) {
                            $(document).stepLeft(k);
                            k--;
                        }
                    }
                    j++;
                }
                i++;
            }
            boardStatus[0] = 'L';
            
            $(document).playTurn();
    };


    $.fn.moveRight = function() {
            let i = 1; // numéro de la ligne
            let j = 1; // numéro de la colonne
            let k = 1; // id du tableau
            let pos = 1;

            while (i <= boardSize) {
                j = (i * boardSize) - (boardSize - 1);

                while (j <= boardSize * i) {
                    if(boardStatus[j] !== 0 && (j + 1) <= (i * boardSize)) {
                        k = j;
                        while (boardStatus[k + 1] === 0 && k > ((i * boardSize) - boardSize) && (k + 1) <= i * boardSize) {
                            $(document).stepRight(k);
                            k--;
                        }
                    }
                    j++;
                }
                i++;
            }
            boardStatus[0] = 'R';
            $(document).playTurn();
    };


    $.fn.moveUp = function() {
            let i = 1; // numéro de la colonne
            let j = 1; // numéro de la ligne
            let k = 1; // id du tableau
            let pos = 1;

            while (i <= boardSize){
                j = 1;

                while (j <= boardSize) {
                    k = (j - 1) * boardSize + i;
                    if(boardStatus[k] !== 0 && (k - boardSize) >= i) {
                        while (boardStatus[k - boardSize] === 0 && (k - boardSize) >= i) {
                            $(document).stepUp(k);
                            k -= boardSize;
                        }
                    }
                    j++;
                }
                i++;
            }
            boardStatus[0] = 'U';
            $(document).playTurn();
    };


    $.fn.moveDown = function() {
            let i = 1; // numéro de la colonne
            let j = 1; // numéro de la ligne
            let k = 1; // id du tableau

            

            while (i <= boardSize){
                j = boardSize;

                while (j >= 1) {
                    k = (j - 1) * boardSize + i;
                    let colMin = i;
                    let colMax = (boardSize - 1) * boardSize + i;

                    let tmp = k + boardSize;

                    if(boardStatus[k] !== 0 && (k + boardSize) <= colMax) {
                        while (boardStatus[k + boardSize] === 0 && (k + boardSize) <= colMax && k >= colMin) {
                            
                            $(document).stepDown(k);
                            k += boardSize;
                        }
                    }
                    j--;
                }
                i++;
            }
            boardStatus[0] = 'D';
            $(document).playTurn();
    };


    $.fn.stepLeft = function(pos) {
        
            boardStatus[pos - 1] = boardStatus[pos];
            boardStatus[pos] = 0;
            $(document).renderBoard();
            $("#" + pos).removeClass();
            $(document).styleTile(pos - 1);
        
    };


    $.fn.stepRight = function(pos) {
        
            boardStatus[pos + 1] = boardStatus[pos];
            boardStatus[pos] = 0;
            $(document).renderBoard();
            $("#" + pos).removeClass();
            $(document).styleTile(pos + 1);
        
    };


    $.fn.stepUp = function(pos) {
        
            boardStatus[pos - boardSize] = boardStatus[pos];
            boardStatus[pos] = 0;
            $(document).renderBoard();
            $("#" + pos).removeClass();
            $(document).styleTile(pos - boardSize);
        
    };


    $.fn.stepDown = function(pos) {
        
            boardStatus[pos + boardSize] = boardStatus[pos];
            boardStatus[pos] = 0;
            $(document).renderBoard();
            $("#" + pos).removeClass();
            $(document).styleTile(pos + boardSize);
        
    };


    $.fn.playTurn = function() {
        
            $(document).checkCollision();
            $(document).setScore();
            $(document).checkVictory();
            $(document).newTile();
            if(!$(document).checkLose()) {
                $(document).setHistory();
            }
    };

    // ----------------------------------- CHECKS ----------------------


    $.fn.checkMovement = function() {
        
            if(boardStatus.includes(0)) {
                return true;
            } else {
                let ligne = new Array;
                let colonne = new Array;
                for (let i = 1; i <= boardSize; i++) {
                    for (let j = 1; j <= boardSize; j++) {
                        ligne[j] = boardStatus[(i - 1) * boardSize + j];
                        colonne[j] = boardStatus[((j * boardSize) - (boardSize - i))];
                    }
        
                    for (let k = 1; k <= boardSize - 1; k++) {
                        if(ligne[k] === ligne[k + 1]) {
                            return true;
                        } else if (colonne[k] === colonne[k + 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        
    };


    $.fn.checkCollision = function() {
        
            lastMove = boardStatus[0];

            for (let i = 1; i <= boardSize; i++) {
                $(document).checkEnLigne(lastMove, i);        
            }
        
    };


    $.fn.checkEnLigne = function(move, lineToCheck) {
            let pos = 0;
            let ligne = new Array;
            for (let i = 1; i <= boardSize; i++) {

                if(move === 'L') {
                    ligne[i] = boardStatus[((lineToCheck * boardSize) - (boardSize - i))];
                } else if (move === 'R') {
                    ligne[i] = boardStatus[lineToCheck * boardSize - (i - 1)];
                } else if (move === 'U') {
                    ligne[i] = boardStatus[(i - 1) * boardSize + lineToCheck];
                } else if (move === 'D') {
                    ligne[i] = boardStatus[boardSize * (boardSize - i) + lineToCheck];
                }
            }

            for (let j = 1; j < ligne.length; j++) {

                if (ligne[j] === ligne[j + 1]) {
                    ligne[j] = ligne[j] + ligne[j + 1];

                    $(document).scorePoints(ligne[j]);

                    // if(move === 'L') {
                    //     pos = ((lineToCheck * boardSize) - (boardSize - j));
                    // } else if (move === 'R') {
                    //     pos = lineToCheck * boardSize - (j - 1);
                    // } else if (move === 'U') {
                    //     pos = (j - 1) * boardSize + lineToCheck;
                    // } else if (move === 'D') {
                    //     pos = boardSize * (boardSize - j) + lineToCheck;
                    // }

                    // boardPop[z] = pos;
                    // z++;

                    k = j + 1;
                    while(k < ligne.length - 1) {
                        ligne[k] = ligne[k + 1];
                        k++;
                    }
                    ligne[ligne.length - 1] = 0;
                }   
            }

            for (let l = 1; l <= boardSize; l++) {
                if(move === 'L') {
                    boardStatus[((lineToCheck * boardSize) - (boardSize - l))] = ligne[l];
                } else if (move === 'R') {
                    boardStatus[lineToCheck * boardSize - (l - 1)] = ligne[l];
                } else if (move === 'U') {
                    boardStatus[(l - 1) * boardSize + lineToCheck] = ligne[l];
                } else if (move === 'D') {
                    boardStatus[boardSize * (boardSize - l) + lineToCheck] = ligne[l];
                }
            }

            $(document).renderBoard();
        
    };


    $.fn.checkVictory = function() {
        
            if(boardStatus.includes(2048) && continuePlay === 0) {
                $("#win").show(500);
                $("#lost #tailleBoard3").val(boardSize);
                $(document).stopKbListener();
                return true;
            }
        
    };


    $.fn.checkLose = function() {
        
            let mvt = $(document).checkMovement();
            if (mvt !== true) {
                $("#boardZone").fadeTo(500, 0.3);
                $("#lost").show(500);
                $("#lost #yourScore").text(score);
                $("#lost #tailleBoard2").val(boardSize);
                $(document).saveHighScore(score);
                $(document).stopKbListener();
                return true;
            }
            return false;
        
    };




    // --------------------------- SCORE ----------------------------

    $.fn.scorePoints = function(pts) {
        
            score += pts;
        
    };


    $.fn.setScore = function(ts) {
        
            $("#score").html("<strong>Score: </strong>" + score + "<br /><strong>High score: </strong>" + $(document).getHighScore());
        
    };


    $.fn.saveHighScore = function(_score) {
        
            let hs = document.cookie.replace(/(?:(?:^|.*;\s*)highScore\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
            if(hs < _score) {
                document.cookie = "highScore=" + score;
            }
        
    };

    $.fn.getHighScore = function() {
        
            let highScore = document.cookie.replace(/(?:(?:^|.*;\s*)highScore\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if(highScore) {
                return highScore;
            } else {
                return 0;
            }
        
    };


    // ------------------------------- GAME RESTART --------------------------

    $.fn.newGameLost = function() {
        
            $(document).deleteStoredGame();
            $(document).resetGlobals();

            if($(document).setBoardSize($("#tailleBoard2").val())){
                $("#error").hide();
                $(document).createBoard(boardSize);
                $(document).addKbListener()
                $(document).initializeBoardStatus();
                $(document).renderBoard();
                $(document).newTile();
                $(document).newTile();
            
                $(document).setScore();
                $(document).setHistory();
                $("#remele").fadeIn(500);
            }
        
    };


    $.fn.newGameWin = function() {
        
            $(document).deleteStoredGame();
            $(document).resetGlobals();            

            if($(document).setBoardSize($("#tailleBoard3").val())){
                $("#error").hide();
                $(document).createBoard(boardSize);
                $(document).addKbListener()
                $(document).initializeBoardStatus();
                $(document).renderBoard();
                $(document).newTile();
                $(document).newTile();
            
                $(document).setScore();
                $(document).setHistory();
                $("#remele").fadeIn(500);
            }
        
    };


    $.fn.continuePlaying = function() {
        

            continuePlay = 1;
            $("#win").hide(500);
            $(document).addKbListener();

        
    };

    // ----------------------------- COOCKIES -----------------------------

    $.fn.getCookieInfos = function() {
        
            if ($(document).getStoredGame()) {
                $("#error").hide();
                $(document).createBoard(boardSize);
                $(document).addKbListener()
                $(document).renderBoard();
                $(document).setScore();
                $(document).setHistory();
                $("#remele").fadeIn(500);
                return true;
            }
        
    return false;
    };
    

    $.fn.setHistory = function() {
        let turn = new Array();
        historyCount = historyCount + 1
        history[historyCount] = boardStatus.toString();

        turn.push(boardSize); // taille du tableau
        turn.push(score); // score
        turn.push(historyCount); //nr du tour
        turn.push(boardStatus.toString()); //tableau historique
        
        historique[historyCount] = turn;

        // console.log(historique);

        document.cookie = "2048=" + turn;
        document.cookie = "2048H=" + historique;

        $("#history").html("<strong>Turn: </strong> #" + historyCount);
        
    return true;
    };


    $.fn.getHistorique = function(_hist) {
        let arrH = new Array();
        arrH = historique[_hist];

        // console.log =(arrH);

        boardSize = parseInt(arrH[0]);
        score = parseInt(arrH[1]);
        historyCount = parseInt(arrH[2]);
        boardStatus = arrH[3].split(',');

        // console.log(boardStatus);

        let j = 1;
        let k = boardStatus.length;

        while(j < k) {
            boardStatus[j] = parseInt(boardStatus[j]);
            j++;
        }

        // console.log(boardStatus);

    return true;
    };

    $.fn.getHistorique2 = function(_hist) {
        let arrH = new Array();
        let i = 1;
        arrH = historique[_hist];

        // console.log =(arrH);

        boardSize = parseInt(arrH[0]);
        score = parseInt(arrH[1]);
        historyCount = parseInt(arrH[2]);

        boardStatus[0] = arrH[3];
        while(i < (boardSize * boardSize + 1)) {
            boardStatus[i] = parseInt(arrH[i + 3]);
            i++;
        }
        // console.log(boardStatus);

    return true;
    };



    $.fn.getStoredGame = function() {
        
        if(document.cookie.replace(/(?:(?:^|.*;\s*)2048H\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
            
            let temp = document.cookie.replace(/(?:(?:^|.*;\s*)2048H\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            let arr = temp.split(',');
            let longRow = 3 + 1 + boardSize * boardSize;
            let histTemp = new Array;
            let i = 0;
            let j = 0;
            let k = 0;

            let now;

            historique = [];

            while(i < arr.length) {
                if(j > longRow - 1) {
                    historique[k] = histTemp;
                    j = 0;
                    histTemp = [];
                    k++;
                }
                
                if (j !== 3 ) {
                    histTemp[j] = parseInt(arr[i]);
                } else {
                    histTemp[j] = arr[i];
                }
                j++;
                i++;
            }
            // console.log(historique.length);
            $(document).getHistorique2(historique.length -1);
           

        } else {
            return false;
        }
    
return true;
};


    $.fn.deleteStoredGame = function(tabs) {
        document.cookie = "2048= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "2048H= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        return true;
    };


    // -------------------------- HISTORY ------------------------------
    $.fn.moveBack = function() {

        if(historyCount -1 >= 0) {
            historyCount = historyCount -1;
            if($(document).getHistorique(historyCount)) {
                console.log(historyCount);
                $(document).renderBoard();
                $("#history").html("<strong>Turn: </strong> #" + historyCount);
                $(document).setScore();
            }
        
        } else {
            alert("End of history");
        }

    return true;
    };

})(jQuery);
