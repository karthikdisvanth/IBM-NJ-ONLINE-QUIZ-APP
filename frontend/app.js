const quizContainer = document.getElementById('quiz');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');

const API_URL = 'http://localhost:3000/api/questions';
const SUBMIT_URL = 'http://localhost:3000/api/submit';

let questions = [];

async function loadQuestions() {
  try {
    const res = await fetch(API_URL);
    questions = await res.json();
    displayQuiz();
  } catch (err) {
    quizContainer.innerHTML = 'Failed to load quiz questions.';
  }
}

function displayQuiz() {
  let output = '';
  questions.forEach((q, index) => {
    output += `<div class="question">
      <p><strong>Q${index + 1}:</strong> ${q.question}</p>
      <div class="options">`;
    q.options.forEach(option => {
      output += `
        <label>
          <input type="radio" name="question${q.id}" value="${option}" />
          ${option}
        </label>
      `;
    });
    output += '</div></div>';
  });
  quizContainer.innerHTML = output;
}

submitBtn.addEventListener('click', async () => {
  const answers = {};
  questions.forEach(q => {
    const selected = document.querySelector(`input[name="question${q.id}"]:checked`);
    if (selected) answers[q.id] = selected.value;
  });

  if (Object.keys(answers).length !== questions.length) {
    alert('Please answer all questions before submitting.');
    return;
  }

  try {
    const res = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    resultDiv.textContent = `You scored ${data.score} out of ${data.total}`;
  } catch (err) {
    resultDiv.textContent = 'Error submitting quiz.';
  }
});

loadQuestions();
