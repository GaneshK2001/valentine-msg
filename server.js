require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
// Telegram integration removed - forwarder only stores messages locally now
const MESSAGES_FILE = process.env.MESSAGES_FILE || 'messages.json';
const SHEET_URL = process.env.G_SHEET_URL || '';
const { URL } = require('url');
const fs = require('fs');

function loadMessages(){
  try{ const raw = fs.readFileSync(MESSAGES_FILE,'utf8'); return JSON.parse(raw||'[]'); }
  catch(e){ return []; }
}

function saveMessages(arr){
  try{ fs.writeFileSync(MESSAGES_FILE, JSON.stringify(arr, null, 2), 'utf8'); }
  catch(e){ console.error('saveMessages error', e); }
}

async function forwardToSheet(sheetUrl, msg){
  try{
    const u = new URL(sheetUrl);
    const payload = JSON.stringify(msg);
    const httpLib = u.protocol === 'https:' ? require('https') : require('http');
    const opts = {
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    return await new Promise((resolve, reject)=>{
      const req = httpLib.request(opts, (res)=>{
        let body = '';
        res.on('data', c=> body += c);
        res.on('end', ()=> resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }catch(err){ console.error('forwardToSheet error', err); return null; }
}

app.post('/send', async (req, res) => {
  const {pageTitle, pageUrl, question, answer, time} = req.body || {};

  // Store the message locally for admin review
  const msg = { pageTitle: pageTitle||'', pageUrl: pageUrl||'', question: question||'', answer: answer||'', time: time||new Date().toISOString() };
  const all = loadMessages();
  all.push(Object.assign({id: Date.now()}, msg));
  saveMessages(all);
  // attempt to forward to Google Sheet webhook if configured (non-blocking)
  if(SHEET_URL){
    forwardToSheet(SHEET_URL, msg).then(r=>{
      console.log('sheet forward result', r && r.status);
    }).catch(e=> console.error('sheet forward failed', e));
  }
  return res.status(200).json({ ok: true, stored: true, count: all.length });
});

// Admin page & API to view stored messages (protected by ?key=ADMIN_KEY)
const ADMIN_KEY = process.env.ADMIN_KEY || 'changeme';
app.get('/admin', (req,res)=>{
  const key = req.query.key || '';
  if(key !== ADMIN_KEY) return res.status(401).send('Unauthorized - provide ?key=ADMIN_KEY');
  const msgs = loadMessages();
  const rows = msgs.slice().reverse().map(m=>{
    return `<div style="padding:12px;border-bottom:1px solid rgba(255,255,255,.06)">
      <div style="font-size:12px;color:#aaa">${m.time} — id:${m.id}</div>
      <div style="margin-top:6px"><strong>Question:</strong> ${escapeHtml(m.question)}</div>
      <div style="margin-top:6px"><strong>Answer:</strong> ${escapeHtml(m.answer)}</div>
      <div style="margin-top:6px;color:#ddd"><em>Page:</em> <a style="color:#ffd1dd" href="${escapeAttr(m.pageUrl)}">${escapeHtml(m.pageTitle)}</a></div>
    </div>`;
  }).join('');
  res.send(`
    <html><head><meta charset="utf-8"><title>Messages</title>
    <style>body{background:#080010;color:#fff;font-family:system-ui,Arial;padding:18px}a{color:#ffd1dd}</style>
    </head><body><h2>Stored messages (${msgs.length})</h2>${rows}</body></html>
  `);
});

app.get('/messages', (req,res)=>{
  const key = req.query.key || '';
  if(key !== ADMIN_KEY) return res.status(401).json({ok:false,error:'Unauthorized'});
  const msgs = loadMessages();
  res.json({ok:true, messages: msgs});
});

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escapeAttr(s){ return (s||'').replace(/"/g,'&quot;'); }

app.get('/', (req,res)=> res.send('Telegram forwarder running'));

app.listen(PORT, ()=> console.log(`Forwarder listening on http://localhost:${PORT}`));
