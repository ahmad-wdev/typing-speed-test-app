// Variables declaration
const notStartedScreen = document.querySelector(".blur-screen");
const startedScreen = document.querySelector(".started-screen");
const resultScreen = document.querySelector(".result-screen");
const firstTestScreen = document.querySelector(".first-test-screen");
const personalBestScreen = document.querySelector(".personal-best-screen");
const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");
const startedText = document.querySelector(".started-text");
let spans = document.querySelectorAll(".started-text span");
const easyBtn = document.querySelector(".easy");
const mediumBtn = document.querySelector(".medium");
const hardBtn = document.querySelector(".hard");
const beatScoreBtn = document.querySelectorAll(".beat-score-btn");
const goAgainBtn = document.querySelector(".go-again-btn");
const blurText = document.querySelector(".blur-text");

const timedBtn = document.querySelector(".timed");
const passageBtn = document.querySelector(".passage");
const tSpan = document.querySelector(".T-span");
const aSpan = document.querySelector(".a-span");
const wpmSpan = document.querySelector(".wpm-span");
const secondRow = document.querySelector(".second-row");
const hard2Btn = document.querySelector(".hard-2");
const timed2Btn = document.querySelector(".timed-2");
const menuOne = document.querySelector(".menu-one");
const menuTwo = document.querySelector(".menu-two");

let currentIndex = 0;
let currentLevel = "hard";
let currentMode = "timed";
let hasTimeStarted = false;
let startTime;
let timerStop;
let wpm = 0;
secondRow.hidden = false;
// this fucntion reset the values of spans in second row.
// and this this function called in startTest fucntion.
function resetStates() {
  //   let wpmSpan = document.querySelector(".wpm-span");
  wpmSpan.textContent = 0;
  aSpan.textContent = "0%";
  tSpan.textContent = "0:00";
  hasTimeStarted = false;
  secondRow.hidden = false;
  clearInterval(timerStop);
}
// this function convert the text string (with in the started text) into each character enclosed in span.
function spanPassage(text) {
  let spanResult = "";
  for (const char of text) {
    spanResult += `<span>${char}</span>`;
  }
  return spanResult;
}

// this fucntion load a random text from data.json. and the function is called in startTest function.
function loadRandomPassage() {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      //   const hardPassages = data.hard;

      //   first added hardPassage for test then replaced with currentPassage for dynamically change with different level btns.
      const currentPassages = data[currentLevel];

      const randomPassage = Math.floor(Math.random() * currentPassages.length);
      startedText.innerHTML = spanPassage(currentPassages[randomPassage].text);
      spans = document.querySelectorAll(".started-text span");
    });
}
// this function show started screen and hide the not started screen (the screens are set to hidden in html tags), reset states and load text at the same time when start btn or restart test btn is clicked.
function startTest() {
  notStartedScreen.hidden = true;
  startedScreen.hidden = false;
  aSpan.style.color = " hsl(354, 63%, 57%)";
  tSpan.style.color = " hsl(49, 85%, 70%)";
  resetStates();
  loadRandomPassage();
  currentIndex = 0;
  syncHeaderPersonalBest();
}

// --- LOCAL STORAGE TRACKING BLOCK ---
// Target the text span in header
const headerPersonalBestSpan = document.querySelector(".best-92");

// Function to update the top header display using local storage values
function syncHeaderPersonalBest() {
  const savedBest = localStorage.getItem("personalBest");
  const personalBest = savedBest ? parseInt(savedBest, 10) : 0;

  if (headerPersonalBestSpan) {
    headerPersonalBestSpan.textContent = `${personalBest} WPM`;
  }
}

