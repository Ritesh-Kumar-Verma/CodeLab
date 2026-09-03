import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { codeAPI } from "../api/api";

export default function CodeEditor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("print('Hello CodeForge')");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Controls 70/30 vs 50/50 side-by-side layout
  const [isOldLayout, setIsOldLayout] = useState(false); // Controls modern vs old (stacked) UI layout

  const codeRef = useRef(null);
  const outputRef = useRef(null);

  const handleRun = async () => {
    // If in side-by-side view, expand output to 50%
    if (!isOldLayout) {
      setIsExpanded(true);
    }

    try {
      const res = await codeAPI.run(code, language);

      if (res.data.status === "error") {
        setIsError(true);
        setOutput(res.data.error);
      } else {
        setIsError(false);
        setOutput(res.data.output);
      }
    } catch (err) {
      console.log(err)
      setIsError(true);
      setOutput("An error occurred while executing the code.");
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
      {/* Control Buttons Bar */}
      <div className="flex gap-3 mb-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded transition-colors"
          onClick={handleRun}
        >
          Run
        </button>
        {/* Language Selector */}
<div className="flex items-center gap-3 mb-3">
  <label className="text-white font-medium">Language:</label>

  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
  >
    <option value="python">Python</option>
    <option value="c">C</option>
  </select>
</div>

        {/* Toggle between Old (Stacked) and New (Side-by-Side) UI */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          onClick={() => setIsOldLayout(!isOldLayout)}
        >
          {isOldLayout ? "Switch to Split Layout" : "Switch to Old Stacked Layout"}
        </button>

        {/* Old Layout helper scroll button */}
        {isOldLayout && (
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            onClick={scrollToOutput}
          >
            Go to Output
          </button>
        )}
      </div>

      {/* RENDER OLD STACKED LAYOUT */}
      {isOldLayout ? (
        <>
          {/* Code section */}
          <div ref={codeRef}>
            <Editor
              height="70vh"
              language={language}
              defaultValue={`print("Hello CodeForge")`}
              theme="vs-dark"
              onChange={(code) => setCode(code || "")}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
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

          {/* Output section */}
          <div
            ref={outputRef}
            className="mt-4 bg-gray-950 rounded-lg border border-gray-700"
          >
            <div className="px-4 py-2 border-b border-gray-700 text-gray-300 font-semibold flex justify-between items-center">
              <span>Output</span>

              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
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
      ) : (
        /* RENDER NEW SIDE-BY-SIDE SPLIT LAYOUT */
        <div className="w-full flex gap-4 transition-all duration-300 ease-in-out">
          {/* Code Editor Container */}
          <div
            className={`${
              isExpanded ? "w-1/2" : "w-[70%]"
            } transition-all duration-300 flex flex-col`}
          >
            <Editor
              height="70vh"
              language={language}
              defaultValue={``}
              theme="vs-dark"
              onChange={(code) => setCode(code || "")}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
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

          {/* Output Container */}
          <div
            className={`${
              isExpanded ? "w-1/2" : "w-[30%]"
            } transition-all duration-300 flex flex-col bg-gray-950 rounded-lg border border-gray-700 h-[70vh]`}
          >
            <div className="px-4 py-3 border-b border-gray-700 text-gray-300 font-semibold flex justify-between items-center">
              <span>Output</span>

              {isExpanded && (
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded transition-colors"
                  onClick={() => setIsExpanded(false)}
                >
                  Back to Code (70/30)
                </button>
              )}
            </div>

            <pre
              className={`p-4 font-mono text-sm whitespace-pre-wrap overflow-auto flex-1 ${
                isError ? "text-red-400" : "text-green-400"
              }`}
            >
              {output || "// Output will appear here after running..."}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}