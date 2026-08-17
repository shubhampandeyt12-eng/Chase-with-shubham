/* =====================================================
   SHUBHAM CHESS
   Computer Chess + 7 Levels
===================================================== */


/* =====================================================
   LOAD CHESS.JS
===================================================== */

const chessScript = document.createElement("script");

chessScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js";

chessScript.onload = () => {
    initializeGame();
};

chessScript.onerror = () => {
    alert(
        "Chess engine load nahi ho paya. Internet connection check karo."
    );
};

document.head.appendChild(chessScript);


/* =====================================================
   VARIABLES
===================================================== */

let game;

let playerName = "";

let currentLevel = 1;

let selectedSquare = null;

let possibleMoves = [];

let thinking = false;

let completedLevels = 0;


/*
   Level difficulty.

   Higher level = deeper AI search.
*/

const levelDepth = {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 3
};


/* =====================================================
   DOM ELEMENTS
===================================================== */

const startScreen =
    document.getElementById("startScreen");

const levelScreen =
    document.getElementById("levelScreen");

const gameScreen =
    document.getElementById("gameScreen");

const victoryScreen =
    document.getElementById("victoryScreen");

const resultModal =
    document.getElementById("resultModal");

const playerNameInput =
    document.getElementById("playerName");

const nameError =
    document.getElementById("nameError");

const startGameBtn =
    document.getElementById("startGameBtn");

const levelContainer =
    document.getElementById("levelContainer");

const backToStartBtn =
    document.getElementById("backToStartBtn");

const chessBoard =
    document.getElementById("chessBoard");

const displayPlayerName =
    document.getElementById("displayPlayerName");

const levelText =
    document.getElementById("levelText");

const gameStatus =
    document.getElementById("gameStatus");

const restartBtn =
    document.getElementById("restartBtn");

const quitGameBtn =
    document.getElementById("quitGameBtn");

const undoBtn =
    document.getElementById("undoBtn");

const drawBtn =
    document.getElementById("drawBtn");

const resignBtn =
    document.getElementById("resignBtn");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const nextLevelBtn =
    document.getElementById("nextLevelBtn");

const retryLevelBtn =
    document.getElementById("retryLevelBtn");

const levelsBtn =
    document.getElementById("levelsBtn");

const winnerName =
    document.getElementById("winnerName");

const playAgainBtn =
    document.getElementById("playAgainBtn");


/* =====================================================
   INITIALIZE
===================================================== */

function initializeGame() {

    startGameBtn.addEventListener(
        "click",
        startGame
    );

    backToStartBtn.addEventListener(
        "click",
        () => {

            levelScreen.classList.add("hidden");

            startScreen.classList.remove("hidden");

        }
    );


    restartBtn.addEventListener(
        "click",
        restartCurrentLevel
    );


    quitGameBtn.addEventListener(
        "click",
        quitGame
    );


    undoBtn.addEventListener(
        "click",
        undoMove
    );


    drawBtn.addEventListener(
        "click",
        offerDraw
    );


    resignBtn.addEventListener(
        "click",
        resignGame
    );


    nextLevelBtn.addEventListener(
        "click",
        goToNextLevel
    );


    retryLevelBtn.addEventListener(
        "click",
        retryCurrentLevel
    );


    levelsBtn.addEventListener(
        "click",
        showLevels
    );


    playAgainBtn.addEventListener(
        "click",
        () => {

            victoryScreen.classList.add("hidden");

            levelScreen.classList.remove("hidden");

            renderLevels();

        }
    );


    renderLevels();

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    const name =
        playerNameInput.value.trim();


    if (!name) {

        nameError.textContent =
            "Please enter your name.";

        playerNameInput.focus();

        return;

    }


    playerName = name;

    displayPlayerName.textContent =
        playerName;

    nameError.textContent = "";


    startScreen.classList.add("hidden");

    levelScreen.classList.remove("hidden");


    renderLevels();

}


/* =====================================================
   LEVEL SYSTEM
===================================================== */

function getUnlockedLevel() {

    return Math.min(
        completedLevels + 1,
        7
    );

}


function renderLevels() {

    levelContainer.innerHTML = "";


    for (
        let level = 1;
        level <= 7;
        level++
    ) {

        const button =
            document.createElement("button");


        button.className =
            "levelBtn";


        const number =
            document.createElement("span");

        number.className =
            "levelNumber";

        number.textContent =
            level;


        const label =
            document.createElement("span");

        label.className =
            "levelLabel";


        if (level <= completedLevels) {

            button.classList.add(
                "completed"
            );

            label.textContent =
                "Completed ✓";

        }

        else if (
            level === getUnlockedLevel()
        ) {

            button.classList.add(
                "unlocked"
            );

            label.textContent =
                "Play";

        }

        else {

            label.textContent =
                "Locked 🔒";

            button.disabled = true;

        }


        button.appendChild(number);

        button.appendChild(label);


        button.addEventListener(
            "click",
            () => {

                currentLevel = level;

                startLevel();

            }
        );


        levelContainer.appendChild(button);

    }

}


