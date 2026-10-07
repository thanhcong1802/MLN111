import {readJson} from '../models/jsonModel.js';

const shuffle = array => [...array].sort(() => Math.random() - 0.5);

export function getQuiz(req, res) {
  const chapter = Number(req.query.chapter) || null;
  const all = readJson('questions.json');
  const filtered = chapter ? all.filter(question => question.chapter === chapter) : all;

  if (filtered.length < 30) {
    return res.status(400).json({ error: `Chương ${chapter} cần ít nhất 30 câu.` });
  }

  const picked = shuffle(filtered).slice(0, 30).map(question => ({
    ...question,
    options: shuffle(question.options)
  }));

  res.json({ chapter, questions: picked });
}

export function submit(req, res) {
  const all = readJson('questions.json');
  const map = new Map(all.map(question => [question.id, question]));
  const answers = req.body.answers || {};
  let score = 0;
  const detail = [];

  for (const [id, value] of Object.entries(answers)) {
    const question = map.get(Number(id));
    if (!question) continue;
    const correct = value === question.answer;
    if (correct) score++;
    detail.push({ id: Number(id), correct, answer: question.answer, explanation: question.explanation });
  }

  res.json({ score, total: Object.keys(answers).length, detail });
}