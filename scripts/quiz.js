const questions = [
    {
      id: "1",
      question: "This is the question number 1",
      answer: false,
    },
    {
      id: "2",
      question: "This is the question number 2",
      answer: false,
    },
    {
      id: "3",
      question: "This is the question number 3",
      answer: false,
    },
    {
      id: "4",
      question: "This is the question number 4",
      answer: false,
    },
    {
      id: "5",
      question: "This is the question number 5",
      answer: false,
    },
  ];
  
  const colors = {
    notAnswered: "#ff5f5f",
    answered: "#3dbe78",
  };
  
  let prevQuestionIdx = null;
  let currQuestionIdx = 0;
  
  const navigationBtnList = document.querySelectorAll(
    "section.quiz-navigator .navigation-buttons > button"
  );
  
  const quizBody = document.querySelector("section.quiz-body");
  const questionElem = quizBody.querySelector("#question");
  const answerElem = quizBody.querySelector("#answer");
  
  navigationBtnList.forEach((navBtn, idx) => {
    navBtn.addEventListener("click", () => {
      if (currQuestionIdx === idx) return;
  
      prevQuestionIdx = currQuestionIdx;
      currQuestionIdx = idx;
      changeQuestion();
    });
  });
  
  changeQuestion();
  
  function changeQuestion() {
    if (prevQuestionIdx !== null) {
      questions[prevQuestionIdx].answer = answerElem.checked;
  
      navigationBtnList[prevQuestionIdx].style.backgroundColor =
        answerElem.checked ? colors.answered : colors.notAnswered;
  
      navigationBtnList[prevQuestionIdx].classList.remove("current-question");
    }
  
    navigationBtnList[currQuestionIdx].classList.add("current-question");
  
    questionElem.textContent = `
      ${questions[currQuestionIdx].id}. ${questions[currQuestionIdx].question}
    `;
  
    answerElem.checked = questions[currQuestionIdx].answer;
  }