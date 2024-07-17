//global variables
let questions;
let currentQuestionIndex = 0;
let score = 0;


document.addEventListener('DOMContentLoaded', () => {
  loadXML('questions.xml', (xml) => {
    questions = parseXML(xml);
    shuffleArray(questions); //shuffle questions
    loadQuestion();
  });

  //answer check
  document.getElementById('submit-btn').addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
      const answer = parseInt(selectedOption.value);
      if (answer === questions[currentQuestionIndex].answer) {
        score++;
        displayFeedback(true); //display correct
      } else {
        displayFeedback(false);//display incorrect
      }
      document.getElementById('submit-btn').classList.add('hidden');
      document.getElementById('next-btn').classList.remove('hidden');
    } else {
      alert("Please select an option!");
    }
  });

  //next question button
  document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      document.getElementById('submit-btn').classList.remove('hidden');
      document.getElementById('next-btn').classList.add('hidden');
    } else {
      showResult();
    }
  });

  document.getElementById('restart-btn').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    shuffleArray(questions);//shuffles the questions
    document.getElementById('result-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    loadQuestion();
  });
});

//load xml
function loadXML(file, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', file, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseXML);
    }
  };
  xhr.send();
}

//parse xml
function parseXML(xml) {
  const questions = [];
  const questionNodes = xml.getElementsByTagName('question');
  for (let i = 0; i < questionNodes.length; i++) {
    const questionNode = questionNodes[i];
    const text = questionNode.getElementsByTagName('text')[0].textContent;
    const options = Array.from(questionNode.getElementsByTagName('option')).map(node => node.textContent);
    const answer = parseInt(questionNode.getElementsByTagName('answer')[0].textContent);
    questions.push({ text, options, answer });
  }
  return questions;
}

//shuffle questions function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//load xml questions
function loadQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question').innerText = question.text;
  document.getElementById('option1-label').innerText = question.options[0];
  document.getElementById('option2-label').innerText = question.options[1];
  document.getElementById('option3-label').innerText = question.options[2];
  document.getElementById('option4-label').innerText = question.options[3];
  document.querySelectorAll('input[name="option"]').forEach((input, index) => {
    input.checked = false;
    input.value = index;
  });
  document.getElementById('feedback').innerText = '';
}

//show feedback correct/incorrect
function displayFeedback(isCorrect) {
  const feedbackElement = document.getElementById('feedback');
  if (isCorrect) {
    feedbackElement.innerText = 'Correct!';
    feedbackElement.style.color = 'green';
  } else {
    feedbackElement.innerText = `Incorrect! The correct answer was: ${questions[currentQuestionIndex].options[questions[currentQuestionIndex].answer]}`;
    feedbackElement.style.color = 'red';
  }
}

//show result and highscore
function showResult() {
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('result-container').classList.remove('hidden');
  document.getElementById('score').innerText = `${score} / ${questions.length}`;
  const highScore = Math.max(score, parseInt(localStorage.getItem('highScore') || '0'));
  localStorage.setItem('highScore', highScore);
  document.getElementById('high-score').innerText = highScore;
}