// Function to handle test completion screens and score comparisons
function handleTestCompletion(currentWpm) {
  const savedBest = localStorage.getItem("personalBest");

  // Hide the typing screen first
  startedScreen.hidden = true;

  // Case 1: First time taking the test (No baseline established yet)
  if (savedBest === null) {
    localStorage.setItem("personalBest", currentWpm);
    // Show "Baseline Established!" screen
    firstTestScreen.hidden = false;
    secondRow.hidden = true;
  }
  // Case 2: Smashed their previous high score
  else if (currentWpm > parseInt(savedBest, 10)) {
    localStorage.setItem("personalBest", currentWpm);
    // Show "High Score Smashed!" screen
    personalBestScreen.hidden = false;
    secondRow.hidden = true;
  }
  // Case 3: Finished, but didn't beat the personal best
  else {
    // Show standard "Test Complete!" screen
    resultScreen.hidden = false; // Show standard "Test Complete!" screen
    secondRow.hidden = true;
  }

  const wpmResult = document.querySelectorAll(".wpm-span-result");
  const wpmResultArray = Array.from(wpmResult);
  wpmResultArray.forEach((element) => {
    element.textContent = currentWpm;
  });
  const accuracyResult = document.querySelectorAll(".a-span-result");
  const accuracyResultArray = Array.from(accuracyResult);

  const correctArray = Array.from(spans).filter((span) =>
    span.classList.contains("correct"),
  );
  const correctCount = correctArray.length;
  const incorrectArray = Array.from(spans).filter((span) =>
    span.classList.contains("incorrect"),
  );
  const incorrectCount = incorrectArray.length;
  const totalCount = correctCount + incorrectCount;
  const currentPercentage = Math.floor((correctCount / totalCount) * 100);
  accuracyResultArray.forEach((element) => {
    element.textContent = `${currentPercentage}%`;
  });

  const charRedResult = document.querySelectorAll(".char-span-red");
  Array.from(charRedResult).forEach((element) => {
    element.textContent = incorrectCount;
  });
  const charCorrectResult = document.querySelectorAll(".char-span-correct");
  Array.from(charCorrectResult).forEach((element) => {
    element.textContent = correctCount;
  });

  // Refresh the header high score display immediately upon finishing
  syncHeaderPersonalBest();
}

// Event listeners for startBtn and RestartBtn. Both using startTest fucntion.
startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", startTest);
blurText.addEventListener("click", startTest);

goAgainBtn.addEventListener("click", () => {
  startTest();
  resultScreen.hidden = true;
});
beatScoreBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    startTest();
    personalBestScreen.hidden = true;
    firstTestScreen.hidden = true;
  });
});

// Event listener for typing and giving colors to correct and incorrect char.
document.addEventListener("keydown", (event) => {
  // event.key.length===1 handles only typing keys to use that are one char long. which includes alpha-numeric and punctuation keys.
  if (event.key.length === 1) {
    // This "if" statement handle the user's typed char vs existing char.
    if (currentIndex < spans.length) {
      if (event.key === spans[currentIndex].textContent) {
        spans[currentIndex].classList.add("correct");
      } else {
        spans[currentIndex].classList.add("incorrect");
      }
      currentIndex++;

      //   this section set timer for timed and passage mode.
      if (!hasTimeStarted) {
        hasTimeStarted = true;
        startTime = new Date().getTime();
        timerStop = setInterval(() => {
          const elapsedTime = new Date().getTime() - startTime;
          //   converts miliseconds into seconds
          let elapsedSeconds = Math.floor(elapsedTime / 1000);
          if (elapsedSeconds === 0) {
            elapsedSeconds = 1;
          }

          const correctArray = Array.from(spans).filter((span) =>
            span.classList.contains("correct"),
          );
          const correctCount = correctArray.length;

          const incorrectArray = Array.from(spans).filter((span) =>
            span.classList.contains("incorrect"),
          );
          const incorrectCount = incorrectArray.length;

          const totalCount = correctCount + incorrectCount;
          const standardWords = totalCount / 5;
          wpm = Math.floor(standardWords / (elapsedSeconds / 60));

          wpmSpan.textContent = wpm;

          if (currentMode === "timed") {
            const remainingTime = 60 - elapsedSeconds;

            // timer starts here in time span for timed.
            const formattedTime = remainingTime.toString().padStart(2, "0");
            const displayTime = `0:${formattedTime}`;
            tSpan.textContent = displayTime;

            if (remainingTime === 0 || currentIndex === spans.length) {
              clearInterval(timerStop);

              handleTestCompletion(wpm);
            }
          } else {
            if (currentMode === "passage") {
              // this add and starts Time in Time span for passage active.
              const minutes = Math.floor(elapsedSeconds / 60);
              const remainingSeconds = elapsedSeconds % 60;
              const formattedSeconds = remainingSeconds
                .toString()
                .padStart(2, "0");
              const displayTime = `${minutes}:${formattedSeconds}`;
              tSpan.textContent = displayTime;
              if (currentIndex === spans.length) {
                clearInterval(timerStop);
                handleTestCompletion(wpm);
              }
            }
          }
        }, 1000);
      }

      //  this block is  for accuracy to show percentage of correct characters.
      const correctArray = Array.from(spans).filter((span) =>
        span.classList.contains("correct"),
      );
      const correctCount = correctArray.length;

      const incorrectArray = Array.from(spans).filter((span) =>
        span.classList.contains("incorrect"),
      );
      const incorrectCount = incorrectArray.length;

      const totalCount = correctCount + incorrectCount;
      const correctPercentage = Math.floor((correctCount / totalCount) * 100);
      aSpan.textContent = `${correctPercentage}%`;
    }
  }

  //   this part handles function of backspace.
  if (event.key === "Backspace" && currentIndex > 0) {
    currentIndex--;
    spans[currentIndex].classList.remove("correct");
    spans[currentIndex].classList.remove("incorrect");
  }
});
//  this section will change levels and remove the active class when a new level btn is selected and will add the active class to selected btn.

