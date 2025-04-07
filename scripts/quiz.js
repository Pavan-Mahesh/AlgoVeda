const quizBody = document.querySelector("section.quiz-body");
const qNumberElem = quizBody.querySelector("#q-number");
const questionElem = quizBody.querySelector("#question");
const answerElem = quizBody.querySelector("#answer");

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

const questions = [
  {
    id: "1",
    question: `Find the missing number: <br /> 7, 14, 28, 56, ?, 224`,
    answer: "112",
  },
  {
    id: "2",
    question: `Find the next number: <br /> 3, 6, 11, 18, 27, ?`,
    answer: "38",
  },
  {
    id: "3",
    question: `What comes next? <br /> 2, 6, 12, 20, 30, ?`,
    answer: "42",
  },
  {
    id: "4",
    question: `Which number doesn't fit? <br /> 11, 13, 17, 19, 21, 23`,
    answer: "21",
  },
  {
    id: "5",
    question: `Alphanumeric Pattern <br /> Z1, X4, V9, T16, ?`,
    answer: "R25",
  },
];

const userAnswers = new Array(questions.length).fill("");

const colors = {
  notAnswered: "linear-gradient(135deg, #e7410c, #9b1606)",
  answered: "linear-gradient(135deg, #a8e72c, #55b81c)",
};

// Actual implementation starts

let prevQuestionIdx = null;
let currQuestionIdx = 0;

changeQuestion();

// navigation buttons

navigationBtnList.forEach((navBtn, idx) => {
  navBtn.addEventListener("click", () => {
    if (currQuestionIdx === idx) return;

    prevQuestionIdx = currQuestionIdx;
    currQuestionIdx = idx;
    changeQuestion();
  });
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

  qNumberElem.textContent = questions[currQuestionIdx].id + ".";
  questionElem.innerHTML = questions[currQuestionIdx].question;
  answerElem.value = userAnswers[currQuestionIdx];
}
