import "prismjs/themes/prism-tomorrow.css";
import "./App.css";
import Editor from "react-simple-code-editor";
import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup"; // for HTML
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import robot from '../assets/robot.png';

function App() {
  const [code, setCode] = useState(
    `function sum() {
      return 1 + 1;
    }`
  );
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    setIsLoading(true);
    try {
      const response = await axios.post("https://aicodereviewer-api.onrender.com/ai/get-review", {
        code,
        language
      });
      setReview(response.data);
    } catch (error) {
      setReview("Error getting review. Please try again.");
      console.error("Review error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const languageOptions = [
    { value: "javascript", label: "JavaScript", icon: "js" },
    { value: "python", label: "Python", icon: "py" },
    { value: "java", label: "Java", icon: "java" },
    { value: "css", label: "CSS", icon: "css" },
    { value: "markup", label: "HTML", icon: "html" }
  ];

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">
            <span className="code-symbol">   <img src={robot} alt="" /></span>
          </div>
          <h1>CodeSight AI</h1>
        </div>
        <div className="controls">
          <div className="language-selector-wrapper">
            <div className="language-label">Language:</div>
            <div className="select-wrapper">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-selector"
              >
                {languageOptions.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="select-icon">▼</div>
            </div>
          </div>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="content-area">
        <div className="editor-container">
          <div className="editor-header">
            <div className="header-title">
              <div className="language-badge">
                <span className="language-icon">{languageOptions.find(l => l.value === language)?.icon}</span>
                <h2>Code Editor</h2>
              </div>
            </div>
            <div className="editor-actions">
              <button 
                className={`review-button ${isLoading ? "loading" : ""}`}
                onClick={reviewCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="review-icon">✓</span>
                    Review Code
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="editor-wrapper">
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)
              }
              padding={16}
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
                color: "inherit",
                overflow: "auto"
              }}
              className="code-editor"
            />
          </div>
        </div>

        <div className="review-container">
          <div className="review-header">
            <div className="header-title">
              <h2>AI Review</h2>
            </div>
            {review && (
              <button className="copy-button" onClick={() => navigator.clipboard.writeText(review)}>
                <span className="copy-icon">📋</span>
                Copy
              </button>
            )}
          </div>
          <div className="review-content">
            {isLoading ? (
              <div className="loading-animation">
                <div className="loading-pulse">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <p>AI is analyzing your code...</p>
              </div>
            ) : review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <div className="empty-review">
                <div className="empty-review-icon">🔍</div>
                <h3>Ready to Review Your Code</h3>
                <p>Click Review Code to get AI feedback on your code structure, quality, and potential improvements.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>CodeSight AI © {new Date().getFullYear()} - Intelligent Code Review Assistant</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#help">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;