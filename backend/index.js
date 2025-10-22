const express = require('express');
const cors = require('cors');
const { questions } = require('./questions');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Serve all quiz questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// Submit answers and get score
app.post('/api/submit', (req, res) => {
  const userAnswers = req.body.answers; // { questionId: answer }
  if (!userAnswers) return res.status(400).json({ error: 'Answers required' });

  let score = 0;
  questions.forEach(q => {
    if (userAnswers[q.id] && userAnswers[q.id] === q.correctAnswer) {
      score++;
    }
  });

  res.json({ score, total: questions.length });
});

app.listen(PORT, () => {
  console.log(`Quiz backend running on http://localhost:${PORT}`);
});
