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

const timedBtn = document.querySelector(".timed");
const passageBtn = document.querySelector(".passage");
let tSpan = document.querySelector(".T-span");
let aSpan = document.querySelector(".a-span");
let wpmSpan = document.querySelector(".wpm-span");

let currentIndex = 0;
let currentLevel = "hard";
let currentMode = "timed";
let hasTimeStarted = false;
let startTime;
let timerStop;

// this fucntion reset the values of spans in second row.
// and this this function called in startTest fucntion.
function resetStates() {
  //   let wpmSpan = document.querySelector(".wpm-span");
  wpmSpan.textContent = 0;
  aSpan.textContent = "0%";
  tSpan.textContent = "0:00";
}
// this function convert the text string into each character enclosed in span.
function spanPassage(text) {
  let spanResult = "";
  for (let char of text) {
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

      let randomPassage = Math.floor(Math.random() * currentPassages.length);
      startedText.innerHTML = spanPassage(currentPassages[randomPassage].text);
      spans = document.querySelectorAll(".started-text span");
    });
}
// this function show started screen and hide the not started screen (the screens are set to hidden in html tags), reset states and load text at the same time when start btn or restart test btn is clicked.
function startTest() {
  notStartedScreen.hidden = true;
  startedScreen.hidden = false;
  resetStates();
  loadRandomPassage();
  currentIndex = 0;
}

// Event listeners for startBtn and RestartBtn. Both using startTest fucntion.
startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", startTest);

// event listener for typing and giving colors to correct and incorrect char.
document.addEventListener("keydown", (event) => {
  // event.key.length===1 handles only typing keys to use that are one char long. which includes alpha-numeric and punctuation keys.
  if (event.key.length === 1) {
    // this "if" statement handle the user's typed char vs existing char.
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
          let elapsedTime = new Date().getTime() - startTime;
          //   converts miliseconds into seconds
          let elapsedSeconds = Math.floor(elapsedTime / 1000);
          if (currentMode === "timed") {
            let remainingTime;
            remainingTime = 60 - elapsedSeconds;

            // timer starts here in time span for timed.
            let formattedTime = remainingTime.toString().padStart(2, "0");
            let displayTime = `0:${formattedTime}`;
            tSpan.textContent = displayTime;

            if (remainingTime === 0 || currentIndex === spans.length) {
              clearInterval(timerStop);
            }
          } else {
            if (currentMode === "passage") {
              // this add and starts Time in Time span for passage active.
              let minutes = Math.floor(elapsedSeconds / 60);
              let remainingSeconds = elapsedSeconds % 60;
              let formattedSeconds = remainingSeconds
                .toString()
                .padStart(2, "0");
              let displayTime = `${minutes}:${formattedSeconds}`;
              tSpan.textContent = displayTime;
              if (currentIndex === spans.length) clearInterval(timerStop);
            }
          }
          // standard 5-letter words
          let correctArray = Array.from(spans).filter((span) =>
            span.classList.contains("correct"),
          );
          let correctCount = correctArray.length;

          let incorrectArray = Array.from(spans).filter((span) =>
            span.classList.contains("incorrect"),
          );
          let incorrectCount = incorrectArray.length;

          let totalCount = correctCount + incorrectCount;
          let standardWords = totalCount / 5;
          let wpm = Math.floor(standardWords / (elapsedSeconds / 60));

          wpmSpan.textContent = wpm;
        }, 1000);
      }

      //  this block is  for accuracy to show percentage of correct characters.
      let correctArray = Array.from(spans).filter((span) =>
        span.classList.contains("correct"),
      );
      let correctCount = correctArray.length;

      let incorrectArray = Array.from(spans).filter((span) =>
        span.classList.contains("incorrect"),
      );
      let incorrectCount = incorrectArray.length;

      let totalCount = correctCount + incorrectCount;
      let correctPercentage = Math.floor((correctCount / totalCount) * 100);
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
