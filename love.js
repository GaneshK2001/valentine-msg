function go(p){
  document.body.style.opacity=0;
  setTimeout(()=> location=p, 400);
}

// TELEGRAM CONFIG
// Quick option (client-side): token/chat in this file (insecure). Prefer the forwarder below.
const TELEGRAM_BOT_TOKEN = "8230672336:AAGup5na3K2R7VMxdNhq0S0Epn-QOTcbM0M"; // already present
const TELEGRAM_CHAT_ID = "997953927"; // already present

// Forwarder URL: set to your running server (example: http://localhost:3000)
// If empty, the client will send directly to Telegram using the token above.
const FORWARDER_URL = "";

// floating hearts
setInterval(()=>{
  const h=document.createElement("div");
  h.className="heart";
  h.innerHTML="❤";

  h.style.left=Math.random()*100+"vw";
  h.style.fontSize=12+Math.random()*16+"px";
  h.style.animationDuration=6+Math.random()*5+"s";

  document.body.appendChild(h);
  setTimeout(()=>h.remove(),11000);
},300);

// naughty NO button
const no=document.getElementById("no");
if(no){
 no.addEventListener("mouseover",()=>{
  no.style.position="absolute";
  no.style.left=Math.random()*80+"%";
  no.style.top=Math.random()*80+"%";
 });
}

// YES button: play animation and only navigate after it finishes
const yes=document.getElementById("yes");
if(yes){
  yes.addEventListener('click', (e)=>{
    if(yes.classList.contains('clicked')) return;
    yes.classList.add('clicked');

    // create a burst of small hearts from button center
    const rect = yes.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    for(let i=0;i<8;i++){
      const h=document.createElement('div');
      h.className='burst-heart';
      h.innerHTML='❤';
      // random offset and slight horizontal spread
      const spread = (Math.random()-0.5)*120;
      h.style.left=(centerX + spread)+'px';
      h.style.top=(centerY + (Math.random()*20-10))+'px';
      h.style.fontSize=(10+Math.random()*18)+'px';
      h.style.opacity=1;
      document.body.appendChild(h);
      setTimeout(()=>h.remove(),1100);
    }

    // wait for button animation to end, then navigate
    const onAnimEnd = ()=>{
      yes.removeEventListener('animationend', onAnimEnd);
      go('gallery.html');
    };
    yes.addEventListener('animationend', onAnimEnd);
  });
}

// Gallery image romance: hover is CSS, click plays animation then opens modal full-view
function setupGalleryImages(){
  const imgs = document.querySelectorAll('.rom-img');
  const modal = document.getElementById('img-modal');
  const modalImg = document.getElementById('img-modal-img');
  const modalClose = document.getElementById('img-modal-close');

  if(!imgs || imgs.length===0) return;

  imgs.forEach(img=>{
    img.addEventListener('click', (e)=>{
      if(img.classList.contains('rom-animate')) return;
      img.classList.add('rom-animate');

      // spawn localized hearts
      const rect = img.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      for(let i=0;i<6;i++){
        const h=document.createElement('div');
        h.className='burst-heart';
        h.innerHTML='❤';
        const spread = (Math.random()-0.5)*140;
        h.style.left=(cx + spread)+'px';
        h.style.top=(cy + (Math.random()*30-15))+'px';
        h.style.fontSize=(10+Math.random()*20)+'px';
        document.body.appendChild(h);
        setTimeout(()=>h.remove(),1200);
      }

      const onEnd = ()=>{
        img.removeEventListener('animationend', onEnd);
        // open modal with full image
        if(modal && modalImg){
          modalImg.src = img.src;
          modal.classList.add('show');
          modal.setAttribute('aria-hidden','false');
        }
        // cleanup animation class after a short delay so image returns to normal when modal closed
        setTimeout(()=> img.classList.remove('rom-animate'), 400);
      };
      img.addEventListener('animationend', onEnd);
    });
  });

  function closeModal(){
    if(!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    if(modalImg) modalImg.src = '';
  }
  // enhance close button: hover -> about-to-break, click -> break animation then close
  if(modalClose){
    let breaking = false;
    modalClose.addEventListener('mouseenter', ()=> modalClose.classList.add('about-to-break'));
    modalClose.addEventListener('mouseleave', ()=> modalClose.classList.remove('about-to-break'));
    modalClose.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      if(breaking) return;
      breaking = true;
      modalClose.classList.remove('about-to-break');
      modalClose.classList.add('broken');
      // give broken animation time (matches CSS transition ~450ms)
      setTimeout(()=>{
        // close modal after break animation
        closeModal();
        // reset button state for next open
        modalClose.classList.remove('broken');
        breaking = false;
      }, 520);
    });
  }
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
}

