// Gameboard Module
const Gameboard = (() => {
    const board = new Array(9).fill(null);

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
        DisplayController.updateBoardDisplay();
    };

    return {
        getBoard: () => board,
        setMark: (index, mark) => {
            board[index] = mark;
        },
        resetBoard,
    };
})();

// Player Factory
const createPlayer = (name, marker) => ({ name, marker, isTurn: false });

// GameController Module
const GameController = (() => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    const players = [
        createPlayer("Player 1", "X"),
        createPlayer("Player 2", "O"),
    ];

    let gameActive = false;

    const startGame = () => {
        Gameboard.resetBoard();
        players[0].name = document.getElementById('player1-name').value || 'Player 1';
        players[1].name = document.getElementById('player2-name').value || 'Player 2';
        players[0].isTurn = true;
        gameActive = true;
    };

    const endGame = () => {
        gameActive = false;
    };

    const toggleTurn = () => {
        players.forEach(player => player.isTurn = !player.isTurn);
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        for (const [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return players.find(player => player.marker === board[a]);
            }
        }
        return false;
    };

    return {
        get currentPlayer() {
            return players.find(player => player.isTurn);
        },
        startGame,
        endGame,
        toggleTurn,
        checkWin,
        checkTie: () => Gameboard.getBoard().every(cell => cell),
        get gameActive() {
            return gameActive;
        }
    };
})();

// DisplayController Module
const DisplayController = (() => {
    const boxElements = document.querySelectorAll(".box");
    const gameResultElement = document.getElementById('game-result');

    const updateBoardDisplay = () => {
        boxElements.forEach(box => {
            const index = box.getAttribute('data-boxPlace');
            box.textContent = Gameboard.getBoard()[index] || '';
            box.style.pointerEvents = 'all';
        });
        gameResultElement.textContent = '';
    };

    return {
        displayWinner: winner => {
            gameResultElement.textContent = `${winner.name} is the winner!`;
        },
        displayTie: () => {
            gameResultElement.textContent = "It's a tie!";
        },
        updateBoardDisplay,
    };
})();

// Main Game Module
const TicTacToe = (() => {
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', () => {
        GameController.startGame();
    });

    gameContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains('box')) return;
        if (!GameController.gameActive) return;

        const boxIndex = e.target.getAttribute("data-boxPlace");
        const currentPlayer = GameController.currentPlayer;

        e.target.innerText = currentPlayer.marker;
        Gameboard.setMark(boxIndex, currentPlayer.marker);
        GameController.toggleTurn();
        e.target.style.pointerEvents = "none";

        const winner = GameController.checkWin();
        if (winner) {
            DisplayController.displayWinner(winner);
            GameController.endGame();
        } else if (GameController.checkTie()) {
            DisplayController.displayTie();
            GameController.endGame();
        }
    });
})();
