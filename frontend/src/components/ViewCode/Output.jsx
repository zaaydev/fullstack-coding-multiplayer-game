// --- OutputScreen ---
export default function OutputScreen({ code }) {
  const srcDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #07070b;
        color: #00ff90;
        font-family: 'JetBrains Mono','Fira Code',ui-monospace,monospace;
        font-size: 13px;
        padding: 14px 16px;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.65;
        min-height: 100vh;
      }
      .err  { color: #ff5555; }
      .warn { color: #f59e0b; }
      .time { color: #333; font-size: 11px; border-top: 1px solid #131313; margin-top: 10px; padding-top: 8px; }
    </style>
  </head>
  <body>
    <script>
      const fmt = (...args) => args.map(a => {
        try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
        catch(e) { return String(a); }
      }).join(' ');
      console.log   = (...a) => { document.body.innerHTML += '<span>' + fmt(...a) + '\\n</span>'; };
      console.error = (...a) => { document.body.innerHTML += '<span class="err">✖ ' + fmt(...a) + '\\n</span>'; };
      console.warn  = (...a) => { document.body.innerHTML += '<span class="warn">⚠ ' + fmt(...a) + '\\n</span>'; };
      const __t = performance.now();
      try { ${code} }
      catch(e) { document.body.innerHTML += '<span class="err">\\nError: ' + (e&&e.message?e.message:String(e)) + '</span>'; }
      document.body.innerHTML += '<div class="time">⏱ ' + (performance.now()-__t).toFixed(3) + 'ms</div>';
    <\/script>
  </body>
</html>`;

  return (
    <iframe
      key={code}
      title="output"
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      style={{ width: "100%", height: "100%", border: "none", display: "block", background: "#07070b" }}
    />
  );
}