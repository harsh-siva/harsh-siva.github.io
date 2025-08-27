(function () {
  const ENDPOINT = "https://<your-site>.netlify.app/.netlify/functions/chatbot"; // <-- replace

  function sid() {
    const k = "chatbot_session_id";
    let s = localStorage.getItem(k);
    if (!s) { s = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()); localStorage.setItem(k, s); }
    return s;
  }

  async function askGemini(message) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId: sid() })
    });
    if (!res.ok) throw new Error(await res.text());
    const { reply } = await res.json();
    return reply;
  }

  // —— UI ——
  const style = document.createElement('style');
  style.textContent = `
  .cbt-btn{position:fixed;right:16px;bottom:16px;padding:12px 14px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.2);background:#111;color:#fff;cursor:pointer;z-index:9999}
  .cbt-panel{position:fixed;right:16px;bottom:76px;width:320px;max-height:60vh;background:#fff;border:1px solid #ddd;border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;z-index:9999}
  .cbt-head{padding:10px 12px;font-weight:600;border-bottom:1px solid #eee}
  .cbt-log{padding:12px;overflow:auto;flex:1;font-size:.95rem}
  .cbt-msg{margin:6px 0}
  .cbt-msg.me{color:#0a58ca}
  .cbt-foot{display:flex;gap:6px;padding:8px;border-top:1px solid #eee}
  .cbt-foot input{flex:1;padding:8px;border:1px solid #ddd;border-radius:10px}
  .cbt-foot button{padding:8px 10px;border-radius:10px;border:1px solid #111;background:#111;color:#fff}
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'cbt-btn';
  btn.textContent = 'Chat about me';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'cbt-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="cbt-head">Ask about Teja</div>
    <div class="cbt-log" id="cbt-log"></div>
    <div class="cbt-foot">
      <input id="cbt-input" placeholder="Type your question..." />
      <button id="cbt-send">Send</button>
    </div>`;
  document.body.appendChild(panel);

  const log = panel.querySelector('#cbt-log');
  const input = panel.querySelector('#cbt-input');
  const send = panel.querySelector('#cbt-send');

  function addMsg(text, me=false){
    const p=document.createElement('div');
    p.className = 'cbt-msg' + (me?' me':'');
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  btn.onclick = () => {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    input.focus();
  };

  async function sendMsg(){
    const q = (input.value || "").trim();
    if (!q) return;
    addMsg(q, true);
    input.value = "";
    const hold = addMsg("…thinking…");
    try {
      const a = await askGemini(q);
      hold.textContent = a;
    } catch (e) {
      hold.textContent = "Error: " + (e.message || e);
    }
  }

  send.onclick = sendMsg;
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ sendMsg(); }});
})();