/* =====================================================
   START LEVEL
===================================================== */

function startLevel() {

    levelScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    resultModal.classList.add("hidden");


    levelText.textContent =
        `Level ${currentLevel}`;


    game = new Chess();


    selectedSquare = null;

    possibleMoves = [];

    thinking = false;


    renderBoard();

    updateStatus();

}


/* =====================================================
   RENDER BOARD
===================================================== */

function renderBoard() {

    chessBoard.innerHTML = "";


    const board =
        game.board();


    /*
       Board is rendered from White's perspective.
    */


    for (
        let row = 0;
        row < 8;
        row++
    ) {

        for (
            let col = 0;
            col < 8;
            col++
        ) {

            const square =
                document.createElement("div");


            const isLight =
                (row + col) % 2 === 0;


            square.className =
                "square " +
                (isLight
                    ? "light"
                    : "dark");


            const squareName =
                String.fromCharCode(
                    97 + col
                ) +
                (8 - row);


            square.dataset.square =
                squareName;


            const piece =
                board[row][col];


            if (piece) {

                const pieceElement =
                    document.createElement("span");


                pieceElement.className =
                    "piece";


                pieceElement.textContent =
                    getPieceSymbol(piece);


                square.appendChild(
                    pieceElement
                );

            }


            if (
                selectedSquare ===
                squareName
            ) {

                square.classList.add(
                    "selected"
                );

            }


            if (
                possibleMoves.includes(
                    squareName
                )
            ) {

                square.classList.add(
                    "possibleMove"
                );

            }


            square.addEventListener(
                "click",
                () => handleSquareClick(
                    squareName
                )
            );


            chessBoard.appendChild(
                square
            );

        }

    }

}


/* =====================================================
   PIECE SYMBOLS
===================================================== */

function getPieceSymbol(piece) {

    const symbols = {

        wp: "♙",
        wr: "♖",
        wn: "♘",
        wb: "♗",
        wq: "♕",
        wk: "♔",

        bp: "♟",
        br: "♜",
        bn: "♞",
        bb: "♝",
        bq: "♛",
        bk: "♚"

    };


    return symbols[
        piece.color + piece.type
    ] || "";

}


/* =====================================================
   SQUARE CLICK
===================================================== */

function handleSquareClick(
    square
) {

    if (
        thinking ||
        game.game_over() ||
        game.turn() !== "w"
    ) {

        return;

    }


    /*
       If a piece is already selected,
       try moving it.
    */

    if (selectedSquare) {

        if (
            possibleMoves.includes(
                square
            )
        ) {

            makePlayerMove(
                selectedSquare,
                square
            );

            return;

        }

    }


    /*
       Select player's piece.
    */

    const piece =
        game.get(square);


    if (
        piece &&
        piece.color === "w"
    ) {

        selectedSquare =
            square;


        possibleMoves =
            game.moves({
                square:
                    selectedSquare,
                verbose: true
            }).map(
                move => move.to
            );


        renderBoard();

        return;

    }


    selectedSquare = null;

    possibleMoves = [];

    renderBoard();

}


/* =====================================================
   PLAYER MOVE
===================================================== */

function makePlayerMove(
    from,
    to
) {

    try {

        const move =
            game.move({
                from: from,
                to: to,
                promotion: "q"
            });


        if (!move) {

            return;

        }


        selectedSquare = null;

        possibleMoves = [];


        renderBoard();

        updateStatus();


        if (
            checkGameEnd()
        ) {

            return;

        }


        /*
           Computer's turn.
        */

        thinking = true;

        gameStatus.textContent =
            "Shubham is thinking...";


        setTimeout(
            computerMove,
            450
        );


    } catch (error) {

        console.log(error);

    }

}


/* =====================================================
   COMPUTER MOVE
===================================================== */

function computerMove() {

    if (
        game.game_over()
    ) {

        thinking = false;

        return;

    }


    if (
        game.turn() !== "b"
    ) {

        thinking = false;

        return;

    }


    const depth =
        levelDepth[currentLevel] || 1;


    const bestMove =
        findBestMove(
            game,
            depth
        );


    if (!bestMove) {

        thinking = false;

        return;

    }


    try {

        game.move({
            from: bestMove.from,
            to: bestMove.to,
            promotion: "q"
        });

    } catch (error) {

        console.log(error);

    }


    thinking = false;


    renderBoard();

    updateStatus();


    checkGameEnd();

}


/* =====================================================
   FIND BEST MOVE
===================================================== */

