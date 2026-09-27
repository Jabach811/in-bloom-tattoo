(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: .08});
  $$('.reveal').forEach(el => observer.observe(el));

  const menu = $('.menu-toggle');
  const nav = $('#navigation');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open menu'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open',open); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click',e => { if(e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown',e => { if(e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });

  let scene = 0, timer, paused = reduced.matches;
  const frames = $$('.film-frame'), dots = $$('.scene-dots button');
  const labels = ['01 / THE CRAFT','02 / THE LETTERING','03 / THE SHOP'];
  const setScene = n => {scene=n; frames.forEach((f,i)=>f.classList.toggle('is-active',i===n)); dots.forEach((b,i)=>{b.classList.toggle('active',i===n); b.setAttribute('aria-pressed',String(i===n));}); $('#scene-label').textContent=labels[n];};
  const restart = () => {clearInterval(timer); if(!paused && !document.hidden) timer=setInterval(()=>setScene((scene+1)%frames.length),7000);};
  const setPause = value => {paused=value; document.body.classList.toggle('motion-paused',paused); const b=$('#motion-toggle'); b.setAttribute('aria-pressed',String(paused)); b.setAttribute('aria-label',paused?'Play motion':'Pause motion'); b.innerHTML=paused?'▷ <span>PLAY MOTION</span>':'Ⅱ <span>PAUSE MOTION</span>'; restart();};
  dots.forEach((b,i)=>b.addEventListener('click',()=>{setScene(i);restart();}));
  $('#motion-toggle').addEventListener('click',()=>setPause(!paused));
  reduced.addEventListener('change',()=>setPause(reduced.matches));
  document.addEventListener('visibilitychange',restart);
  setPause(paused);

  const pieces = $$('.piece');
  let visiblePieces = [...pieces], current=0, opener;
  $$('.filters button').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    $$('.filters button').forEach(b=>{const selected=b===button;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
    pieces.forEach(p=>p.hidden=filter!=='all' && p.dataset.category!==filter);
    visiblePieces=pieces.filter(p=>!p.hidden);
    $('.gallery').classList.toggle('filtered',filter!=='all');
    $('#filter-status').textContent=`Showing ${visiblePieces.length} tattoos: ${button.textContent.trim()}`;
  }));
  const dialog=$('#lightbox');
  const renderPiece=()=>{const p=visiblePieces[current], img=$('#viewer-image');img.src=p.getAttribute('href'); img.alt=p.querySelector('img').alt; $('#viewer-title').textContent=p.dataset.title; $('#viewer-style').textContent=p.dataset.style; $('#viewer-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(visiblePieces.length).padStart(2,'0')}`;};
  pieces.forEach(p=>p.addEventListener('click',e=>{if(!dialog.showModal)return;e.preventDefault();opener=p;current=visiblePieces.indexOf(p);renderPiece();dialog.showModal();document.body.style.overflow='hidden';$('#viewer-close').focus();}));
  const move=n=>{current=(current+n+visiblePieces.length)%visiblePieces.length;renderPiece();};
  $('#viewer-prev').addEventListener('click',()=>move(-1));
  $('#viewer-next').addEventListener('click',()=>move(1));
  $('#viewer-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow='';if(opener)opener.focus();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='ArrowRight'){e.preventDefault();move(1);}});
})();
