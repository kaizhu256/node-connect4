/*jslint
    bitwise: true,
    browser: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;



    // run shared js-env code - pre-init
    (function () {
        // init local
        local = {};
        // init modeJs
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        local.nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };
        // export local
        local.global.local = local;
    }());



    // run shared js-env code - function
    (function () {
        local.gameStateCreate = function () {
        /*
         * this function will create a new game state
         */
            var state;
            state = {};
            state.board = [
                // -> rows
                [0, 0, 0, 0, 0, 0], // |
                [0, 0, 0, 0, 0, 0], // v
                [0, 0, 0, 0, 0, 0], //
                [0, 0, 0, 0, 0, 0], // c
                [0, 0, 0, 0, 0, 0], // o
                [0, 0, 0, 0, 0, 0], // l
                [0, 0, 0, 0, 0, 0]  // s
            ];
            state.playerCurrent = 1;
            state.streakToWin = 4;
            return state;
        };

        local.playerMove = function (state, positionCol) {
        /*
         * this function will perform a move
         * by dropping the state.playerCurrent's disc in the given positionCol,
         * and then checks to see if it wins the game
         */
            var colList, ii, positionRow, streak;
            if (state.ended) {
                state.error = new Error('game ended');
            }
            if (state.error) {
                // debug error
                console.error(state.error.stack);
                return;
            }
            if (positionCol === 'random') {
                while (true) {
                    positionCol = Math.floor(Math.random() * state.board.length);
                    colList = state.board[positionCol] || [];
                    if (colList[colList.length - 1] === 0) {
                        break;
                    }
                }
            }
            state.positionCol = positionCol;
            colList = state.board[positionCol] || [];
            // naive algorithm to deposit disc in the last unfilled positionRow in colList
            for (ii = 0; ii < colList.length; ii += 1) {
                if (colList[ii] === 0) {
                    positionRow = ii;
                    colList[positionRow] = state.playerCurrent;
                    // debug board
                    console.log(state.board.join('\n'));
                    break;
                }
            }
            if (positionRow === undefined) {
                state.error = new Error('invalid move');
                // debug error
                console.error(state.error.stack);
                return;
            }
            // naive algorithm to check for win condition in the column
            // e.g.
            // [
            // -> rows
            // [1, 1, 1, 1, 0, 0], // |
            // [2, 2, 2, 0, 0, 0], // v
            // [0, 0, 0, 0, 0, 0], //
            // [0, 0, 0, 0, 0, 0], // c
            // [0, 0, 0, 0, 0, 0], // o
            // [0, 0, 0, 0, 0, 0], // l
            // [0, 0, 0, 0, 0, 0]  // s
            // ]
            streak = 0;
            // iterate through the column
            for (ii = 0; ii < colList.length; ii += 1) {
                if (colList[ii] === state.playerCurrent) {
                    streak += 1;
                    if (streak >= 4) {
                        state.ended = state.playerCurrent;
                        return;
                    }
                } else {
                    streak = 0;
                }
            }
            // naive algorithm to check for win condition in the row
            // e.g.
            // [
            // -> rows
            // [1, 2, 0, 0, 0, 0], // |
            // [1, 2, 0, 0, 0, 0], // v
            // [1, 2, 0, 0, 0, 0], //
            // [1, 0, 0, 0, 0, 0], // c
            // [0, 0, 0, 0, 0, 0], // o
            // [0, 0, 0, 0, 0, 0], // l
            // [0, 0, 0, 0, 0, 0]  // s
            // ]
            streak = 0;
            // iterate through the row
            for (ii = 0; ii < state.board.length; ii += 1) {
                if (state.board[ii][positionRow] === state.playerCurrent) {
                    streak += 1;
                    if (streak >= 4) {
                        state.ended = state.playerCurrent;
                        return;
                    }
                } else {
                    streak = 0;
                }
            }
            // naive algorithm to check for win condition in the upward diagonal
            // e.g.
            // [
            // -> rows
            // [1, 0, 0, 0, 0, 0], // |
            // [2, 1, 0, 0, 0, 0], // v
            // [2, 1, 1, 0, 0, 0], //
            // [2, 2, 1, 1, 0, 0], // c
            // [2, 0, 0, 0, 0, 0], // o
            // [0, 0, 0, 0, 0, 0], // l
            // [0, 0, 0, 0, 0, 0]  // s
            // ]
            streak = 0;
            // iterate through the row
            for (ii = 0; ii < state.board.length; ii += 1) {
                if (state.board[ii][positionRow + ii - positionCol] ===
                        state.playerCurrent) {
                    streak += 1;
                    if (streak >= 4) {
                        state.ended = state.playerCurrent;
                        return;
                    }
                } else {
                    streak = 0;
                }
            }
            // naive algorithm to check for win condition in the downward diagonal
            // e.g.
            // [
            // -> rows
            // [2, 2, 1, 1, 0, 0], // |
            // [2, 1, 1, 0, 0, 0], // v
            // [2, 1, 0, 0, 0, 0], //
            // [1, 0, 0, 0, 0, 0], // c
            // [2, 0, 0, 0, 0, 0], // o
            // [0, 0, 0, 0, 0, 0], // l
            // [0, 0, 0, 0, 0, 0]  // s
            // ]
            streak = 0;
            // iterate through the row
            for (ii = 0; ii < state.board.length; ii += 1) {
                if (state.board[ii][positionRow - ii + positionCol] ===
                        state.playerCurrent) {
                    streak += 1;
                    if (streak >= 4) {
                        state.ended = state.playerCurrent;
                        return;
                    }
                } else {
                    streak = 0;
                }
            }
            // naive algorithm to check if game ends in a draw
            if (state.board.every(function (colList) {
                    return colList[colList.length - 1] !== 0;
                })) {
                state.ended = 0;
                return;
            }
            // switch player for next move
            state.playerCurrent = state.playerCurrent === 1
                ? 2
                : 1;
        };

        // test
        local.gameState = local.gameStateCreate();
        local.playerMove(local.gameState, 'random');
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        local.domGameBoard = document.querySelector('#gameBoard1');
        local.gameBoardDraw = function (state) {
        /*
         * this function will draw the current state of the game
         */
            var board;
            // transpose board
            board = state.board[0].map(function (_, ii) {
                // jslint-hack
                local.nop(_);
                return state.board.map(function (colList) {
                    return colList[ii];
                });
            }).reverse();
            console.log(board);
            board = '<table>\n' +
                '<thead>' + board[0].map(function () {
                    return '<th><button></button></th>';
                }).join('') + '</thead>\n' +
                '<tbody>' + board.map(function (rowList) {
                    return '<tr>' + rowList.map(function (playerDisc) {
                        return '<td><div class="playerDisc playerDisc' + playerDisc +
                            '"></div></td>';
                    }).join('') + '</tr>';
                }).join('\n') + '</tbody></table>';
            console.log(board);
            local.domGameBoard.innerHTML = board;
        };
        local.gameBoardDraw(local.gameState);
        break;



    // run node js-env code - post-init
    case 'node':
        // require modules
        local.http = require('http');
        local.fs = require('fs');
        try {
            local.utility2 = require('utility2');
        } catch (ignore) {
        }
        // save assets-script
        local.assetsScript = local.fs.readFileSync(__filename, 'utf8');
        // init server
        local.server = local.http.createServer(function (request, response) {
            // serve assets-script
            if (request.url.lastIndexOf('assets.index.js') >= 0) {
                response.end(local.assetsScript);
                return;
            }
            // serve main-page
            /* jslint-ignore-begin */
            response.end('\
<html lang="en">\n\
<head>\n\
<meta charset="UTF-8">\n\
<title>connect4</title>\n\
<style>\n\
#gameBoard1 table {\n\
    background-color: #77f;\n\
    border: 1px solid black;\n\
}\n\
.playerDisc {\n\
    border: 1px solid black;\n\
    border-radius: 20px;\n\
    height: 20px;\n\
    margin: 5px;\n\
    width: 20px;\n\
}\n\
.playerDisc1 {\n\
    background-color: #f00;\n\
}\n\
.playerDisc2 {\n\
    background-color: #ff0;\n\
}\n\
</style>\n\
</head>\n\
<body>\n\
<h1>connect 4 game</h1>\n\
<button>reset game</button>\n\
<div id="gameBoard1"></div>\n\
<script src="assets.index.js"></script>\n\
</body>\n\
            ');
            /* jslint-ignore-end */
        });
        local.server.on('error', function (error) {
            if (error.code === 'EADDRINUSE') {
                local.server.listen(8082);
                return;
            }
            throw error;
        });
        local.server.listen(process.env.PORT || 8081);
        break;
    }



    // run shared js-env code - post-init
    (function () {
        return;
    }());
}());
