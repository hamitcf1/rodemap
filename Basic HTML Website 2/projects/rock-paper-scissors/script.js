class RockPaperScissors {
    constructor() {
        this.choices = ['rock', 'paper', 'scissors'];
        this.moveIcons = {
            rock: 'fa-hand-rock',
            paper: 'fa-hand-paper',
            scissors: 'fa-hand-scissors',
            question: 'fa-question-circle'
        };
        this.resultMessages = {
            win: 'You win! 🎉',
            lose: 'Computer wins! 😢',
            draw: "It's a draw! 🤝"
        };

        // Load saved state or set defaults
        const savedState = JSON.parse(localStorage.getItem('rpsGameState')) || {
            playerScore: 0,
            computerScore: 0,
            gameHistory: [],
            historyVisible: false
        };

        this.playerScore = savedState.playerScore;
        this.computerScore = savedState.computerScore;
        this.gameHistory = savedState.gameHistory;
        this.historyVisible = savedState.historyVisible;
        this.autoplayInterval = null;

        this.initializeGame();
    }

    initializeGame() {
        // Get DOM elements
        this.playerScoreElement = document.getElementById('player-score');
        this.computerScoreElement = document.getElementById('computer-score');
        this.resultElement = document.getElementById('result');
        this.choiceButtons = document.querySelectorAll('.choice');
        this.resetButton = document.getElementById('reset');
        this.playerMoveIcon = document.getElementById('player-move-icon');
        this.computerMoveIcon = document.getElementById('computer-move-icon');
        this.autoplayBtn = document.getElementById('autoplay-btn');
        this.autoplaySpeed = document.getElementById('autoplay-speed');
        this.historyToggle = document.getElementById('history-toggle');
        this.historyList = document.getElementById('history-list');

        // Set initial scores
        this.playerScoreElement.textContent = this.playerScore;
        this.computerScoreElement.textContent = this.computerScore;

        // Set initial history visibility
        if (this.historyVisible) {
            this.historyList.classList.remove('hidden');
            this.historyToggle.textContent = 'Hide History';
        } else {
            this.historyList.classList.add('hidden');
            this.historyToggle.textContent = 'Show History';
        }

        // Render initial history
        this.renderHistory();

        // Add event listeners
        this.choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.playRound(button.dataset.choice);
            });
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        this.historyToggle.addEventListener('click', () => this.toggleHistory());
    }

    getComputerChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'draw';
        
        const winningCombos = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        return winningCombos[playerChoice] === computerChoice ? 'win' : 'lose';
    }

    playRound(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice, computerChoice);

        if (result === 'win') this.playerScore++;
        if (result === 'lose') this.computerScore++;

        this.updateDisplay(result, playerChoice, computerChoice);
        this.updateMoveDisplay(playerChoice, computerChoice, result);
        this.updateHistory(playerChoice, computerChoice, result);
        this.saveGameState();
    }

    updateDisplay(result, playerChoice, computerChoice) {
        this.playerScoreElement.textContent = this.playerScore;
        this.computerScoreElement.textContent = this.computerScore;

        if (result) {
            const message = `${this.resultMessages[result]}<br>
                You chose ${playerChoice} | Computer chose ${computerChoice}`;
            this.resultElement.innerHTML = message;
        }
    }

    updateMoveDisplay(playerChoice, computerChoice, result) {
        // Remove all possible move classes first
        Object.values(this.moveIcons).forEach(iconClass => {
            this.playerMoveIcon.classList.remove(iconClass);
            this.computerMoveIcon.classList.remove(iconClass);
        });

        // Add new move classes
        this.playerMoveIcon.classList.add(this.moveIcons[playerChoice]);
        this.computerMoveIcon.classList.add(this.moveIcons[computerChoice]);

        // Reset winner classes
        document.querySelector('.player-move').classList.remove('winner');
        document.querySelector('.computer-move').classList.remove('winner');

        // Add winner class
        if (result === 'win') {
            document.querySelector('.player-move').classList.add('winner');
        } else if (result === 'lose') {
            document.querySelector('.computer-move').classList.add('winner');
        }
    }

    updateHistory(playerChoice, computerChoice, result) {
        const historyItem = {
            playerChoice,
            computerChoice,
            result,
            timestamp: new Date().toLocaleTimeString()
        };

        this.gameHistory.unshift(historyItem);
        if (this.gameHistory.length > 10) {
            this.gameHistory.pop();
        }

        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = this.gameHistory
            .map(item => `
                <div class="history-item">
                    <span>${item.timestamp}</span>
                    <div class="moves">
                        <i class="fas ${this.moveIcons[item.playerChoice]}"></i>
                        vs
                        <i class="fas ${this.moveIcons[item.computerChoice]}"></i>
                    </div>
                    <span>${this.resultMessages[item.result]}</span>
                </div>
            `)
            .join('');
    }

    toggleHistory() {
        this.historyVisible = !this.historyVisible;
        this.historyList.classList.toggle('hidden');
        this.historyToggle.textContent = this.historyVisible ? 'Hide History' : 'Show History';
        this.saveGameState();
    }

    toggleAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
            this.autoplayBtn.textContent = 'Start Autoplay';
            this.enableChoiceButtons(true);
        } else {
            this.autoplayInterval = setInterval(() => {
                const randomChoice = this.choices[Math.floor(Math.random() * this.choices.length)];
                this.playRound(randomChoice);
            }, parseInt(this.autoplaySpeed.value));
            this.autoplayBtn.textContent = 'Stop Autoplay';
            this.enableChoiceButtons(false);
        }
    }

    enableChoiceButtons(enabled) {
        this.choiceButtons.forEach(button => {
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
        });
    }

    saveGameState() {
        const gameState = {
            playerScore: this.playerScore,
            computerScore: this.computerScore,
            gameHistory: this.gameHistory,
            historyVisible: this.historyVisible
        };
        localStorage.setItem('rpsGameState', JSON.stringify(gameState));
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            this.playerScore = 0;
            this.computerScore = 0;
            this.gameHistory = [];
            this.historyVisible = false;
            
            this.updateDisplay(null, null, null);
            this.resultElement.innerHTML = 'Choose your weapon!';
            
            Object.values(this.moveIcons).forEach(iconClass => {
                this.playerMoveIcon.classList.remove(iconClass);
                this.computerMoveIcon.classList.remove(iconClass);
            });
            this.playerMoveIcon.classList.add(this.moveIcons.question);
            this.computerMoveIcon.classList.add(this.moveIcons.question);
            
            if (this.autoplayInterval) {
                this.toggleAutoplay();
            }

            this.historyList.classList.add('hidden');
            this.historyToggle.textContent = 'Show History';
            
            localStorage.removeItem('rpsGameState');
            this.renderHistory();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissors();
});