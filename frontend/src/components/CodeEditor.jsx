import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

const defaultCode = `
// Write JavaScript here
console.log("Hello World");

let a = 10;
let b = 20;
console.log("Sum:", a + b);
`;

export default function CodeEditor() {
  const [code, setCode] = useState(defaultCode);
  const iframeRef = useRef(null);

  const runCode = () => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <body>
          <pre id="output"></pre>
          <script>
            const output = document.getElementById("output");

            console.log = (...args) => {
              output.innerHTML += args.join(" ") + "\\n";
            };

            try {
              ${code}
            } catch (err) {
              output.innerHTML += "Error: " + err.message;
            }
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Editor */}
      <div style={{ width: "60%" }}>
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
        <button onClick={runCode} style={{ padding: "10px", width: "100%" }}>
          ▶ Run Code
        </button>
      </div>

      {/* Output */}
      <div style={{ width: "40%", borderLeft: "2px solid #333" }}>
        <iframe
          ref={iframeRef}
          title="output"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </div>
  );
}
