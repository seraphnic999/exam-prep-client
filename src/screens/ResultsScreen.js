import React from "react";

function ScoreRing({ pct }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  let color = "#f87171";
  if (pct >= 80) color = "#34d399";
  else if (pct >= 60) color = "#f0b429";

  return (
    <div className="results-score-ring" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#22263a" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="results-score-number">{Math.round(pct)}%</div>
      <div className="results-score-label">ציון</div>
    </div>
  );
}

function getGradeLabel(pct) {
  if (pct === 100) return { label: "מושלם! 🏆", color: "#34d399" };
  if (pct >= 90) return { label: "מצוין! 🌟", color: "#34d399" };
  if (pct >= 75) return { label: "טוב מאוד 👍", color: "#34d399" };
  if (pct >= 60) return { label: "עובר ✔️", color: "#f0b429" };
  if (pct >= 40) return { label: "צריך תרגול 📖", color: "#f87171" };
  return { label: "המשך להתאמן 💪", color: "#f87171" };
}

export default function ResultsScreen({ results, questions, onRestart, onRetry, onBackToTopics }) {
  const answered = results.length;
  const correct = results.filter((r) => r.correct).length;
  const pct = answered === 0 ? 0 : Math.round((correct / answered) * 100);
  const grade = getGradeLabel(pct);

  return (
    <div className="screen-enter">
      <div className="results-hero">
        <ScoreRing pct={pct} />
        <div className="results-grade" style={{ color: grade.color }}>{grade.label}</div>
        <div className="results-stats">
          <span><strong style={{ color: "#34d399" }}>{correct}</strong> נכון</span>
          <span><strong style={{ color: "#f87171" }}>{answered - correct}</strong> שגוי</span>
          <span><strong>{answered}</strong> שאלות</span>
        </div>
        <div className="results-actions">
          <button className="btn-primary" onClick={onRetry}>נסה שוב 🔄</button>
          <button className="btn-secondary" onClick={onBackToTopics}>בחר נושאים</button>
          <button className="btn-ghost" onClick={onRestart}>תפריט ראשי</button>
        </div>
      </div>

      {answered > 0 && (
        <>
          <div className="results-recap-title">סיכום שאלות</div>
          <div className="recap-list">
            {results.map((r, i) => {
              const q = questions[r.questionIdx];
              if (!q) return null;
              return (
                <div key={i} className={`recap-item ${r.correct ? "correct" : "wrong"}`}>
                  <div className="recap-header">
                    <span className="recap-num">#{i + 1}</span>
                    <span className={`recap-result-badge ${r.correct ? "correct" : "wrong"}`}>
                      {r.correct ? "✓ נכון" : "✗ שגוי"}
                    </span>
                    <span className="recap-topic">{q.topicName}</span>
                  </div>
                  <div className="recap-question">{q.question}</div>
                  <div className="recap-answer">
                    {r.correct ? (
                      <span className="correct-ans">✓ {q.options[q.correct]}</span>
                    ) : (
                      <>
                        <span>תשובתך: </span>
                        <span className="wrong-ans">{q.options[r.selectedOption]}</span>
                        <span> · תשובה נכונה: </span>
                        <span className="correct-ans">{q.options[q.correct]}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
