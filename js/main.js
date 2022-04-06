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
    //canYouPlay();
    //initLocalStorage();

    /* 
        
        IDEAS
            - We need a way to save the users settings like what colour mode they prefer and if they use colour blind mode
            - Need a way to save the users game statistics, and if the user is finished, etc
            - Can probably use Local Storage, will need to research into that.

    */

    /* THESE VARIABLES ARE FOR SAVING GUESSED WORDS AND DETERMINING AVAILABLE SPACE IN TILES */
    let guessedWords = [[]];
    let availableSpace = 1;
    let currentWordIndex = 0;

    const words = ["sweet", "dairy", "green", "comma", "rupee"];
    let word = 'dairy'; /* debugging purposes. can be removed later */

    let guessedWordCount = 0; // This is used to save the number of guesses. When it reaches 6, game over.

    const keys = document.querySelectorAll('.keyboard-row button'); // Relates to keyboard buttons and their inputs

    /* VARIABLES FOR COLOUR MODE BUTTONS. USED TO TRIGGER ACTIONS */
    var colorMode = document.getElementById('colorMode');

    /* TILE COLORS. SET TO STANDARD THEME INITIALLY, BUT CHANGING THE MODE UPDATES THESE COLOURS */
    // CURRENTLY IT DOESN'T REFRESH THE COLOURS IF THEY'VE ALREADY BEEN RETURNED TO THE GAME BOARD
    // WILL HAVE TO SEE IF WE CAN FIX THAT, BUT I DON'T THINK IT'S POSSIBLE
    var storedCorrectLetterColor;
    var storedCorrectPositionColor;
    var storedIncorrectLetterColor = "rgb(58, 58, 60)";
    var storedBackgroundColor;
    var storedTextColor;
    initColourScheme();

    //let correctLetterColor = "rgb(181, 159, 59)";
    //let correctPositionColor = "rgb(83, 141, 78)";
    //let incorrectLetterColor = "rgb(58, 58, 60)";

    /* COLOUR BLIND */
    var colorBlindMode = false;

    // INIT COLOUR SCHEME LOCAL STORAGE
    function initColourScheme() {
        storedCorrectLetterColor = localStorage.getItem('correctLetterColor');
        storedCorrectPositionColor = localStorage.getItem('correctPositionColor');
        storedIncorrectLetterColor = localStorage.getItem('incorrectLetterColor');
        storedBackgroundColor = localStorage.getItem('backgroundColor');
        storedTextColor = localStorage.getItem('textColor');
        var bg = document.getElementById('container');

        if (!storedCorrectLetterColor) {
            // DEFAULT TO STANDARD DARK MODE
            setDarkMode();
            localStorage.setItem('correctPositionColor', "rgb(83, 141, 78)");
            localStorage.setItem('correctLetterColor', "rgb(181, 159, 59)");
            localStorage.setItem('incorrectLetterColor', "rgb(58, 58, 60)");
            localStorage.setItem('backgroundColor', "#000000");
            localStorage.setItem('textColor', "gainsboro");
            // TILE COLOURS
            storedCorrectPositionColor = "rgb(83, 141, 78)";
            storedCorrectLetterColor = "rgb(181, 159, 59)";        
            storedIncorrectLetterColor = "rgb(58, 58, 60)";

        }
        else {
            storedCorrectLetterColor = localStorage.getItem('correctLetterColor');
            storedCorrectPositionColor = localStorage.getItem('correctPositionColor');
            storedIncorrectLetterColor = localStorage.getItem('incorrectLetterColor');
            storedBackgroundColor = localStorage.getItem('backgroundColor');
            storedTextColor = localStorage.getItem('textColor');
            bg.style.backgroundColor = storedBackgroundColor;
            document.getElementsByClassName("title")[0].style.color = storedTextColor;
            document.getElementById('schemeBox').style.color = storedTextColor;
            document.getElementById('clrBlindBox').style.color = storedTextColor;
        }
    }

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
            return storedIncorrectLetterColor;
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            //return "rgb(83, 141, 78)";
            return storedCorrectPositionColor;
        }

        //return "rgb(181, 159, 59)";
        return storedCorrectLetterColor;
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
    
    // Experimenting with setting colour modes in local storage

    /* DARK MODE */
    function setDarkMode() {
        var bg = document.getElementById('container');
        bg.style.backgroundColor = "#000000";
        localStorage.setItem('backgroundColor', "#000000");
        localStorage.setItem('textColor', 'gainsboro');
        document.getElementsByClassName("title")[0].style.color = "gainsboro";
        document.getElementById('schemeBox').style.color = "gainsboro";
        document.getElementById('clrBlindBox').style.color = "gainsboro";
        
        // TILE COLOURS
        storedCorrectPositionColor = "rgb(83, 141, 78)";
        storedCorrectLetterColor = "rgb(181, 159, 59)";        
        storedIncorrectLetterColor = "rgb(58, 58, 60)";
        storedBackgroundColor = "#000000";
    }

    /* LIGHT MODE */
    function setLightMode() {
        var bg = document.getElementById('container');
        bg.style.backgroundColor="#FFFFFF"; // Change back colour
        storedBackgroundColor = "#FFFFFF";
        localStorage.setItem('backgroundColor', "#FFFFFF");
        localStorage.setItem('textColor', 'black');
        document.getElementsByClassName("title")[0].style.color = "black";
        document.getElementById('schemeBox').style.color = "black";
        document.getElementById('clrBlindBox').style.color = "black";
    }
    
    /* COLOUR BLIND MODE */
    function colourBlind() {
        localStorage.setItem('correctPositionColor', "rgb(244, 119, 55");
        localStorage.setItem('correctLetterColor', "rgb(131, 191, 249");
        storedCorrectPositionColor = "rgb(244, 119, 55)";
        storedCorrectLetterColor = "rgb(132, 191, 249)";
        storedIncorrectLetterColor = "rgb(58, 58, 60)";
    }

    /* NORMAL VISION MODE (NEED A BETTER WAY TO DESCRIBE THAT) */
    function normalMode() {
        localStorage.setItem('correctPositionColor', "rgb(83, 141, 78)");
        localStorage.setItem('correctLetterColor', "rgb(181, 159, 59)");
        storedCorrectPositionColor = "rgb(83, 141, 78)";
        storedCorrectLetterColor = "rgb(181, 159, 59)";        
        storedIncorrectLetterColor = "rgb(58, 58, 60)";
    }

    /* TRIGGERING COLOUR MODES */
    var scheme = document.querySelector("input[name=scheme]");
    var clrBlind = document.querySelector("input[name=clrBlind]");

    scheme.addEventListener('change', function() {
        if (this.checked) {
            setLightMode();
        }
        else {
            setDarkMode();
        }
    });

    clrBlind.addEventListener('change', function() {
        if (this.checked) {
            colourBlind();
        }
        else {
            normalMode();
        }
    });

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
            localStorage.setItem('backgroundColor', "#FFFFFF");
            localStorage.setItem('textColor', 'black');
            document.getElementsByClassName("title")[0].style.color = "black";
            document.getElementsByClassName("message")[0].style.color = "black";
            colorMode.textContent = "Change Colour Scheme"; // Change button text
            localStorage.setItem('buttonText', 'Change to Dark Mode')
        }
        else {
            /* CHANGE TO DARK MODE */
            bg.style.backgroundColor="#000000";
            localStorage.setItem('backgroundColor', "#000000");
            localStorage.setItem('textColor', 'gainsboro');
            document.getElementsByClassName("title")[0].style.color = "gainsboro";
            document.getElementsByClassName("message")[0].style.color = "gainsboro";
            colorMode.textContent = "Change Colour Scheme";
            localStorage.setItem('buttonText', 'Change to Light Mode')
        }
    }

    

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
            
            // Disable keyboard and send an alert
            var keyboardContainer = document.getElementById("keyboard-container");
            keyboardContainer.style.visibility = 'hidden';
        }
    }
})