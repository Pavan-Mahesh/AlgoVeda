import { db } from "./firebase.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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

export const levels = [
  {
    level: 1,
    name: "Pattern Recognition",
  },
  {
    level: 2,
    name: "Math Puzzle",
  },
  {
    level: 3,
    name: "Error Detection",
  },
  {
    level: 4,
    name: "Code Completion",
  },
  {
    level: 5,
    name: "Technical Riddles",
  },
  {
    level: 6,
    name: "Guess the Output",
  },
  {
    level: 7,
    name: "Competivie Programming",
  },
];

const colors = {
  notAnswered: "linear-gradient(135deg, #e7410c, #9b1606)",
  answered: "linear-gradient(135deg, #a8e72c, #55b81c)",
};

const questionsPerLevel = 5;

let allQuestions = [];
let questions = [];

// Actual implementation starts

let userAnswers = new Array(questionsPerLevel).fill("");

let currLevelIdx = JSON.parse(localStorage.getItem("teamStatus")).currLevelIdx;

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
  for (let idx = 0; idx < questionsPerLevel; idx++) {
    if (
      questions[idx].answer.toLowerCase().replaceAll(" ", "") ===
      userAnswers[idx].toLowerCase().replaceAll(" ", "")
    ) {
      correct++;
    }
  }

  if (correct === questionsPerLevel) {
    alert("To the next level");
    currLevelIdx++;
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
  if (currQuestionIdx !== questionsPerLevel - 1) {
    prevQuestionIdx = currQuestionIdx;
    currQuestionIdx++;
    changeQuestion();
  }
}

function saveNextAction() {
  if (answerElem.value) {
    userAnswers[currQuestionIdx] = answerElem.value;
    qaContainer.style.setProperty("--answer-status", "");

    if (currQuestionIdx !== questionsPerLevel - 1) {
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
  nextBtn.disabled = currQuestionIdx === questionsPerLevel - 1;

  qNumberElem.textContent = currQuestionIdx + 1 + ".";
  questionElem.innerHTML = `<pre>${questions[currQuestionIdx].question}</pre>`;
  // questionElem.innerHTML = questions[currQuestionIdx].question;
  answerElem.value = userAnswers[currQuestionIdx];

  saveNextBtn.disabled = true;
  qaContainer.style.setProperty("--answer-status", "");
}

async function changeLevel() {
  // after completing level 6
  if (currLevelIdx === 6) {
    document.querySelector("main.quiz-container").style.display = "none";
    document.querySelector("main.level7").style.display = "";
    return;
  }

  await get(ref(db, "level" + levels[currLevelIdx].level)).then((snapshot) => {
    if (snapshot.exists()) {
      allQuestions = snapshot.val();
    } else {
      console.log("No data found");
    }
  });

  generateRandom();

  levelNumb.textContent = `Level: ${levels[currLevelIdx].level}`;
  levelName.textContent = `${levels[currLevelIdx].name}`;

  navigationBtnList[currQuestionIdx].classList.remove("current-question");

  prevQuestionIdx = null;
  currQuestionIdx = 0;
  changeQuestion();

  navigationBtnList.forEach((btn) => {
    btn.style.background = "#23b2fe";
  });

  userAnswers = new Array(questionsPerLevel).fill("");
  answerElem.value = "";
  submitBtn.disabled = true;
}

function generateRandom() {
  const randNumb = [];

  while (randNumb.length < questionsPerLevel) {
    const rand = Math.floor(Math.random() * allQuestions.length);
    if (!randNumb.includes(rand)) randNumb.push(rand);
  }

  for (let i = 0; i < randNumb.length; i++) {
    questions[i] = allQuestions[randNumb[i]];
  }
}