function setActiveLevel(selectedButton) {
  easyBtn.classList.remove("active");
  mediumBtn.classList.remove("active");
  hardBtn.classList.remove("active");
  selectedButton.classList.add("active");
}

// eventlisteners for difficulty level buttons.
easyBtn.addEventListener("click", () => {
  currentLevel = "easy";
  setActiveLevel(easyBtn);
});

mediumBtn.addEventListener("click", () => {
  currentLevel = "medium";
  setActiveLevel(mediumBtn);
});
hardBtn.addEventListener("click", () => {
  currentLevel = "hard";
  setActiveLevel(hardBtn);
});

// this section flip mode and sets the active button style.
function setModeActive(selectedbtn) {
  timedBtn.classList.remove("active");
  passageBtn.classList.remove("active");
  selectedbtn.classList.add("active");
}

// Event listeners for Mode buttons
timedBtn.addEventListener("click", () => {
  currentMode = "timed";
  setModeActive(timedBtn);
});

passageBtn.addEventListener("click", () => {
  currentMode = "passage";
  setModeActive(passageBtn);
});

//  Hide and show the hamburger menu.
hard2Btn.addEventListener("click", () => {
  if (menuOne.style.display === "block") {
    menuOne.style.display = "none";
  } else {
    menuOne.style.display = "block";
  }
});

timed2Btn.addEventListener("click", () => {
  if (menuTwo.style.display === "block") {
    menuTwo.style.display = "none";
  } else {
    menuTwo.style.display = "block";
  }
});
// ----- Event Listeners for dropdown hamburger menu.
let difficultyRadio = document.querySelectorAll('input[name="difficulty"]');
const modeRadio = document.querySelectorAll('input[name="mode"]');

// ------Menu one (Hard)-----
difficultyRadio.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    currentLevel = selectedValue;
    if (hard2Btn) {
      const capitalizedLevelValue =
        selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);
      hard2Btn.innerHTML = `${capitalizedLevelValue} <img src="assets/images/icon-down-arrow.svg" alt="arrow" />`;
    }

    //------ To sync menu buttons with desktop buttons.-----
    if (selectedValue === "easy" && easyBtn) easyBtn.click();
    if (selectedValue === "medium" && mediumBtn) mediumBtn.click();
    if (selectedValue === "hard" && hardBtn) hardBtn.click();

    if (menuOne) {
      menuOne.style.display = "none";
    }
  });
});
// ------Menu two (Timed(60s))
modeRadio.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    currentMode = selectedValue;
    if (timed2Btn) {
      if (selectedValue === "timed") {
        const capitalizedModeValue =
          selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);
        timed2Btn.innerHTML = `${capitalizedModeValue}(60s) <img src="assets/images/icon-down-arrow.svg" alt="arrow" />`;
      } else {
        const capitalizedModeValue =
          selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);
        timed2Btn.innerHTML = `${capitalizedModeValue} <img src="assets/images/icon-down-arrow.svg" alt="arrow" />`;
      }
      if (selectedValue === "timed" && timedBtn) timedBtn.click();
      if (selectedValue === "passage" && passageBtn) passageBtn.click();
    }
    menuTwo.style.display = "none";
  });
});
