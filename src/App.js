import React, { useState, useEffect } from "react";
import SubjectScreen from "./screens/SubjectScreen";
import TopicScreen from "./screens/TopicScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultsScreen from "./screens/ResultsScreen";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function App() {
  const [screen, setScreen] = useState("subject");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/subjects`)
      .then((r) => r.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch(() => {
        setError("לא ניתן להתחבר לשרת. ודא שהשרת פועל.");
        setLoading(false);
      });
  }, []);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedTopics([]);
    setScreen("topic");
  };

  const handleStartQuiz = async (topics) => {
    setSelectedTopics(topics);
    setLoading(true);
    try {
      const allQuestions = [];
      for (const topic of topics) {
        // Use slug (English) for URL — avoids encoding issues with Hebrew paths
        const res = await fetch(
          `${API_BASE}/api/questions/${selectedSubject.slug}/${topic.file}`
        );
        const data = await res.json();
        if (data.questions) {
          allQuestions.push(...data.questions.map((q) => ({ ...q, topicName: data.topic })));
        }
      }
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setResults([]);
      setScreen("quiz");
    } catch {
      setError("שגיאה בטעינת השאלות.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (quizResults) => {
    setResults(quizResults);
    setScreen("results");
  };

  const handleRestart = () => {
    setScreen("subject");
    setSelectedSubject(null);
    setSelectedTopics([]);
    setQuestions([]);
    setResults([]);
  };

  if (loading && screen === "subject") {
    return (
      <div className="app-loading">
        <div className="loader" />
        <p>טוען נושאים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </div>
    );
  }

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <div className="header-inner">
          <button className="home-btn" onClick={handleRestart}>
            <span>📚</span>
            <span>חזרה לבגרות</span>
          </button>
          <div className="breadcrumb">
            {selectedSubject && screen !== "subject" && (
              <span className="crumb clickable" onClick={() => setScreen("topic")}>
                {selectedSubject.name}
              </span>
            )}
            {screen === "quiz" && (
              <>
                <span className="crumb-sep">›</span>
                <span className="crumb">{selectedTopics.map((t) => t.displayName).join(", ")}</span>
              </>
            )}
            {screen === "results" && (
              <>
                <span className="crumb-sep">›</span>
                <span className="crumb">סיכום</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {screen === "subject" && (
          <SubjectScreen subjects={subjects} onSelect={handleSubjectSelect} />
        )}
        {screen === "topic" && (
          <TopicScreen
            subject={selectedSubject}
            onStart={handleStartQuiz}
            onBack={() => setScreen("subject")}
            loading={loading}
          />
        )}
        {screen === "quiz" && (
          <QuizScreen questions={questions} onComplete={handleQuizComplete} />
        )}
        {screen === "results" && (
          <ResultsScreen
            results={results}
            questions={questions}
            onRestart={handleRestart}
            onRetry={() => { setResults([]); setScreen("quiz"); }}
            onBackToTopics={() => setScreen("topic")}
          />
        )}
      </main>
    </div>
  );
}
