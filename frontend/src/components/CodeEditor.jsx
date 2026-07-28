import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const [language, setLanguage] = useState("python");
  return (
    <>
    <select
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
      </select>
    <Editor
      height="70vh"
      language={language}
      defaultValue={`print("Hello CodeForge")`}
      theme="vs-dark"
      options={{
        fontSize: 16,
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
      }}
      />
      </>
  );
}


