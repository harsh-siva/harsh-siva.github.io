// assets/js/chatbot.js
(function () {
  // ==== CONFIG ====
  const ENDPOINT = "https://rag-netlify.netlify.app/.netlify/functions/chatbot";

  // If you want to use your own logo file on the floating button,
  // set USE_IMAGE = true and provide IMG_SRC as a root-relative URL (project pages need the repo path).
  // Example project-pages path: "/btvv.github.io/assets/img/chatbot-logo.png"
  const USE_IMAGE = false;
  const IMG_SRC = "/btvv.github.io/assets/img/chatbot-logo.png"; // change if USE_IMAGE = true

  // Inline SVG icon (default). Inherits currentColor → looks perfect on accent background.
 // Inline SVG icon (forced white color)
  const ICON_SVG = `
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" role="img" focusable="false">
      <path d="M4 5.5h12a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-5 4v-4H4a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3Z"
            fill="none" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="11" r="1" fill="currentColor"/>
      <circle cx="12" cy="11" r="1" fill="currentColor"/>
      <circle cx="15" cy="11" r="1" fill="currentColor"/>
    </svg>
  `;


  // ==== SESSION ====
  function sid() {
    const k = "chatbot_session_id";
    let s = localStorage.getItem(k);
    if (!s) { s = (crypto.randomUUID?.() || String(Date.now())); localStorage.setItem(k, s); }
    return s;
  }

  // ==== API ====
  async function askGemini(message, msTimeout = 20000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort("timeout"), msTimeout);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: sid() }),
        signal: ctrl.signal
      });

      console.debug("[chatbot] status:", res.status, res.statusText);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
      }

      // Some hosts return text/plain; try JSON then fallback
      const data = await res.json().catch(async () => {
        const txt = await res.text();
        throw new Error("JSON parse failed. Body: " + txt);
      });

      console.debug("[chatbot] body:", data);

      if (!data || typeof data.reply !== "string") {
        throw new Error("Malformed JSON: missing { reply }");
      }
      return data.reply;
    } finally {
      clearTimeout(t);
    }
  }

  // ==== UI STYLES ====
  const style = document.createElement('style');
  style.textContent = `
  /* Chatbot button */
    .cbt-btn {
    position: fixed;
    left: 16px;
    bottom: 16px;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff;                                /* white background */
    color: var(--accent-color, #268bd2);             /* icon = Hydejack green */
    border: 2px solid var(--accent-color, #268bd2);  /* green ring */
    box-shadow: 0 6px 20px rgba(0,0,0,.15);
    cursor: pointer;
    z-index: 9999;
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }
  .cbt-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0,0,0,.18);
    background: #f7fbff; /* subtle tint */
  }
  .cbt-btn img { width: 26px; height: 26px; display:block; object-fit: contain; }
  .cbt-btn svg { display:block; }

  /* Chatbot panel */
  .cbt-panel {
    position: fixed;
    left: 16px;               /* match button */
    bottom: 76px;
    width: 320px;
    max-height: 60vh;
    background: var(--content-bg, #fff);
    border: 1px solid #ddd;
    border-radius: 14px;
    box-shadow: 0 12px 28px rgba(0,0,0,.18);
    display: none;            /* toggled via JS */
    flex-direction: column;
    overflow: hidden;
    font-family: inherit;
    z-index: 9999;

    /* open animation */
    transform: translateY(12px);
    opacity: 0;
    transition: transform .2s ease, opacity .2s ease;
  }
  .cbt-panel.open {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }

  .cbt-head {
    padding: 10px 12px;
    font-weight: 600;
    background: var(--accent-color, #268bd2);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;  /* space for close button */
    gap: 8px;
  }
  .cbt-head .cbt-head-icon {
    width: 18px; height: 18px; display:block; color:#fff;
  }

  /* Close button — white on green header */
  .cbt-close {
    background: transparent;
    border: none;
    font-size: 20px;
    line-height: 1;
    color: #fff;                     /* high contrast */
    cursor: pointer;
    padding: 0 4px;
    opacity: .9;
  }
  .cbt-close:hover { opacity: 1; }


  .cbt-log {
    padding: 12px;
    overflow-y: auto;
    flex: 1;
    font-size: 0.95rem;
    white-space: pre-wrap;
    background: var(--content-bg, #fff);
  }

  .cbt-msg { margin: 6px 0; }
  .cbt-msg.me { color: var(--accent-color, #268bd2); font-weight: 500; }
  .cbt-msg.err { color: #b00020; font-style: italic; }

  .cbt-foot {
    display: flex;
    gap: 6px;
    padding: 8px;
    border-top: 1px solid #eee;
    background: var(--content-bg, #fff);
  }

  .cbt-foot input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-family: inherit;
  }

  .cbt-foot button {
    padding: 8px 10px;
    border-radius: 10px;
    border: none;
    background: var(--accent-color, #268bd2);
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .cbt-foot button:hover {
    background: var(--accent-color-dark, #1565c0);
  }
  `;
  document.head.appendChild(style);

  // ==== CREATE BUTTON ====
  const btn = document.createElement('button');
  btn.className = 'cbt-btn';
  btn.setAttribute("title", "Chat about me");

  if (USE_IMAGE) {
    btn.innerHTML = `<img src="${IMG_SRC}" alt="Chat" />`;
  } else {
    btn.innerHTML = ICON_SVG;
  }

  document.body.appendChild(btn);

  // ==== CREATE PANEL ====
  const panel = document.createElement('div');
  panel.className = 'cbt-panel';
  panel.innerHTML = `
    <div class="cbt-head">
      <span class="cbt-head-icon">${ICON_SVG}</span>
      <span>Ask about Teja</span>
      <button class="cbt-close" title="Close chat">×</button>
    </div>
    <div class="cbt-log" id="cbt-log"></div>
    <div class="cbt-foot">
      <input id="cbt-input" placeholder="Type your question..." />
      <button id="cbt-send">Send</button>
    </div>`;
  document.body.appendChild(panel);

  const log   = panel.querySelector('#cbt-log');
  const input = panel.querySelector('#cbt-input');
  const send  = panel.querySelector('#cbt-send');
  const closeBtn = panel.querySelector('.cbt-close');
  closeBtn.onclick = () => {
    panel.classList.remove('open');
  };




  // ==== HELPERS ====
  function addMsg(text, cls=""){
    const p = document.createElement('div');
    p.className = 'cbt-msg ' + cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  function openPanel() {
    panel.classList.add('open');
    input.focus();
  }
  function closePanel() {
    panel.classList.remove('open');
  }
  function togglePanel() {
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  }

  // expose global hooks for sidebar launcher
  window.openChat = openPanel;
  window.closeChat = closePanel;

  // Hide floating button if a sidebar launcher exists
  // (Add class="chatbot-sidebar-btn" to your sidebar button as launcher)
  if (document.querySelector('.chatbot-sidebar-btn')) {
    btn.style.display = 'none';
  }

  // ==== EVENTS ====
  btn.onclick = togglePanel;

  async function sendMsg(){
    const q = (input.value || "").trim();
    if (!q) return;
    addMsg(q, "me");
    input.value = "";
    const hold = addMsg("…thinking…");
    try {
      const a = await askGemini(q);
      hold.textContent = a;
    } catch (e) {
      hold.classList.add("err");
      hold.textContent = "Error: " + (e?.message || e);
      console.error("chatbot error:", e);
    }
  }

  send.onclick = sendMsg;
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ sendMsg(); }});
  // allow ESC to close
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && panel.classList.contains('open')) closePanel(); });
})();
