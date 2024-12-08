/*----- constants -----*/
const wordBank = [
  { word: 'ECLIPSE', description: 'A celestial event where one object in the sky passes in front of another, blocking its light.' },
  { word: 'ASTEROID', description: 'A small rocky body orbiting the sun, typically found in the asteroid belt between Mars and Jupiter.' },
  { word: 'METEOR', description: 'A space rock that burns up upon entering Earth’s atmosphere, creating a streak of light in the sky.' },
  { word: 'GALAXY', description: 'A system of stars, planets, and other celestial bodies, bound together by gravity.' },
  { word: 'COSMOS', description: 'The universe seen as a well-ordered whole, encompassing space and time.' },
  { word: 'COMET', description: 'A small icy body that orbits the sun, often exhibiting a visible tail when it gets close to the sun.' },
  { word: 'ASTRONAUT', description: 'A person trained to travel and work in space.' }
];

/*----- state variables -----*/
let winner;
let currentTurn;
let incorrectGuesses;
let correctGuesses;
let currentWord;
let displayedWord;
let hintUsed = false;

/*----- cached elements -----*/
const messageEl = document.querySelector('#message');
const playAgainEl = document.querySelector('#play-again');
const restartEl = document.querySelector('#restart-game');
const buttonEls = document.querySelectorAll('.btn-letter');
const guessEl = document.querySelector('#guess-btn');
const guessInputEl = document.querySelector('#guess');
const hintEl = document.querySelector('#hint-btn');
const hintDescriptionEl = document.querySelector('#hint-description');
const currentTurnEl = document.querySelector('#current-turn');
const happyImageEl = document.querySelector('#happy-image');
const sadImageEl = document.querySelector('#sad-image');

/*----- event listeners -----*/
playAgainEl.addEventListener('click', initializeGame);
restartEl.addEventListener('click', initializeGame);
buttonEls.forEach(button => button.addEventListener('click', handleLetterGuess));
guessEl.addEventListener('click', handleWordGuess);
hintEl.addEventListener('click', provideHint);

/*----- functions -----*/
initializeGame();

function initializeGame() {
  const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
  currentWord = randomWord.word.toUpperCase();
  displayedWord = '_ '.repeat(currentWord.length).trim();
  incorrectGuesses = [];
  correctGuesses = [];
  winner = false;
  currentTurn = 'Player 1';
  hintUsed = false;
  hintDescriptionEl.textContent = '';
  restartEl.style.display = 'none';
  hintEl.style.display = 'block';
  enableAllButtons();
  hideImages(); 
  render();
}

function render() {
  messageEl.textContent = `Current Word: ${displayedWord}`;

  if (winner) {
    messageEl.textContent = `Congrats! ${currentTurn} wins!`;
    restartEl.style.display = 'block';
    hintEl.style.display = 'none';
  } else {
    currentTurnEl.textContent = `It's ${currentTurn}'s turn`;
    const wrongGuessesEl = document.querySelector('#wrong-guesses');
    if (wrongGuessesEl) {
      wrongGuessesEl.textContent = `Wrong guesses: ${incorrectGuesses.join(', ')}`;
    }
  }
}

function handleLetterGuess(event) {
  if (winner || checkGameOver()) return; 

  const letter = event.target.textContent.toUpperCase();

  if (correctGuesses.includes(letter) || incorrectGuesses.includes(letter)) {
    messageEl.textContent = 'You already guessed that letter!';
    return;
  }

  if (currentWord.includes(letter)) {
    correctGuesses.push(letter);
    updateDisplayedWord();
    showImage('happy');
  } else {
    incorrectGuesses.push(letter);
    showImage('sad');
  }

  if (displayedWord === currentWord) {
    winner = true;
    messageEl.textContent = `${currentTurn} wins!`;
    restartEl.style.display = 'block';
    disableAllButtons();
    return;
  }

  switchPlayer();
}

function handleWordGuess() {
  if (winner || checkGameOver()) return; 

  const guessedWord = guessInputEl.value.toUpperCase().trim();
  if (!guessedWord) {
    messageEl.textContent = 'Please enter a word!';
    return;
  }

  if (guessedWord === currentWord) {
    winner = true;
    messageEl.textContent = `Correct! ${currentTurn} guessed the word!`;
    showImage('happy');
    restartEl.style.display = 'block';
    disableAllButtons();
  } else {
    messageEl.textContent = `Incorrect word guess! The word was ${currentWord}.`;
    showImage('sad');
    restartEl.style.display = 'block';
    disableAllButtons();
  }
}

function updateDisplayedWord() {
  displayedWord = currentWord.split('')
    .map(letter => (correctGuesses.includes(letter) ? letter : '_'))
    .join(' ');
  render();
}

function provideHint() {
  if (hintUsed) {
    messageEl.textContent = "You have already used the hint!";
    return;
  }

  const currentWordObject = wordBank.find(wordObj => wordObj.word.toUpperCase() === currentWord);
  if (currentWordObject) {
    hintDescriptionEl.textContent = `Hint: ${currentWordObject.description}`;
  }

  hintUsed = true;
  render();
}

function switchPlayer() {
  currentTurn = currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
  render();
}

function checkGameOver() {
  if (incorrectGuesses.length >= 6) {
    messageEl.textContent = `Game over! The word was ${currentWord}.`;
    restartEl.style.display = 'block';
    disableAllButtons();
    return true;
  }
  return false;
}

function disableAllButtons() {
  buttonEls.forEach(button => button.disabled = true);
}

function enableAllButtons() {
  buttonEls.forEach(button => button.disabled = false);
}

function showImage(type) {
  if (type === 'happy') {
    happyImageEl.style.display = 'block';
    sadImageEl.style.display = 'none';
  } else if (type === 'sad') {
    sadImageEl.style.display = 'block';
    happyImageEl.style.display = 'none';
  }
}

function hideImages() {
  happyImageEl.style.display = 'none';
  sadImageEl.style.display = 'none';
}
