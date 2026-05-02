import React, { useState } from "react";

export default function TopicScreen({ subject, onStart, onBack, loading }) {
  const [selected, setSelected] = useState([]);

  const toggle = (topic) => {
    setSelected((prev) =>
      prev.find((t) => t.file === topic.file)
        ? prev.filter((t) => t.file !== topic.file)
        : [...prev, topic]
    );
  };

  const selectAll = () => setSelected([...subject.topics]);
  const clearAll = () => setSelected([]);

  const totalQ = selected.reduce((acc, t) => acc + t.questionCount, 0);
  const allSelected = selected.length === subject.topics.length;

  return (
    <div className="screen-enter">
      <h1 className="screen-title">{subject.name}</h1>
      <p className="screen-subtitle">בחר נושא אחד או יותר לתרגול</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          className="btn-ghost"
          onClick={allSelected ? clearAll : selectAll}
          style={{ fontSize: 13, padding: "8px 14px" }}
        >
          {allSelected ? "בטל הכל" : "בחר הכל"}
        </button>
      </div>

      <div className="topic-list">
        {subject.topics.map((topic) => {
          const isSelected = !!selected.find((t) => t.file === topic.file);
          return (
            <div
              key={topic.file}
              className={`topic-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggle(topic)}
            >
              <div className="topic-check" />
              <div className="topic-info">
                <div className="topic-name">{topic.displayName}</div>
                <div className="topic-count">{topic.questionCount} שאלות</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button
          className="btn-primary"
          disabled={selected.length === 0 || loading}
          onClick={() => onStart(selected)}
        >
          {loading ? (
            <span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} />
          ) : (
            <>
              <span>התחל בחינה</span>
              {selected.length > 0 && (
                <span style={{ opacity: 0.8, fontSize: 13 }}>({totalQ} שאלות)</span>
              )}
            </>
          )}
        </button>
        <button className="btn-secondary" onClick={onBack}>חזרה</button>
      </div>
    </div>
  );
}
