function go(p) {
  document.body.style.opacity = 0;
  setTimeout(() => location = p, 400);
}

// Forwarder URL: can be overridden by setting `window.FORWARDER_URL` in the page
// The client will POST answers here; server stores messages locally.
const FORWARDER_URL = (typeof window !== 'undefined' && window.FORWARDER_URL) ? window.FORWARDER_URL : "https://kind-eggs-camp.loca.lt";


// floating hearts
setInterval(() => {
  const h = document.createElement("div");
  h.className = "fixed text-[#ff4d6d] animate-[fly_linear_infinite]";
  h.innerHTML = "❤";

  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 12 + Math.random() * 16 + "px";
  h.style.animationDuration = 6 + Math.random() * 5 + "s";

  document.body.appendChild(h);
  setTimeout(() => h.remove(), 11000);
}, 300);

// naughty NO button
const no = document.getElementById("no");
if (no) {
  no.addEventListener("mouseover", () => {
    no.style.position = "absolute";
    no.style.left = Math.random() * 80 + "%";
    no.style.top = Math.random() * 80 + "%";
  });
}

// YES button: play animation and only navigate after it finishes
const yes = document.getElementById("yes");
if (yes) {
  yes.addEventListener('click', (e) => {
    if (yes.classList.contains('clicked')) return;
    yes.classList.add('clicked');
    // Using Tailwind arbitrary variants for animation:
    yes.classList.add('animate-[yesClick_0.85s_cubic-bezier(0.22,0.9,0.29,1)_forwards]', 'pointer-events-none');

    // create a burst of small hearts from button center
    const rect = yes.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i++) {
      const h = document.createElement('div');
      h.className = 'fixed text-[#ff5678] text-sm pointer-events-none animate-[burst_0.9s_cubic-bezier(0.2,0.8,0.2,1)_forwards]';
      h.innerHTML = '❤';
      // random offset and slight horizontal spread
      const spread = (Math.random() - 0.5) * 120;
      h.style.left = (centerX + spread) + 'px';
      h.style.top = (centerY + (Math.random() * 20 - 10)) + 'px';
      h.style.fontSize = (10 + Math.random() * 18) + 'px';
      h.style.opacity = 1;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1100);
    }

    // wait for button animation to end, then navigate
    const onAnimEnd = () => {
      yes.removeEventListener('animationend', onAnimEnd);
      go('gallery.html');
    };
    yes.addEventListener('animationend', onAnimEnd);
  });
}