function findBestMove(
    position,
    depth
) {

    const moves =
        position.moves({
            verbose: true
        });


    if (!moves.length) {

        return null;

    }


    let bestMove = null;

    let bestScore =
        Infinity;


    /*
       Small randomness prevents
       identical-looking games.
    */

    shuffleArray(moves);


    for (
        const move of moves
    ) {

        position.move({
            from: move.from,
            to: move.to,
            promotion:
                move.promotion || "q"
        });


        const score =
            minimax(
                position,
                depth - 1,
                true
            );


        position.undo();


        if (
            score < bestScore
        ) {

            bestScore = score;

            bestMove = move;

        }

    }


    return bestMove;

}


/* =====================================================
   MINIMAX
===================================================== */

function minimax(
    position,
    depth,
    maximizing
) {

    if (
        depth <= 0 ||
        position.game_over()
    ) {

        return evaluatePosition(
            position
        );

    }


    const moves =
        position.moves({
            verbose: true
        });


    if (!moves.length) {

        return evaluatePosition(
            position
        );

    }


    if (maximizing) {

        let best =
            -Infinity;


        for (
            const move of moves
        ) {

            position.move({
                from: move.from,
                to: move.to,
                promotion:
                    move.promotion || "q"
            });


            const score =
                minimax(
                    position,
                    depth - 1,
                    false
                );


            position.undo();


            best =
                Math.max(
                    best,
                    score
                );

        }


        return best;

    }


    else {

        let best =
            Infinity;


        for (
            const move of moves
        ) {

            position.move({
                from: move.from,
                to: move.to,
                promotion:
                    move.promotion || "q"
            });


            const score =
                minimax(
                    position,
                    depth - 1,
                    true
                );


            position.undo();


            best =
                Math.min(
                    best,
                    score
                );

        }


        return best;

    }

}


/* =====================================================
   BOARD EVALUATION
===================================================== */

function evaluatePosition(
    position
) {

    if (
        position.in_checkmate()
    ) {

        /*
           If black is checkmated,
           positive score.

           If white is checkmated,
           negative score.
        */

        return position.turn() === "b"
            ? 100000
            : -100000;

    }


    if (
        position.in_draw()
    ) {

        return 0;

    }


    const values = {

        p: 100,
        n: 320,
        b: 330,
        r: 500,
        q: 900,
        k: 20000

    };


    let score = 0;


    const board =
        position.board();


    for (
        let row = 0;
        row < 8;
        row++
    ) {

        for (
            let col = 0;
            col < 8;
            col++
        ) {

            const piece =
                board[row][col];


            if (!piece) {

                continue;

            }


            const value =
                values[piece.type];


            if (
                piece.color === "b"
            ) {

                score += value;

            }

            else {

                score -= value;

            }

        }

    }


    /*
       Higher levels get a small
       positional preference.
    */

    score +=
        evaluateCenter(
            position
        );


    return score;

}


/* =====================================================
   CENTER CONTROL
===================================================== */

function evaluateCenter(
    position
) {

    let score = 0;


    const centerSquares = [
        "d4",
        "e4",
        "d5",
        "e5"
    ];


    for (
        const square
        of centerSquares
    ) {

        const piece =
            position.get(square);


        if (!piece) {

            continue;

        }


        if (
            piece.color === "b"
        ) {

            score += 12;

        }

        else {

            score -= 12;

        }

    }


    return score;

}


/* =====================================================
   GAME STATUS
===================================================== */

function updateStatus() {

    if (!game) {

        return;

    }


    if (
        game.in_check()
    ) {

        if (
            game.turn() === "w"
        ) {

            gameStatus.textContent =
                "Check! Your King is under attack.";

        }

        else {

            gameStatus.textContent =
                "Check! Shubham's King is under attack.";

        }

        return;

    }


    if (
        game.turn() === "w"
    ) {

        gameStatus.textContent =
            `${playerName}'s Turn`;

    }

    else {

        gameStatus.textContent =
            "Shubham's Turn";

    }

}


/* =====================================================
   CHECK GAME END
===================================================== */

function checkGameEnd() {

    if (
        !game.game_over()
    ) {

        updateStatus();

        return false;

    }


    if (
        game.in_checkmate()
    ) {

        /*
           If turn is white,
           white has been checkmated.

           Therefore Shubham wins.
        */

        if (
            game.turn() === "w"
        ) {

            showLoseScreen();

        }

        else {

            showWinScreen();

        }


        return true;

    }


    /*
       Draw situations.
    */

    showDrawScreen();

    return true;

}


/* =====================================================
   WIN
===================================================== */

