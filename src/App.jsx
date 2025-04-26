import "prismjs/themes/prism-tomorrow.css";
import "./App.css";
import Editor from "react-simple-code-editor";
import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function App() {
  const [code, setCode] = useState(
    `function sum() {
      return 1 + 1;
    }`
  );
  const [review, setReview] = useState("");
  const [editorKey, setEditorKey] = useState(0); // ✅ Force re-render key

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  useEffect(() => {
    // ✅ Whenever height increases due to scrolling, reset key
    setEditorKey((prev) => prev + 1);
  }, [code.length]); // ✅ Check text length change

  async function reviewCode() {
    const response = await axios.post("http://localhost:8000/ai/get-review", {
      code,
    });
    setReview(response.data);
  }

  return (
    <>
     <div className="head">
      <h1 className="headT "> AI CODER REVIEWER</h1>
      </div>
      <main>
     
     
        <div className="left">
          <Editor
            key={editorKey} // ✅ Force re-render on height change
            value={code}
            onValueChange={(newCode) => setCode(newCode)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 18,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "calc(100vh - 3rem)", // ✅ Updated height
              width: "100%",
              backgroundColor: "rgb(0, 4, 4)",
              color: "white",
              overflow: "auto" // ✅ Ensure overflow is handled
            }}
          />
          <div className="review" onClick={reviewCode}>
            Review
          </div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
     
      </main>
    </>
  );
}

export default App;
