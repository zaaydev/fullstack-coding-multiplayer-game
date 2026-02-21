import React from "react";

const OutputScreen = ({ code }) => {
  return (
    <iframe
      title="output"
      sandbox="allow-scripts"
      className="w-full max-w-[320px] h-[220px] bg-black rounded-xl border border-zinc-700 shadow-inner"
      srcDoc={`<!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <style>
              body { background: #000; color: #00ff90; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace; padding:12px; margin:0; white-space:pre-wrap; word-break:break-word; font-size:13px; }
            </style>
          </head>
          <body>
            <script>
              try {
                // override console.log to print into the iframe body
                console.log = function(...args) {
                  // join with space so console.log("a", 1) looks natural
                  const text = args.map(a => {
                    try { return typeof a === "object" ? JSON.stringify(a) : String(a); }
                    catch(e) { return String(a); }
                  }).join(" ");
                  document.body.innerHTML += text + "\\n";
                };

                // execute user code below
                ${code}
              } catch (err) {
                document.body.innerHTML += "\\nError: " + (err && err.message ? err.message : String(err));
              }
            </script>
          </body>
        </html>`}
    />
  );
};

export default OutputScreen;
