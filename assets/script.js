/* =========================================================
   Giorgi & Anna — interactions
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- sticky nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = $('#navToggle');
  const mobile = $('#navMobile');
  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('#navMobile a').forEach((a) =>
    a.addEventListener('click', () => {
      mobile.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- reveal on scroll (scroll-position based; robust) ---------- */
  const reveals = $$('.reveal');
  let ticking = false;
  function checkReveals() {
    ticking = false;
    const trigger = window.innerHeight * 0.9;
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('is-in');
        reveals.splice(i, 1);
      }
    }
  }
  function onReveal() {
    if (!ticking) { ticking = true; requestAnimationFrame(checkReveals); }
  }
  window.addEventListener('scroll', onReveal, { passive: true });
  window.addEventListener('resize', onReveal, { passive: true });
  checkReveals();
  // safety net: if anything is still hidden shortly after load, show it.
  setTimeout(() => $$('.reveal').forEach((el) => el.classList.add('is-in')), 1500);

  /* ---------- countdown ---------- */
  const cd = $('#countdown');
  if (cd) {
    const target = new Date(cd.dataset.date).getTime();
    const cells = {
      days: $('[data-k=days]', cd),
      hours: $('[data-k=hours]', cd),
      mins: $('[data-k=mins]', cd),
      secs: $('[data-k=secs]', cd),
    };
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      cells.days.textContent = d;
      cells.hours.textContent = pad(h);
      cells.mins.textContent = pad(m);
      cells.secs.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- RSVP form ---------- */
  const RSVP_KEY = 'ga_rsvp_v1';
  const form = $('#rsvpForm');
  const done = $('#rsvpDone');
  const doneTitle = $('#rsvpDoneTitle');
  const doneMsg = $('#rsvpDoneMsg');

  function showRsvpDone(data) {
    form.hidden = true;
    done.hidden = false;
    const first = (data.name || '').trim().split(' ')[0] || 'მეგობარო';
    if (data.attending === 'no') {
      doneTitle.textContent = 'მოგვენატრებით';
      doneMsg.textContent = `გმადლობთ, რომ შეგვატყობინეთ, ${first}. სულით მაინც ჩვენთან იქნებით — და ჩვენი გულის საცეკვაო მოედანზე.`;
    } else {
      doneTitle.textContent = `მალე შევხვდებით, ${first}!`;
      const meal = data.meal ? ` თქვენი არჩევანი — ${data.meal} — ჩავინიშნეთ.` : '';
      doneMsg.textContent = `თქვენი პასუხი შენახულია.${meal} მოუთმენლად ველით 15 ივნისს თქვენთან ერთად ზეიმს.`;
    }
  }

  // restore prior response
  try {
    const saved = JSON.parse(localStorage.getItem(RSVP_KEY) || 'null');
    if (saved) showRsvpDone(saved);
  } catch (e) {}

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      name: fd.get('name'),
      attending: fd.get('attending'),
      meal: fd.get('meal'),
      diet: fd.get('diet'),
      at: Date.now(),
    };
    if (!data.name || !data.attending) {
      form.reportValidity();
      return;
    }
    try { localStorage.setItem(RSVP_KEY, JSON.stringify(data)); } catch (e) {}
    showRsvpDone(data);
  });

  $('#rsvpReset').addEventListener('click', () => {
    try { localStorage.removeItem(RSVP_KEY); } catch (e) {}
    form.reset();
    form.hidden = false;
    done.hidden = true;
  });

  /* ---------- gift modal ---------- */
  const modal = $('#giftModal');
  const modalTitle = $('#giftModalTitle');
  const giftForm = $('#giftForm');
  const giftDone = $('#giftDone');
  const giftDoneMsg = $('#giftDoneMsg');
  const giftBtnAmt = $('#giftBtnAmt');
  const customInput = $('#giftCustom');
  let activeAmt = 100;

  function currentAmount() {
    const c = parseFloat(customInput.value);
    if (c && c > 0) return Math.round(c);
    return activeAmt;
  }
  function syncAmtBtn() {
    giftBtnAmt.textContent = '₾' + currentAmount();
  }

  $$('#giftAmounts .amt[data-amt]').forEach((b) => {
    b.addEventListener('click', () => {
      $$('#giftAmounts .amt').forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active');
      activeAmt = parseInt(b.dataset.amt, 10);
      customInput.value = '';
      syncAmtBtn();
    });
  });
  customInput.addEventListener('input', () => {
    $$('#giftAmounts .amt[data-amt]').forEach((x) => x.classList.remove('is-active'));
    syncAmtBtn();
  });

  function openModal(name) {
    modalTitle.textContent = name;
    giftForm.hidden = false;
    giftDone.hidden = true;
    // reset
    $$('#giftAmounts .amt[data-amt]').forEach((x, i) =>
      x.classList.toggle('is-active', x.dataset.amt === '100')
    );
    activeAmt = 100; customInput.value = ''; syncAmtBtn();
    $('#giftName').value = ''; $('#giftNote').value = '';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  $$('.gift__btn').forEach((b) =>
    b.addEventListener('click', () => openModal(b.closest('.gift').dataset.gift))
  );
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  giftForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amt = currentAmount();
    const who = ($('#giftName').value || '').trim().split(' ')[0];
    giftForm.hidden = true;
    giftDone.hidden = false;
    giftDoneMsg.textContent = who
      ? `${who}, თქვენი ₾${amt}-იანი საჩუქარი „${modalTitle.textContent}“-სთვის ჩვენთვის ფასდაუდებელია.`
      : `თქვენი ₾${amt}-იანი საჩუქარი „${modalTitle.textContent}“-სთვის ჩვენთვის ფასდაუდებელია.`;
  });

  /* ---------- gallery placeholder actions ---------- */
  const notify = $('#galleryNotify');
  if (notify) notify.addEventListener('click', () => {
    notify.textContent = 'შეგატყობინებთ ✓';
    notify.disabled = true;
    notify.style.opacity = '.7';
  });
  const upload = $('#galleryUpload');
  if (upload) upload.addEventListener('click', () => {
    upload.textContent = 'ატვირთვა ქორწილის შემდეგ გაიხსნება ✓';
  });
})();
