import React, { useState } from "react";

const LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];

export default function QuizScreen({ questions, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]);

  const q = questions[currentIdx];
  const isCorrect = selectedOption === q?.correct;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
  };

  const handleNext = () => {
    const newResults = [...results, { questionIdx: currentIdx, selectedOption, correct: isCorrect }];
    setResults(newResults);
    if (currentIdx + 1 >= questions.length) {
      onComplete(newResults);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const handleStop = () => {
    const newResults = answered
      ? [...results, { questionIdx: currentIdx, selectedOption, correct: isCorrect }]
      : results;
    onComplete(newResults);
  };

  if (!q) return null;

  return (
    <div className="screen-enter">
      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-info">
          <span className="quiz-progress-label">התקדמות</span>
          <span className="quiz-progress-fraction">{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentIdx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-topic-badge">{q.topicName}</div>

      <div className="quiz-question-card">
        <div className="quiz-question-text">{q.question}</div>
        <div className="quiz-options">
          {q.options.map((opt, idx) => {
            let cls = "";
            if (answered) {
              if (idx === q.correct) cls = "correct";
              else if (idx === selectedOption) cls = "wrong";
              else cls = "dimmed";
            }
            return (
              <button
                key={idx}
                className={`quiz-option ${cls}`}
                onClick={() => handleSelect(idx)}
                disabled={answered}
              >
                <span className="option-letter">{LETTERS[idx]}</span>
                <span style={{ flex: 1, textAlign: "right" }}>{opt}</span>
                {answered && idx === q.correct && <span className="option-icon">✓</span>}
                {answered && idx === selectedOption && idx !== q.correct && <span className="option-icon">✗</span>}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className={`quiz-feedback ${isCorrect ? "correct" : "wrong"}`}>
          <span>{isCorrect ? "🎉" : "❌"}</span>
          <span>{isCorrect ? "כל הכבוד! תשובה נכונה!" : `התשובה הנכונה: ${q.options[q.correct]}`}</span>
        </div>
      )}

      <div className="quiz-actions">
        {answered && (
          <button className="btn-primary" onClick={handleNext}>
            {currentIdx + 1 >= questions.length ? "סיים בחינה" : "השאלה הבאה →"}
          </button>
        )}
        <button className="btn-ghost" onClick={handleStop}>סיים עכשיו</button>
      </div>
    </div>
  );
}
