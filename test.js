/*
 * test.js
 *
 * this file contains the standalone connect-4 game
 *
 * setup instructions
 * 1. save this file as test.js
 * 2. install nodejs
 * 3. run the shell command
 *    $ PORT=8081 node test.js
 * 4. open browser to url http://localhost:8081
 * 5. play the connect4 game!
 */



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
            // [1, 2, 0, 0, 0, 0], // |
            // [2, 1, 0, 0, 0, 0], // v
            // [2, 1, 1, 0, 0, 0], //
            // [2, 2, 1, 1, 0, 0], // c
            // [0, 0, 0, 0, 0, 0], // o
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
            // [1, 2, 0, 0, 0, 0], // c
            // [0, 0, 0, 0, 0, 0], // o
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
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        local.domGameBoard = document.querySelector('#gameBoard1');
        local.gameDraw = function (state) {
        /*
         * this function will draw the current state of the game
         */
            var board, tmp;
            tmp = '';
            // game ended with a draw
            if (state.ended === 0) {
                tmp += 'game is a draw!';
                tmp += '<div class="playerDisc"></div>';
            } else {
                // game ended with a win
                if (state.ended) {
                    tmp += 'player ' + state.playerCurrent + ' has won!';
                // game is ongoing
                } else {
                    tmp += 'player ' + state.playerCurrent + '\'s turn';
                    if (state.error && state.error.message === 'invalid move') {
                        tmp += ' <span style="color: #f00;">(invalid move, retry!)</span>';
                    }
                }
                tmp += '<div class="playerDisc playerDisc' + state.playerCurrent + '"></div>';
            }
            document.querySelector('#gameStatus1').innerHTML = tmp;
            // remove error
            state.error = null;
            // transpose board
            board = state.board[0].map(function (_, ii) {
                // jslint-hack
                local.nop(_);
                return state.board.map(function (colList) {
                    return colList[ii];
                });
            }).reverse();
            board = '<table>\n' +
                '<thead>' + board[0].map(function (_, ii) {
                    // jslint-hack
                    local.nop(_);
                    return '<th><button data-position-col="' + ii + '">&#x25BC;</button></th>';
                }).join('') + '</thead>\n' +
                '<tbody>' + board.map(function (rowList) {
                    return '<tr>' + rowList.map(function (playerDisc) {
                        return '<td><div class="playerDisc playerDisc' +
                            playerDisc + '"></div></td>';
                    }).join('') + '</tr>';
                }).join('\n') + '</tbody></table>';
            local.domGameBoard.innerHTML = board;
        };
        local.testRun = function (event) {
            switch (event && event.currentTarget.id) {
            case 'gameBoard1':
                // perform player move
                if (event.target.dataset.positionCol) {
                    local.playerMove(local.gameState, Number(event.target.dataset.positionCol));
                    local.gameDraw(local.gameState);
                }
                break;
            // reset game
            case 'resetButton1':
                local.gameState = local.gameStateCreate();
                local.gameDraw(local.gameState);
                break;
            }
        };
        // init event-handling
        ['click'].forEach(function (event) {
            Array.prototype.slice.call(
                document.querySelectorAll('.on' + event)
            ).forEach(function (element) {
                element.addEventListener(event, local.testRun);
            });
        });
        // reset game
        document.querySelector('#resetButton1').click();
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
            // debug
            console.log('handling request ' + request.url);
            // serve assets-script
            if (request.url.lastIndexOf('test.js') >= 0) {
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
#gameBoard1 thead button:hover {\n\
    cursor: pointer;\n\
}\n\
#gameBoard1 thead {\n\
    margin-bottom: 10px;\n\
}\n\
#gameBoard1 table {\n\
    background-color: #77f;\n\
}\n\
.playerDisc {\n\
    background-color: #fff;\n\
    border: 1px solid black;\n\
    border-radius: 20px;\n\
    height: 20px;\n\
    margin: 5px;\n\
    width: 20px;\n\
}\n\
.playerDisc1 {\n\
    background-color: #ff0;\n\
}\n\
.playerDisc2 {\n\
    background-color: #f00;\n\
}\n\
</style>\n\
</head>\n\
<body>\n\
<h1>connect-4 game</h1>\n\
<h4><a download href="test.js">download standalone app</a></h4>\n\
<button class="onclick" id="resetButton1">reset game</button><br>\n\
<br>\n\
<h2 id="gameStatus1"></h2>\n\
<div id="gameContainer1">\n\
    <div class="onclick" id="gameBoard1"></div>\n\
</div>\n\
<script src="test.js"></script>\n\
</body>\n\
            ');
            /* jslint-ignore-end */
        });
        local.server.on('error', function (error) {
            if (error.code === 'EADDRINUSE' && !local.EADDRINUSE) {
                local.EADDRINUSE = error;
                local.PORT = Number(local.PORT) + 1;
                local.server.listen(local.PORT, function () {
                    console.log('server listening on port ' + local.PORT);
                });
                return;
            }
            throw error;
        });
        local.PORT = process.env.PORT || 8081;
        local.server.listen(local.PORT, function () {
            console.log('server listening on port ' + local.PORT);
        });
        break;
    }



    // run shared js-env code - post-init
    (function () {
        return;
    }());
}());