function showWinScreen() {

    resultModal.classList.remove(
        "hidden"
    );


    resultIcon.textContent =
        "🏆";


    resultTitle.textContent =
        `Level ${currentLevel} Complete!`;


    resultMessage.textContent =
        `Great job ${playerName}! You defeated Shubham.`;


    /*
       Unlock next level.
    */

    if (
        currentLevel >
        completedLevels
    ) {

        completedLevels =
            currentLevel;

    }


    /*
       Level 7 complete.
    */

    if (
        currentLevel === 7
    ) {

        nextLevelBtn.style.display =
            "none";

        retryLevelBtn.style.display =
            "none";


        resultMessage.textContent =
            `Amazing ${playerName}! You completed all 7 levels.`;


        nextLevelBtn.textContent =
            "View Champion Screen";

        nextLevelBtn.style.display =
            "block";

    }

    else {

        nextLevelBtn.style.display =
            "block";

        retryLevelBtn.style.display =
            "block";

        nextLevelBtn.textContent =
            `Level ${currentLevel + 1}`;

    }

}


/* =====================================================
   LOSE
===================================================== */

function showLoseScreen() {

    resultModal.classList.remove(
        "hidden"
    );


    resultIcon.textContent =
        "❌";


    resultTitle.textContent =
        "Game Over";


    resultMessage.textContent =
        `Shubham defeated you on Level ${currentLevel}. Try again!`;


    nextLevelBtn.style.display =
        "none";


    retryLevelBtn.style.display =
        "block";


    levelsBtn.style.display =
        "none";

}


/* =====================================================
   DRAW
===================================================== */

function showDrawScreen() {

    resultModal.classList.remove(
        "hidden"
    );


    resultIcon.textContent =
        "＝";


    resultTitle.textContent =
        "Draw";


    resultMessage.textContent =
        "The game ended in a draw.";


    nextLevelBtn.style.display =
        "none";


    retryLevelBtn.style.display =
        "block";


    levelsBtn.style.display =
        "block";

}


/* =====================================================
   NEXT LEVEL
===================================================== */

function goToNextLevel() {

    resultModal.classList.add(
        "hidden"
    );


    if (
        currentLevel === 7
    ) {

        showVictoryScreen();

        return;

    }


    currentLevel++;

    startLevel();

}


/* =====================================================
   RETRY
===================================================== */

function retryCurrentLevel() {

    resultModal.classList.add(
        "hidden"
    );


    /*
       Same level starts again.
    */

    startLevel();

}


/* =====================================================
   LEVEL MENU
===================================================== */

function showLevels() {

    resultModal.classList.add(
        "hidden"
    );


    gameScreen.classList.add(
        "hidden"
    );


    levelScreen.classList.remove(
        "hidden"
    );


    renderLevels();

}


/* =====================================================
   RESTART CURRENT LEVEL
===================================================== */

function restartCurrentLevel() {

    if (thinking) {

        return;

    }


    startLevel();

}


/* =====================================================
   QUIT GAME
===================================================== */

function quitGame() {

    if (thinking) {

        return;

    }


    gameScreen.classList.add(
        "hidden"
    );


    levelScreen.classList.remove(
        "hidden"
    );


    renderLevels();

}


/* =====================================================
   UNDO
===================================================== */

function undoMove() {

    if (
        thinking ||
        !game
    ) {

        return;

    }


    /*
       Undo computer move
       and player's previous move.
    */

    if (
        game.history().length >= 2
    ) {

        game.undo();

        game.undo();

        selectedSquare = null;

        possibleMoves = [];

        renderBoard();

        updateStatus();

    }

}


/* =====================================================
   DRAW OFFER
===================================================== */

function offerDraw() {

    if (
        !game ||
        game.game_over()
    ) {

        return;

    }


    const accepted =
        confirm(
            "Do you want to end this game as a draw?"
        );


    if (accepted) {

        showDrawScreen();

    }

}


/* =====================================================
   RESIGN
===================================================== */

function resignGame() {

    if (
        !game ||
        game.game_over()
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to resign?"
        );


    if (confirmed) {

        showLoseScreen();

    }

}


/* =====================================================
   FINAL VICTORY
===================================================== */

function showVictoryScreen() {

    gameScreen.classList.add(
        "hidden"
    );


    resultModal.classList.add(
        "hidden"
    );


    victoryScreen.classList.remove(
        "hidden"
    );


    winnerName.textContent =
        playerName;

}


/* =====================================================
   SHUFFLE ARRAY
===================================================== */

function shuffleArray(
    array
) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }


    return array;

}


/* =====================================================
   ENTER KEY
===================================================== */

playerNameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            startGame();

        }

    }
);


/* =====================================================
   DEFAULT STATE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Everything starts on
           the name screen.
        */

        startScreen.classList.remove(
            "hidden"
        );

        levelScreen.classList.add(
            "hidden"
        );

        gameScreen.classList.add(
            "hidden"
        );

        victoryScreen.classList.add(
            "hidden"
        );

    }
);
