import React from "react";

const SUBJECT_EMOJIS = {
  "מדעים": "🔬",
  "היסטוריה": "📜",
  "ביולוגיה": "🧬",
  "כימיה": "⚗️",
  "פיזיקה": "⚡",
  "מתמטיקה": "📐",
  "ספרות": "📖",
  "גיאוגרפיה": "🌍",
  "אנגלית": "🇬🇧",
};

function getEmoji(name) {
  for (const [key, emoji] of Object.entries(SUBJECT_EMOJIS)) {
    if (name.includes(key)) return emoji;
  }
  return "📚";
}

export default function SubjectScreen({ subjects, onSelect }) {
  return (
    <div className="screen-enter">
      <h1 className="screen-title">בחר מקצוע</h1>
      <p className="screen-subtitle">על איזה מקצוע תרצה להתאמן היום?</p>
      <div className="subject-grid">
        {subjects.map((subject) => {
          const totalQ = subject.topics.reduce((acc, t) => acc + t.questionCount, 0);
          return (
            <button
              key={subject.slug}
              className="subject-card"
              onClick={() => onSelect(subject)}
            >
              <div className="subject-emoji">{getEmoji(subject.name)}</div>
              <div className="subject-name">{subject.name}</div>
              <div className="subject-meta">
                {subject.topics.length} נושאים · {totalQ} שאלות
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
