import { API_URL } from '../utils/api';
import React, { useEffect, useState } from 'react';
import { BookOpenCheck, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import './quiz.css';

const chapters = [
  { id: 1, name: 'Khái luận triết học & Mác – Lênin', short: 'Triết học' },
  { id: 2, name: 'Chủ nghĩa duy vật biện chứng', short: 'Duy vật biện chứng' },
  { id: 3, name: 'Chủ nghĩa duy vật lịch sử', short: 'Duy vật lịch sử' }
];

export default function Quiz() {
  const [chapter, setChapter] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionPage, setQuestionPage] = useState(0);
  const pageCount = Math.ceil(questions.length / 2);

  const loadQuiz = chapterId => {
    setLoading(true);
    setAnswers({});
    setResult(null);
    setQuestionPage(0);
    fetch(`${API_URL}/api/quiz/random?chapter=${chapterId}`)
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(data => {
        setQuestions(data.questions || []);
        setChapter(chapterId);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadQuiz(1); }, []);

  const submit = async () => {
    const response = await fetch(`${API_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    setResult(await response.json());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answered = Object.keys(answers).length;
  const score = result?.score || 0;

  return (
    <section className="quiz-page">
      <div className="quiz-hero">
        <div className="quiz-hero__copy">
          <span className="quiz-hero__eyebrow"><Sparkles size={14} /> Hệ thống luyện tập</span>
          <h1>Trắc nghiệm<br />kiến thức theo chương</h1>
          <p>Chọn một chương, làm 30 câu ngẫu nhiên và nhận kết quả chi tiết.</p>
        </div>
        <div className="quiz-hero__badge"><BookOpenCheck /><strong>600</strong><span>Câu hỏi</span></div>
      </div>

      <div className="chapter-picker">
        <div className="chapter-picker__heading"><span>Chọn chapter</span><strong>30 câu / lượt</strong></div>
        <div className="chapter-picker__grid">
          {chapters.map(item => (
            <button key={item.id} type="button" className={chapter === item.id ? 'active' : ''} onClick={() => loadQuiz(item.id)}>
              <span>0{item.id}</span><strong>{item.name}</strong><small>{item.short}</small>
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="quiz-result">
          <div><span>Kết quả bài</span><strong>{score}<small>/30</small></strong><p>{score >= 24 ? 'Xuất sắc!' : score >= 16 ? 'Tốt!' : 'Hãy thử lại!'}</p></div>
          <button type="button" onClick={() => loadQuiz(chapter)}><RotateCcw /> Làm đề mới</button>
        </div>
      )}

      {loading ? <div className="quiz-loading">Đang chuẩn bị câu hỏi...</div> : questions.length === 0 ? (
        <div className="quiz-empty">Không có câu hỏi cho chapter này. Vui lòng chọn lại.</div>
      ) : (
        <div className="quiz-grid">
          {questions.slice(questionPage * 2, questionPage * 2 + 2).map((question, index) => (
            <article className="quiz-card" key={question.id}>
              <div className="quiz-card__head"><span>Câu {questionPage * 2 + index + 1}</span><b>{question.chapter}</b></div>
              <h3>{question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === option;
                  return (
                    <label key={option} className={selected ? 'selected' : ''}>
                      <input type="radio" name={`q${question.id}`} checked={selected} onChange={() => setAnswers(current => ({ ...current, [question.id]: option }))} />
                      <b>{String.fromCharCode(65 + optionIndex)}</b>
                      <span>{option}</span>
                      <CheckCircle2 />
                    </label>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="quiz-submitbar">
        <span>Đã làm <strong>{answered}/30</strong> câu</span>
        {!loading && pageCount > 0 && <div className="quiz-pagination" aria-label="Chuyển trang câu hỏi">
          <button type="button" disabled={questionPage === 0} onClick={() => setQuestionPage(page => page - 1)}>← Trước</button>
          <span>{questionPage + 1} / {pageCount}</span>
          <button type="button" disabled={questionPage >= pageCount - 1} onClick={() => setQuestionPage(page => page + 1)}>Tiếp →</button>
        </div>}
        <button type="button" disabled={answered < 30 || loading} onClick={submit}>Nộp bài</button>
      </div>
    </section>
  );
}
