import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode }) => {
  return (
    <div className="w-full h-[520px] rounded-lg overflow-hidden border border-zinc-700">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          wordWrap: "on",
          folding: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
