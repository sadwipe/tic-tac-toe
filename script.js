const roundInformation = document.querySelector(".info");
const table = document.querySelector(".table");
const squares = document.querySelectorAll(".cell");
const resetButton = document.querySelector(".restart-button");

// factory function for creating Player objects.
const Player = (sign) => {
    this.sign = sign;

    const getSign = () => sign;

    return { getSign };
};

// IIFE that handles the logic part of the game.
const GameBoard = (() => {
    let numberOfSigns = 0; // number of signs on the board, used for better efficiency (checkWinner and checkTie function).
    let isOver = false; // variable for stopping the game.
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const deleteMarks = () => {
        squares.forEach(square =>  {
            square.textContent = "";
        });
    }

    // changes the "roundInformation" based on the state of the game (win/tie/play/default)
    const displayMessage = (state, mark) => {
        let message;
        switch(state) {
            case "tie":
                message = `It's a tie!`;
                break;
            case "win":
                message = `${mark} won the game!`;
                break;
            case "play":
                const sign = mark === "✕" ? "O" : "✕"
                message = `Player ${sign}'s turn`;
                break;
            default:
                message = "Player ✕'s turn";
        }
        roundInformation.textContent = message;
    }

    // resets the board, the functions invoked delete the marks and add the default message.
    const resetBoard = () => {
        deleteMarks();
        displayMessage();
        for (let i = 0; i < 9; i++) {
            board[i] = "";
        }
        numberOfSigns = 0; // set the variables to default.
        isOver = false;
    };

    // sets the sign on the table, also checks for tie and win after a sign is placed.
    const setSign = (mark, index) => {
        if (board[index] === "" && isOver === false) {
            board[index] = mark;
            numberOfSigns++;
            if (checkWinner(mark)) {
                isOver = true;
                displayMessage("win", mark);
            } else if (checkTie()) {
                displayMessage("tie");
            } else {
                GameController.swapPlayer();
                displayMessage("play", mark);
            }
        }
    };

    const checkWinner = (sign) => {
        if (numberOfSigns < 5) {
            return false;
        }
        // all combinations for winning
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
        ];
        // we iterate over all combinations and if we find one that matches we return true.
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (board[a] == sign && board[b] == sign && board[c] == sign) {
                return true;
            }
        }
        return false;
    };


    const checkTie = () => {
        return numberOfSigns === 9;
    };

    return { getBoard, setSign, resetBoard };
})();

const GameController = (() => {
    const player1 = Player("✕");
    const player2 = Player("O");

    let currentPlayer = player1;

    const swapPlayer = () => {
        currentPlayer = currentPlayer == player1 ? player2 : player1;
    };

    squares.forEach((square) => {
        square.addEventListener("click", () => {

            const index = square.getAttribute("data-index");
            const sign = currentPlayer.getSign();

            GameBoard.setSign(sign, index);
            square.textContent = GameBoard.getBoard()[index];
        });
    });

    resetButton.addEventListener("click", () => {
        GameBoard.resetBoard();
        currentPlayer = player1;
    })

    return { swapPlayer };
})();