// run setup once DOM is ready
function initAll(){
  try{ setupGalleryImages(); }catch(e){console.warn(e)}
  try{ setupStoryQuiz(); }catch(e){console.warn(e)}
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initAll);
else initAll();

// story quiz: allow sending answers to Telegram
function setupStoryQuiz(){
  const cards = document.querySelectorAll('.story-card');
  if(!cards || cards.length===0) return;

  cards.forEach(card=>{
    // input is revealed by clicking the card (handled below)

    // also open when clicking the card itself (unless clicking controls)
    card.addEventListener('click', (e)=>{
      // ignore clicks on controls (send button, input)
      if(e.target.closest('.send-answer') || e.target.closest('.answer-row')) return;
      // close other open cards so only one is expanded
      document.querySelectorAll('.story-card.active').forEach(c=>{ if(c!==card) c.classList.remove('active'); });
      if(!card.classList.contains('active')){
        card.classList.add('active');
        const inp = card.querySelector('.answer-input'); if(inp) inp.focus();
      }
    });
    const btn = card.querySelector('.send-answer');
    const input = card.querySelector('.answer-input');
    const qel = card.querySelector('.question');
    const question = qel ? qel.textContent.trim() : 'Question';

    if(!btn || !input) return;

    // (no blur collapse) — the card will collapse only after clicking Send

    btn.addEventListener('click', async ()=>{
      const answer = input.value.trim();
      if(!answer){ input.focus(); return; }

      btn.disabled = true; btn.textContent='Sending…';

      const now = new Date();
      const ts = now.toLocaleString();
      const pageTitle = document.title || location.pathname;
      const pageUrl = location.href;
      const msg = `Page: ${pageTitle} (${pageUrl})\nQuestion: ${question}\nAnswer: ${answer}\nTime: ${ts}`;

      // If a forwarder URL is configured, post to it (keeps token server-side)
      if(FORWARDER_URL){
        try{
          const res = await fetch(`${FORWARDER_URL.replace(/\/$/, '')}/send`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ pageTitle, pageUrl, question, answer, time: ts })
          });
          const data = await res.json();
          if(data && data.ok){ btn.textContent='Sent'; setTimeout(()=>{ btn.textContent='Send'; input.value=''; btn.disabled=false; card.classList.remove('active'); },1200); }
          else { console.error('forwarder error', data); btn.textContent='Error'; setTimeout(()=>{ btn.textContent='Send'; btn.disabled=false; card.classList.remove('active'); },1200); }
        }catch(err){ console.error(err); btn.textContent='Error'; setTimeout(()=>{ btn.textContent='Send'; btn.disabled=false; },1200); }
        return;
      }

      // Fallback: send directly from client if token/chat are present (insecure)
      if(!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID){
        try{ await navigator.clipboard.writeText(msg); }catch(e){}
        btn.textContent = 'Copied';
        setTimeout(()=>{ btn.textContent='Send'; btn.disabled=false; input.value=''; card.classList.remove('active'); },1400);
        return;
      }

      try{
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg })
        });
        const data = await res.json();
        if(data && data.ok){ btn.textContent='Sent'; setTimeout(()=>{ btn.textContent='Send'; input.value=''; btn.disabled=false; card.classList.remove('active'); },1200); }
        else { console.error('tg error', data); btn.textContent='Error'; setTimeout(()=>{ btn.textContent='Send'; btn.disabled=false; card.classList.remove('active'); },1200); }
      }catch(err){ console.error(err); btn.textContent='Error'; setTimeout(()=>{ btn.textContent='Send'; btn.disabled=false; },1200); }
      // ensure collapse after errors as well
      try{ setTimeout(()=>{ card.classList.remove('active'); },1500); }catch(e){}
    });
  });
}