// Gallery image romance: hover is CSS, click plays animation then opens modal full-view
function setupGalleryImages() {
  const imgs = document.querySelectorAll('.rom-img');
  const modal = document.getElementById('img-modal');
  const modalImg = document.getElementById('img-modal-img');
  const modalClose = document.getElementById('img-modal-close');

  if (!imgs || imgs.length === 0) return;

  imgs.forEach(img => {
    img.addEventListener('click', (e) => {
      if (img.classList.contains('rom-animate')) return;
      img.classList.add('rom-animate');
      // convert to tailwind animation class
      img.classList.add('animate-[romance_0.85s_cubic-bezier(0.22,0.9,0.29,1)_forwards]', 'pointer-events-none');

      // spawn localized hearts
      const rect = img.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 6; i++) {
        const h = document.createElement('div');
        // burst-heart class replacement
        h.className = 'fixed text-[#ff5678] text-sm pointer-events-none animate-[burst_0.95s_cubic-bezier(0.2,0.8,0.2,1)_forwards]';
        h.innerHTML = '❤';
        const spread = (Math.random() - 0.5) * 140;
        h.style.left = (cx + spread) + 'px';
        h.style.top = (cy + (Math.random() * 30 - 15)) + 'px';
        h.style.fontSize = (10 + Math.random() * 20) + 'px';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1200);
      }

      const onEnd = () => {
        img.removeEventListener('animationend', onEnd);
        // open modal with full image
        if (modal && modalImg) {
          modalImg.src = img.src;
          modal.classList.add('opacity-100', 'pointer-events-auto');
          modal.classList.remove('opacity-0', 'pointer-events-none');
          modal.setAttribute('aria-hidden', 'false');
        }
        // cleanup animation class after a short delay so image returns to normal when modal closed
        setTimeout(() => {
          img.classList.remove('rom-animate', 'animate-[romance_0.85s_cubic-bezier(0.22,0.9,0.29,1)_forwards]', 'pointer-events-none');
        }, 400);
      };
      img.addEventListener('animationend', onEnd);
    });
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.setAttribute('aria-hidden', 'true');
    if (modalImg) modalImg.src = '';
  }
  // enhance close button: hover -> about-to-break, click -> break animation then close
  if (modalClose) {
    let breaking = false;
    modalClose.addEventListener('mouseenter', () => {
      const icon = modalClose.querySelector('.heart-icon');
      if (icon) icon.classList.add('animate-[wobble_0.6s_ease-in-out_infinite]');
    });
    modalClose.addEventListener('mouseleave', () => {
      const icon = modalClose.querySelector('.heart-icon');
      if (icon) icon.classList.remove('animate-[wobble_0.6s_ease-in-out_infinite]');
    });
    modalClose.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (breaking) return;
      breaking = true;
      modalClose.classList.add('broken'); // Keep broken class for CSS or handle via JS?
      // Handle broken state via JS + Tailwind classes on children
      const hLeft = modalClose.querySelector('.h-left');
      const hRight = modalClose.querySelector('.h-right');
      const crack = modalClose.querySelector('.crack');

      if (hLeft) hLeft.classList.add('-translate-x-[18px]', '-translate-y-[12px]', '-rotate-[18deg]');
      if (hRight) hRight.classList.add('translate-x-[18px]', '-translate-y-[12px]', 'rotate-[18deg]', 'opacity-100');
      if (crack) crack.classList.add('opacity-100');

      // give broken animation time (matches CSS transition ~450ms)
      setTimeout(() => {
        // close modal after break animation
        closeModal();
        // reset button state for next open
        modalClose.classList.remove('broken');
        if (hLeft) hLeft.classList.remove('-translate-x-[18px]', '-translate-y-[12px]', '-rotate-[18deg]');
        if (hRight) hRight.classList.remove('translate-x-[18px]', '-translate-y-[12px]', 'rotate-[18deg]', 'opacity-100');
        if (crack) crack.classList.remove('opacity-100');
        breaking = false;
      }, 520);
    });
  }
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// run setup once DOM is ready
function initAll() {
  try { setupGalleryImages(); } catch (e) { console.warn(e) }
  try { setupStoryQuiz(); } catch (e) { console.warn(e) }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
else initAll();

// story quiz: allow sending answers to Telegram
function setupStoryQuiz() {
  const cards = document.querySelectorAll('.story-card');
  if (!cards || cards.length === 0) return;

  cards.forEach(card => {
    // input is revealed by clicking the card (handled below)

    // also open when clicking the card itself (unless clicking controls)
    card.addEventListener('click', (e) => {
      // ignore clicks on controls (send button, input)
      if (e.target.closest('.send-answer') || e.target.closest('.answer-row')) return;
      // close other open cards so only one is expanded
      document.querySelectorAll('.story-card.active').forEach(c => {
        if (c !== card) {
          c.classList.remove('active');
          const row = c.querySelector('.answer-row');
          if (row) row.classList.remove('max-h-[240px]', 'opacity-100', 'translate-y-0');
          if (row) row.classList.add('max-h-0', 'opacity-0', '-translate-y-2');
        }
      });
      if (!card.classList.contains('active')) {
        card.classList.add('active');
        const row = card.querySelector('.answer-row');
        if (row) {
          row.classList.remove('max-h-0', 'opacity-0', '-translate-y-2');
          row.classList.add('max-h-[240px]', 'opacity-100', 'translate-y-0');
        }
        const inp = card.querySelector('.answer-input'); if (inp) inp.focus();
      }
    });
    const btn = card.querySelector('.send-answer');
    const input = card.querySelector('.answer-input');
    const qel = card.querySelector('.question');
    const question = qel ? qel.textContent.trim() : 'Question';

    if (!btn || !input) return;

    // (no blur collapse) — the card will collapse only after clicking Send

    btn.addEventListener('click', async () => {
      const answer = input.value.trim();
      if (!answer) { input.focus(); return; }

      btn.disabled = true; btn.textContent = 'Sending…';

      const now = new Date();
      const ts = now.toLocaleString();
      const pageTitle = document.title || location.pathname;
      const pageUrl = location.href;
      const msg = `Page: ${pageTitle} (${pageUrl})\nQuestion: ${question}\nAnswer: ${answer}\nTime: ${ts}`;

      // Always post to the forwarder; if it fails, fall back to copying the message to clipboard
      try {
        const res = await fetch(`${FORWARDER_URL.replace(/\/$/, '')}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Bypass-Tunnel-Reminder': 'true'
          },
          body: JSON.stringify({ pageTitle, pageUrl, question, answer, time: ts })
        });

        const ct = res.headers.get('content-type') || '';
        let data = null;
        if (ct.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.warn('forwarder returned non-JSON response:', text);
          try { data = JSON.parse(text); } catch (e) { data = { ok: false, raw: text }; }
        }

        if (res.ok && data && data.ok) {
          btn.textContent = 'Sent';
          setTimeout(() => { btn.textContent = 'Send'; input.value = ''; btn.disabled = false; card.classList.remove('active'); }, 1200);
        } else {
          console.error('forwarder error', res.status, data);
          // fallback: copy the message to clipboard so user can paste it manually
          try { await navigator.clipboard.writeText(msg); btn.textContent = 'Copied'; } catch (e) { btn.textContent = 'Error'; }
          setTimeout(() => { btn.textContent = 'Send'; btn.disabled = false; input.value = ''; card.classList.remove('active'); }, 1400);
        }
      } catch (err) {
        console.error('Network/error sending to forwarder', err);
        try { await navigator.clipboard.writeText(msg); btn.textContent = 'Copied'; } catch (e) { btn.textContent = 'Error'; }
        setTimeout(() => { btn.textContent = 'Send'; btn.disabled = false; input.value = ''; card.classList.remove('active'); }, 1400);
      }
      // ensure collapse after errors as well
      try { setTimeout(() => { card.classList.remove('active'); }, 1500); } catch (e) { }
    });
  });
}
