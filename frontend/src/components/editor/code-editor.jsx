import Editor from "@monaco-editor/react";
import { useGameStore } from "../../store/game-store";
import { usePlayerStore } from "../../store/player-auth-store";
import { useState } from "react";
import { useEffect } from "react";
import { socket } from "../../lib/socket-io";

const CodeEditor = ({ code, handleChange }) => {
  



  return (
    <div className="w-full h-[520px] rounded-lg overflow-hidden border border-zinc-700">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => handleChange(value)}
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
