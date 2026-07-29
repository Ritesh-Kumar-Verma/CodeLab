import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { codeAPI } from "../api/api";

export default function CodeEditor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("print('Hello CodeForge ')");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);

  const codeRef = useRef(null);
  const outputRef = useRef(null);

  const handleRun = async () => {
    const res = await codeAPI.run(code, language);

    if (res.data.status === "error") {
      setIsError(true);
      setOutput(res.data.error);
    } else {
      setIsError(false);
      setOutput(res.data.output);
    }
  };

  const scrollToOutput = () => {
  outputRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const scrollToCode = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <>
      {/* Button to scroll to output */}
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mb-3"
        onClick={scrollToOutput}
      >
        Go to Output
      </button>

      {/* Code section */}
      <div ref={codeRef}>
        <Editor
          height="70vh"
          language={language}
          defaultValue={`print("Hello CodeForge")`}
          theme="vs-dark"
          onChange={(code) => setCode(code)}
          options={{
            fontSize: 16,
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
            guides: {
              indentation: true,
              highlightActiveIndentation: true,
            },
            renderWhitespace: "all",
            renderControlCharacters: true,
            tabSize: 4,
            insertSpaces: true,
          }}
        />
      </div>

      <button
        className="bg-green-400 px-4 py-2 rounded mt-3"
        onClick={handleRun}
      >
        Run
      </button>

      {/* Output section */}
      <div
        ref={outputRef}
        className="mt-4 bg-gray-950 rounded-lg border border-gray-700"
      >
        <div className="px-4 py-2 border-b border-gray-700 text-gray-300 font-semibold flex justify-between items-center">
          <span>Output</span>

          <button
            className="bg-gray-700 text-white px-3 py-1 rounded"
            onClick={scrollToCode}
          >
            Back to Code
          </button>
        </div>

        <pre
          className={`p-4 font-mono whitespace-pre-wrap ${
            isError ? "text-red-400" : "text-green-400"
          }`}
        >
          {output}
        </pre>
      </div>
    </>
  );
}