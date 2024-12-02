/*----- constants -----*/
const wordBank = [
  { word: 'ECLIPSE', description: 'A celestial event where one object in the sky passes in front of another, blocking its light.' },
  { word: 'ASTEROID', description: 'A small rocky body orbiting the sun, typically found in the asteroid belt between Mars and Jupiter.' },
  { word: 'METEOR', description: 'A space rock that burns up upon entering Earth’s atmosphere, creating a streak of light in the sky.' },
  { word: 'GALAXY', description: 'A system of stars, planets, and other celestial bodies, bound together by gravity.' },
  { word: 'COSMOS', description: 'The universe seen as a well-ordered whole, encompassing space and time.' },
  { word: 'COMET', description: 'A small icy body that orbits the sun, often exhibiting a visible tail when it gets close to the sun.' },
  { word: 'ASTRONAUT', description: 'A person trained to travel and work in space.' }
];  // Array of objects with both the word and its description

/*----- state variables -----*/
let winner;
let currentTurn; // This will toggle between 'Player 1' and 'Player 2'
let incorrectGuesses;
let correctGuesses;
let currentWord;
let displayedWord;
let hintUsed = false;  // Track if hint has been used

/*----- cached elements -----*/
const messageEl = document.querySelector('#message');
const playAgainEl = document.querySelector('#play-again');
const restartEl = document.querySelector('#restart-game');  // The Restart button
const buttonEls = document.querySelectorAll('.btn-letter > button');
const guessEl = document.querySelector('#guess-btn');
const guessInputEl = document.querySelector('#guess');  // For player's guess input
const hintEl = document.querySelector('#hint-btn');  // The Hint button
const hintDescriptionEl = document.querySelector('#hint-description');  // Element to display hint description
const currentTurnEl = document.querySelector('#current-turn'); // Display current turn (Player 1 or Player 2)

/*----- event listeners -----*/
playAgainEl.addEventListener('click', initializeGame);
restartEl.addEventListener('click', initializeGame);  // Add event listener for restart
buttonEls.forEach(button => {
  button.addEventListener('click', handleLetterGuess);
});
guessEl.addEventListener('click', handleWordGuess);
hintEl.addEventListener('click', provideHint);  // Add event listener for Hint button

/*----- functions -----*/
initializeGame();

function initializeGame() {
  // Select a random word from the word bank
  const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
  currentWord = randomWord.word.toUpperCase();
  displayedWord = '_ '.repeat(currentWord.length).trim();
  incorrectGuesses = [];
  correctGuesses = [];
  winner = false;
  currentTurn = 'Player 1';  // Starting with Player 1
  hintUsed = false;  // Reset hint flag
  hintDescriptionEl.textContent = '';  // Reset hint description
  restartEl.style.display = 'none';  // Hide restart button initially
  hintEl.style.display = 'block';  // Show hint button
  render();
}

function render() {
  // Display the current word with correct guesses
  messageEl.textContent = `Current Word: ${displayedWord}`;
  
  if (winner) {
      messageEl.textContent = `Congrats! ${currentTurn} wins!`;
      restartEl.style.display = 'block';  // Show the restart button when the game is over
      hintEl.style.display = 'none';  // Hide hint button
  } else {
      // Update the current player turn
      if (currentTurnEl) {
          currentTurnEl.textContent = `It's ${currentTurn}'s turn`;
      }

      // Update the incorrect guesses message
      const wrongGuessesEl = document.querySelector('#wrong-guesses');
      if (wrongGuessesEl) {
          wrongGuessesEl.textContent = `Wrong guesses: ${incorrectGuesses.join(', ')}`;
      }
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

  // Clear the letter input field
  guessInputEl.value = '';

  // Toggle turns
  currentTurn = currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
  render();
}


function handleWordGuess() {
  const guessedWord = guessInputEl.value.toUpperCase();  // Get the word guess and convert it to uppercase

  if (guessedWord === currentWord) {
    winner = true;  // Set the winner flag to true if the guessed word is correct
    messageEl.textContent = `Correct! ${currentTurn} guessed the word!`;  // Display a correct message
  } else {
    messageEl.textContent = `Incorrect word guess! The word was ${currentWord}.`;  // Display an incorrect message
  }

  // Clear the input field after the guess
  guessInputEl.value = '';

  // Toggle turns
  currentTurn = currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
  render();  // Update the UI after the guess
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

  // Find the current word's description from the wordBank
  const currentWordObject = wordBank.find(wordObj => wordObj.word.toUpperCase() === currentWord);

  if (currentWordObject) {
    hintDescriptionEl.textContent = `Hint: ${currentWordObject.description}`;
    hintDescriptionEl.classList.add('show');  // Add class to make the hint visible
    console.log(`Hint provided: ${currentWordObject.description}`);  // Debugging line
  } else {
    // In case currentWord doesn't match any entry in wordBank
    console.log("Current word not found in the wordBank");
  }

  hintUsed = true;  // Mark that the hint has been used
  render();  // Update the UI
}
