const notStartedScreen = document.querySelector(".blur-screen");
const startedScreen = document.querySelector(".started-screen");
const resultScreen = document.querySelector(".result-screen");
const firstTestScreen = document.querySelector(".first-test-screen");
const personalBestScreen = document.querySelector(".personal-best-screen");
const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");
const startedText = document.querySelector(".started-text");

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
// this fucntion load a random text from data.json. and the function is called in startTest function.
function loadRandomPassage() {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      const hardPassages = data.hard;
      let randomPassage = Math.floor(Math.random() * hardPassages.length);
      startedText.textContent = hardPassages[randomPassage].text;
    });
}
// this function show started screen and hide the not started screen (the screens are set to hidden in html tags), reset states and load text at the same time when start btn or restart test btn is clicked.
function startTest() {
  notStartedScreen.hidden = true;
  startedScreen.hidden = false;
  resetStates();
  loadRandomPassage();
}
// Event listeners for startBtn and RestartBtn. Both using startTest fucntion.
startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", startTest);
