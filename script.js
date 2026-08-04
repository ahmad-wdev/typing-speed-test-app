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

let currentIndex = 0;
let currentLevel = "hard";
let currentMode = "timed";
let hasTimeStarted = false;
let startTime;
let timerStop;

// this fucntion reset the values of spans in second row.
// and this this function called in startTest fucntion.
function resetStates() {
  let wpmSpan = document.querySelector(".wpm-span");
  let aSpan = document.querySelector(".a-span");
  let tSpan = document.querySelector(".T-span");
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
      //   first added hardPassage for test then replaced to dynamically change with different level btns.
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
  // event.key.length===1 handles only typing keys to use that are on char long. which includes alpha-numeric and punctuation keys.
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
          let elapsedSeconds = Math.floor(elapsedTime / 1000);
          if (currentMode === "timed") {
            let remainingTime;
            remainingTime = 60 - elapsedSeconds;
            if (remainingTime === 0 || currentIndex === spans.length) {
              clearInterval(timerStop);
            }
          } else {
            if (currentMode === "passage") {
              if (currentIndex === spans.length) clearInterval(timerStop);
            }
          }
        }, 1000);
      }
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
// eventlisteners for level buttons.
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
