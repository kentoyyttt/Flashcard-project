// Initialize flashcards from localStorage or start with an empty array
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

// Font Size Adjustment Logic
const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValue = document.getElementById("fontSizeValue");

// Load saved font size from local storage on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.body.style.fontSize = savedFontSize;
        if (fontSizeSlider) fontSizeSlider.value = parseInt(savedFontSize);
        if (fontSizeValue) fontSizeValue.textContent = savedFontSize;
    }
});

// Listen to the slider's input to adjust the font size dynamically and save it
if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', function() {
        const fontSize = `${fontSizeSlider.value}px`;
        if (fontSizeValue) fontSizeValue.textContent = fontSize;
        document.body.style.fontSize = fontSize;
        localStorage.setItem('fontSize', fontSize);
    });
}

// Utility function to save flashcards to localStorage
function saveFlashcards() {
    try {
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
    } catch (error) {
        console.error("Failed to save flashcards:", error);
    }
}

// Utility function to update the displayed flashcards list
function updateFlashcardList() {
    const flashcardsList = document.getElementById("flashcardsList");
    if (!flashcardsList) return;

    flashcardsList.innerHTML = ""; // Clear the list

    flashcards.forEach((flashcard, index) => {
        const li = document.createElement("li");
        li.textContent = `${flashcard.word} - ${flashcard.meaning}`;

        // Add a remove button for each flashcard
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => removeFlashcard(index));

        li.appendChild(removeBtn);
        flashcardsList.appendChild(li);
    });
}

// Add a new flashcard and save it to localStorage
function addFlashcard(word, meaning) {
    if (!word || !meaning) return;
    flashcards.push({ word, meaning });
    saveFlashcards();
    updateFlashcardList();
}

// Remove a flashcard by index
function removeFlashcard(index) {
    if (index >= 0 && index < flashcards.length) {
        flashcards.splice(index, 1); // Remove only the selected flashcard
        saveFlashcards();
        updateFlashcardList();
    }
}

// Load flashcards on page load
document.addEventListener("DOMContentLoaded", updateFlashcardList);

// Event listener for the flashcard form
const flashcardForm = document.getElementById("flashcardForm");
if (flashcardForm) {
    flashcardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const word = document.getElementById("word").value.trim();
        const meaning = document.getElementById("meaning").value.trim();
        addFlashcard(word, meaning);
        flashcardForm.reset();
    });
}

// Quiz initialization
const startQuizButton = document.getElementById("startQuizButton");
if (startQuizButton) {
    startQuizButton.addEventListener("click", () => {
        if (flashcards.length < 4) {
            alert("Please add at least 4 flashcards to start the quiz.");
            return;
        }
        document.getElementById("flashcardForm").style.display = "none";
        document.getElementById("flashcardsList").style.display = "none";
        document.getElementById("startQuizButton").style.display = "none";
        document.getElementById("quizSection").style.display = "block";
        generateQuiz();
    });
}

// Back to Flashcards button inside the quiz section
const backToFlashcardsButton = document.getElementById("backToFlashcards");
if (backToFlashcardsButton) {
    backToFlashcardsButton.addEventListener("click", () => {
        document.getElementById("quizSection").style.display = "none";
        document.getElementById("flashcardForm").style.display = "block";
        document.getElementById("flashcardsList").style.display = "block";
        document.getElementById("startQuizButton").style.display = "block";
    });
}

// Generate quiz question
function generateQuiz() {
    const correctIndex = Math.floor(Math.random() * flashcards.length);
    const correctFlashcard = flashcards[correctIndex];
    document.getElementById("question").textContent = `What is the meaning of "${correctFlashcard.word}"?`;

    const choices = flashcards
        .filter((_, index) => index !== correctIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    choices.push(correctFlashcard);
    choices.sort(() => 0.5 - Math.random());

    const choicesList = document.getElementById("choices");
    choicesList.innerHTML = ""; // Clear previous choices

    choices.forEach(choice => {
        const li = document.createElement("li");
        li.textContent = choice.meaning;

        // Event to select answer and check correctness
        li.addEventListener("click", () => {
            document.querySelectorAll("#choices li").forEach(item => item.classList.remove("selected"));
            li.classList.add("selected");
            checkAnswer(choice === correctFlashcard, correctFlashcard.meaning);
        });

        choicesList.appendChild(li);
    });
}

// Check user's answer and highlight correct or incorrect answers
function checkAnswer(isCorrect, correctAnswer) {
    const quizMessage = document.getElementById("quizMessage");
    const selectedChoice = document.querySelector(".selected");

    quizMessage.textContent = isCorrect ? "Correct!" : `Incorrect! The correct answer was "${correctAnswer}".`;

    if (isCorrect) {
        selectedChoice.classList.add("correct");
    } else {
        selectedChoice.classList.add("wrong");

        // Highlight the correct answer
        document.querySelectorAll("#choices li").forEach(li => {
            if (li.textContent === correctAnswer) {
                li.classList.add("correct");
            }
        });
    }

    setTimeout(() => {
        quizMessage.textContent = "";
        document.querySelectorAll("#choices li").forEach(li => li.classList.remove("correct", "wrong", "selected"));
        generateQuiz();
    }, 2000);
}
