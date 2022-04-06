/* 

    JAVASCRIPT CODE FOR WORDLE CLONE
    Author: Daniel Viglietti (modified from existing tutorials available online)
    
    
    I followed a tutorial so we can get some ideas. We'll obviously have to credit and change a lot of this to make it our own
    coz of academic integrity and all that. But at least we can get a basic understanding on what to do.

*/

/* THIS EVENT LISTENER ENSURES THE CODE RUNS WHEN THE PAGE LOADS */
document.addEventListener("DOMContentLoaded", () => {
    /* CHECK IF THEY'VE PLAYED TODAY YET */
    var completeToday = false; /* HARD CODED FOR TESTING. NEED A WAY TO SAVE THIS IN BROWSER SETTINGS */
    var winLose;
    
    /* THIS FUNCTION USES A LOOP TO DRAW THE SQUARES INSTEAD OF HARD CODING IT ALL IN HTML */
    createSquares();
    canYouPlay();

    /* 
        
        IDEAS
            - We need a way to save the users settings like what colour mode they prefer and if they use colour blind mode
            - Need a way to save the users game statistics, and if the user is finished, etc
            - Can probably use Local Storage, will need to research into that.

    */

    /* THESE VARIABLES ARE FOR SAVING GUESSED WORDS AND DETERMINING AVAILABLE SPACE IN TILES */
    let guessedWords = [[]];
    let availableSpace = 1;

    let word = "dairy"; /* debugging purposes. can be removed later */
    let guessedWordCount = 0; // This is used to save the number of guesses. When it reaches 6, game over.

    const keys = document.querySelectorAll('.keyboard-row button'); // Relates to keyboard buttons and their inputs

    /* VARIABLES FOR COLOUR MODE BUTTONS. USED TO TRIGGER ACTIONS */
    var colorMode = document.getElementById('colorMode');
    var colorBlind = document.getElementById('colorBlind');

    /* TILE COLORS. SET TO STANDARD THEME INITIALLY, BUT CHANGING THE MODE UPDATES THESE COLOURS */
    // CURRENTLY IT DOESN'T REFRESH THE COLOURS IF THEY'VE ALREADY BEEN RETURNED TO THE GAME BOARD
    // WILL HAVE TO SEE IF WE CAN FIX THAT, BUT I DON'T THINK IT'S POSSIBLE
    let correctLetterColor = "rgb(181, 159, 59)";
    let correctPositionColor = "rgb(83, 141, 78)";
    let incorrectLetterColor = "rgb(58, 58, 60)";

    /* COLOUR BLIND */
    var colorBlindMode = false;

    // BASIC FUNCTION TO CHECK THE GUESSED WORDS
    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1]
    }

    // COMES INTO PLAY WHEN THE USER PLAYS A WORD (I.E. PRESSES ENTER)
    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr()

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    // THIS FUNCTION DETERMINES THE TILE COLOUR BASED ON IF THE LETTER IS IN THE CORRECT POSITION, INCORRECT POSITION, OR ENTIRELY WRONG
    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        // Partially tutorial, I modified it so the colours are variables which changes based on the scheme
        if (!isCorrectLetter) {
            //return "rgb(58, 58, 60)";
            return incorrectLetterColor;
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            //return "rgb(83, 141, 78)";
            return correctPositionColor;
        }

        //return "rgb(181, 159, 59)";
        return correctLetterColor;
    }

    // THIS IS WHAT HAPPENS WHEN A USER SUBMITS A WORD
    /*
        Checks if the word is five letters
        And determines the positioning of the letters and their correctness
        Outputs the word to the board
    */
    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join('');

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId)
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;

            }, interval * index);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
            window.alert("Great job");
            winLose = 'win';
        }

        if (guessedWords.length === 6) {
            window.alert('HAHAHA. You lost, idiot. The word was ' + word); // Ignore this humour, will be removed.
            winLose = 'lose';
        }

        guessedWords.push([]);
    }

    /* DRAW SQUARES FUNCTION */
    // VERY SIMPLE, RUNS A LOOP THAT DRAWS THE TILES
    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate_animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    // This is what runs when the user presses the delete button to delete a word
    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1;
    }

    /* KEY INPUT LOOP */
    // Essentially this handles when the user presses a keyboard button
    // And outputs the letter or runs a function for "Enter" or "Delete"
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            /* SUBMIT WORD */
            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            /* DELETE LETTER */
            if (letter === 'del') {
                handleDeleteLetter();
                return;
            }

            console.log(letter); /* DEBUGGING PURPOSES. CAN BE REMOVED */

            // Updates the guessed words array so the game knows how many letters have been played
            updateGuessedWords(letter);
        }
    }

/* -------------------------------------- THIS IS MY ORIGINAL WORK FROM THIS POINT FORWARD. -------------------------------------- */
    /* CHANGE COLOR MODE */
    function changeColorMode() {
        /*
            This will change from dark to light mode.
            Changes the background colour
            Changes the text colour
            And updates the button
            Just a test function for now. Will need to implement a more aesthetically pleasing method in a menu or something
        */

        var bg = document.getElementById('container');

        if (bg.style.backgroundColor=="rgb(0, 0, 0)") {
            /* CHANGE TO LIGHT MODE */
            bg.style.backgroundColor="#FFFFFF"; // Change back colour
            document.getElementsByClassName("title")[0].style.color = "black";
            document.getElementsByClassName("message")[0].style.color = "black";
            colorMode.textContent = "Change to Dark Mode"; // Change button text
        }
        else {
            /* CHANGE TO DARK MODE */
            bg.style.backgroundColor="#000000";
            document.getElementsByClassName("title")[0].style.color = "gainsboro";
            document.getElementsByClassName("message")[0].style.color = "gainsboro";
            colorMode.textContent = "Change to Light Mode";
        }
    }

    // If the user presses the change colour mode button, it runs this function
    colorMode.addEventListener('click', function(event) {
        changeColorMode();
    });

    /* COLOUR BLIND SCHEME */
    function setColorBlind() {

        /* Change to Colour Blind */
        colorBlindMode = true; // Set colour blind mode
        // Change tile colours
        correctPositionColor = "rgb(244, 119, 55)";
        correctLetterColor = "rgb(132, 191, 249)";
        // Hides the button so they can't change the mode unless they refresh
        colorBlind.style.visibility = 'hidden';

        alert("Colour Blind scheme has been set. Refresh browser to return to standard colour scheme");
    }

    // If a user presses the colour blind mode button, it runs this function
    colorBlind.addEventListener('click', function(event) {
        setColorBlind();
    });

    /* DETERMINE IF THEY CAN PLAY TODAY */
    function canYouPlay() {
        // If they haven't played today
        if (completeToday === false) {
            alert("Welcome to Wordle");
        }
        else {
            // If they have played today, it'll alert them and hide the keyboard so they can't play.
            // I tried to make it so the keyboard stays but the buttons stay unclickble, but it didn't work
            alert("You've already played today's Wordle. Please come back tomorrow");
            
            // Grab the content for the message and keyboard
            var keyboardContainer = document.getElementById("keyboard-container");
            var alertMessage = document.getElementById("message");
            
            // Disable keyboard and send an alert
            keyboardContainer.style.visibility = 'hidden';
            alertMessage.innerText = "You've already played today. Come back tomorrow!";
        }
    }
})