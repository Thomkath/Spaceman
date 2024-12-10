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
let winner, incorrectGuesses, correctGuesses, currentWord, displayedWord, hintUsed;

/*----- cached elements -----*/
const messageEl = document.querySelector('#message');
const playAgainEl = document.querySelector('#play-again');
const restartEl = document.querySelector('#restart-game');
const buttonEls = document.querySelectorAll('.btn-letter');
const guessEl = document.querySelector('#guess-btn');
const guessInputEl = document.querySelector('#guess');
const hintEl = document.querySelector('#hint-btn');
const hintDescriptionEl = document.querySelector('#hint-description');

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
  displayedWord = '_'.repeat(currentWord.length);
  incorrectGuesses = [];
  correctGuesses = [];
  winner = false;
  hintUsed = false;
  hintDescriptionEl.textContent = '';
  restartEl.style.display = 'none';
  hintEl.style.display = 'block';
  render();
}

function render() {
  messageEl.textContent = `Current Word: ${formatDisplayedWord(displayedWord)}`;
  const wrongGuessesEl = document.querySelector('#wrong-guesses');
  if (wrongGuessesEl) {
    wrongGuessesEl.textContent = `Wrong guesses: ${incorrectGuesses.join(', ')}`;
  }
}

function formatDisplayedWord(word) {
  return word.split('').join(' ');
}

function checkGameOver() {
  if (displayedWord === currentWord) {
    winner = true;
    messageEl.textContent = `Congrats! You guessed the word "${currentWord}"!`;
    restartEl.style.display = 'block';
    hintEl.style.display = 'none';
  } else if (incorrectGuesses.length >= 6) {
    messageEl.textContent = `Game over! The word was "${currentWord}".`;
    restartEl.style.display = 'block';
    hintEl.style.display = 'none';
  }
}

function handleLetterGuess(event) {
  const letter = event.target.textContent.toUpperCase();

  if (correctGuesses.includes(letter) || incorrectGuesses.includes(letter)) {
    messageEl.textContent = 'You already guessed that letter!';
    return;
  }

  if (currentWord.includes(letter)) {
    correctGuesses.push(letter);
    updateDisplayedWord();
  } else {
    incorrectGuesses.push(letter);
  }
  checkGameOver();
}

function handleWordGuess() {
  const guessedWord = guessInputEl.value.toUpperCase();

  if (guessedWord === currentWord) {
    winner = true;
    messageEl.textContent = `Correct! The word was "${currentWord}"!`;
  } else {
    incorrectGuesses.push('WORD-GUESS');
    messageEl.textContent = `Incorrect guess! The word was "${currentWord}".`;
  }

  guessInputEl.value = '';
  checkGameOver();
}

function updateDisplayedWord() {
  displayedWord = currentWord.split('')
    .map(letter => (correctGuesses.includes(letter) ? letter : '_'))
    .join('');
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
}
