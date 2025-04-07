const instructionsPopover = document.getElementById("instructions-popover");

const levelNumb = document.querySelector(
  "section.quiz-navigator .current-level #number"
);
const levelName = document.querySelector(
  "section.quiz-navigator .current-level #name"
);

const navigationBtnList = document.querySelectorAll(
  "section.quiz-navigator .navigation-buttons > button"
);

const actionBtns = document.querySelector(
  "section.quiz-navigator .action-buttons"
);
const previousBtn = actionBtns.querySelector("#previous");
const nextBtn = actionBtns.querySelector("#next");
const saveNextBtn = actionBtns.querySelector("#save-next");
const submitBtn = actionBtns.querySelector("#submit");

const quizBody = document.querySelector("section.quiz-body");
const qNumberElem = quizBody.querySelector("#q-number");

const qaContainer = quizBody.querySelector(".q-a-container");
const questionElem = qaContainer.querySelector("#question");
const answerElem = qaContainer.querySelector("#answer");

// some default values

const colors = {
  notAnswered: "linear-gradient(135deg, #e7410c, #9b1606)",
  answered: "linear-gradient(135deg, #a8e72c, #55b81c)",
};

// Actual implementation starts

let userAnswers = new Array(questions.length).fill("");

let currentLevelIdx = 0;

let prevQuestionIdx = null;
let currQuestionIdx = 0;

instructionsPopover.showPopover();
changeLevel();

previousBtn.disabled = true;
saveNextBtn.disabled = true;
submitBtn.disabled = true;

// navigation buttons

navigationBtnList.forEach((navBtn, idx) => {
  navBtn.addEventListener("click", () => {
    if (currQuestionIdx === idx) return;

    prevQuestionIdx = currQuestionIdx;
    currQuestionIdx = idx;
    changeQuestion();
  });
});

// answer elem on change

answerElem.addEventListener("input", () => {
  if (answerElem.value) {
    saveNextBtn.disabled = false;
    qaContainer.style.setProperty("--answer-status", '"(changes not saved)*"');
  } else {
    saveNextBtn.disabled = true;
  }
});

// action buttons

previousBtn.addEventListener("click", () => {
  previousAction();
});

nextBtn.addEventListener("click", () => {
  nextAction();
});

saveNextBtn.addEventListener("click", () => {
  saveNextAction();

  if (!userAnswers.includes("")) {
    submitBtn.disabled = false;
  }
});

submitBtn.addEventListener("click", () => {
  let correct = 0;
  for (let idx = 0; idx < questions.length; idx++) {
    if (
      questions[idx].answer.toLowerCase().trim() ===
      userAnswers[idx].toLowerCase().trim()
    ) {
      correct++;
    }
  }

  console.log(correct);
  if (correct === questions.length) {
    alert("To the next level");
    currentLevelIdx++;
    changeLevel();
  } else {
    alert("All answers should be correct");
  }
});

// changing question function

function previousAction() {
  if (currQuestionIdx !== 0) {
    prevQuestionIdx = currQuestionIdx;
    currQuestionIdx--;
    changeQuestion();
  }
}

function nextAction() {
  if (currQuestionIdx !== questions.length - 1) {
    prevQuestionIdx = currQuestionIdx;
    currQuestionIdx++;
    changeQuestion();
  }
}

function saveNextAction() {
  if (answerElem.value) {
    userAnswers[currQuestionIdx] = answerElem.value;
    qaContainer.style.setProperty("--answer-status", "");

    if (currQuestionIdx !== questions.length - 1) {
      nextAction();
    } else {
      navigationBtnList[currQuestionIdx].style.background = colors.answered;
    }
  }
}

function changeQuestion() {
  if (prevQuestionIdx !== null) {
    navigationBtnList[prevQuestionIdx].classList.remove("current-question");

    navigationBtnList[prevQuestionIdx].style.background =
      colors[userAnswers[prevQuestionIdx] ? "answered" : "notAnswered"];
  }
  navigationBtnList[currQuestionIdx].classList.add("current-question");

  previousBtn.disabled = currQuestionIdx === 0;
  nextBtn.disabled = currQuestionIdx === questions.length - 1;

  qNumberElem.textContent = currQuestionIdx + 1 + ".";
  questionElem.innerHTML = questions[currQuestionIdx].question;
  answerElem.value = userAnswers[currQuestionIdx];

  saveNextBtn.disabled = true;
  qaContainer.style.setProperty("--answer-status", "");
}

function changeLevel() {
  levelNumb.textContent = `Level: ${levels[currentLevelIdx].level}`;
  levelName.textContent = `${levels[currentLevelIdx].name}`;

  navigationBtnList[currQuestionIdx].classList.remove("current-question");

  prevQuestionIdx = null;
  currQuestionIdx = 0;
  changeQuestion();

  navigationBtnList.forEach((btn) => {
    btn.style.background = "#23b2fe";
  });

  userAnswers = new Array(questions.length).fill("");
  answerElem.value = "";
  submitBtn.disabled = true;
}
