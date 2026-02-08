require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BOT = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;

app.post('/send', async (req, res) => {
  if(!BOT || !CHAT) return res.status(400).json({ok:false, error:'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in server env'});
  const {pageTitle, pageUrl, question, answer, time} = req.body || {};
  const text = `Page: ${pageTitle || ''} (${pageUrl || ''})\nQuestion: ${question || ''}\nAnswer: ${answer || ''}\nTime: ${time || ''}`;

  try{
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, text })
    });
    const data = await tgRes.json();
    return res.status(200).json(data);
  }catch(err){
    console.error('forwarder error', err);
    return res.status(500).json({ok:false,error:err.message});
  }
});

app.get('/', (req,res)=> res.send('Telegram forwarder running'));

app.listen(PORT, ()=> console.log(`Forwarder listening on http://localhost:${PORT}`));
