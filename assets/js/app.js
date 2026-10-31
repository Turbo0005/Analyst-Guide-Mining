/* Ore & Equity core app: theme, nav, progress, quizzes, glossary, flashcards (Leitner SRS), dossier */
(function(){
'use strict';
var OE=window.OE=window.OE||{};
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
OE.LS=LS;
function $(s,c){return (c||document).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
OE.$=$;OE.$$=$$;
var root=document.body.getAttribute('data-root')||'';

/* toast */
OE.toast=function(html,ms){var t=$('#oeToast');if(!t){t=document.createElement('div');t.id='oeToast';t.className='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t)}t.innerHTML=html;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},ms||6000)};

/* theme */
var tb=$('#themeBtn');
function syncTheme(){if(tb)tb.setAttribute('aria-pressed',document.documentElement.getAttribute('data-theme')==='light'?'true':'false')}
if(tb){syncTheme();tb.addEventListener('click',function(){var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('oe.theme',t)}catch(e){}syncTheme();document.dispatchEvent(new CustomEvent('oe:theme'))})}
/* menu */
var mb=$('#menuBtn'),nav=$('#mainnav');
function setMenu(o){if(!nav)return;nav.classList.toggle('open',o);if(mb)mb.setAttribute('aria-expanded',o?'true':'false')}
if(mb){mb.setAttribute('aria-controls','mainnav');mb.setAttribute('aria-expanded','false');mb.addEventListener('click',function(e){e.stopPropagation();setMenu(!nav.classList.contains('open'))})}
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
document.addEventListener('click',function(e){if(nav&&nav.classList.contains('open')&&!e.target.closest('#mainnav'))setMenu(false)});
/* active nav: compare full paths */
(function(){var path=location.pathname.replace(/\/$/,'/index.html');var sect=/\/modules\//.test(path)?'index.html':(/\/library\//.test(path)?'library/index.html':null);
$$('.mainnav a').forEach(function(a){var ap=new URL(a.href,location.href).pathname;var on=false;if(sect){on=a.getAttribute('href').replace(/^(\.\.\/)+/,'')===sect}else on=ap===path;if(on){a.classList.add('on');a.setAttribute('aria-current','page')}})})();

/* reading bar */
var rb=$('.readbar span');
function onScroll(){var h=document.documentElement;var p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);if(rb)rb.style.width=(p*100)+'%'}
document.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* TOC scrollspy */
var tocLinks=$$('.mside .toc a');
if(tocLinks.length&&'IntersectionObserver' in window){
  var map={};tocLinks.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tocLinks.forEach(function(x){x.classList.remove('on')});var a=map[e.target.id];if(a)a.classList.add('on')}})},{rootMargin:'-90px 0px -70% 0px'});
  Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)});
}
$$('.toc-mobile a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.open=false})});

/* progress */
function prog(){return LS.get('oe.progress',{})}
function setProg(slug,patch){var p=prog();p[slug]=Object.assign(p[slug]||{},patch);LS.set('oe.progress',p);refresh()}
OE.prog=prog;OE.setProg=setProg;
function modBySlug(s){return (OE.modules||[]).find(function(m){return m.slug===s})}
function refresh(){
  var p=prog(),mods=OE.modules||[],done=0,any=false;
  mods.forEach(function(m){var s=p[m.slug];if(s&&s.done)done++;if(s&&(s.done||s.quiz))any=true});
  var pct=mods.length?Math.round(done/mods.length*100):0;
  var r=$('#courseRing');if(r)r.style.setProperty('--p',pct);var cp=$('#coursePct');if(cp)cp.textContent=pct+'%';
  var cw=$('.course-pct');if(cw)cw.setAttribute('aria-label','Course progress '+pct+'%');
  $$('.node').forEach(function(n){var s=p[n.getAttribute('data-slug')]||{};n.classList.toggle('done',!!s.done);n.classList.toggle('mastered',(s.quiz||0)>=80)});
  $$('.phase').forEach(function(ph){var ns=$$('.node',ph),d=ns.filter(function(n){return n.classList.contains('done')}).length;var b=$('.phase-bar span',ph);if(b)b.style.width=(ns.length?d/ns.length*100:0)+'%';var seg=$('.pl-seg[href="#'+ph.id+'"]');if(seg)seg.style.setProperty('--done',ns.length?d/ns.length*100:0)});
  $$('.donebadge').forEach(function(b){var s=p[b.getAttribute('data-slug')]||{};b.className='donebadge'+(s.done?' done':'')+((s.quiz||0)>=80?' mastered':'');b.textContent=(s.quiz||0)>=80?'Mastered · '+s.quiz+'%':s.done?'Completed':(s.quiz?'Quiz best '+s.quiz+'%':'Not started')});
  $$('.markdone').forEach(function(b){var s=p[b.getAttribute('data-slug')]||{};b.textContent=s.done?'✓ Completed (click to undo)':'Mark complete without the quiz'});
  $$('.phase-mods li').forEach(function(li){var s=p[li.getAttribute('data-slug')]||{};li.classList.toggle('done',!!s.done)});
  var rs=$('#resumeBtn');if(rs&&mods.length&&any){var nx=mods.find(function(m){return !(p[m.slug]&&p[m.slug].done)});if(nx){rs.textContent='Resume: Module '+nx.n+' →';rs.href='modules/'+nx.slug+'.html'}}
  var cc=$('#cardCount');if(cc&&OE.cards)cc.textContent=OE.cards.length;
  var dl=$('#dailyLoop');if(dl)daily(dl,p,mods,any);
  dossier();
}
OE.refresh=refresh;
function daily(el,p,mods,any){if(!any){el.hidden=true;return}var st=LS.get('oe.srs',{}),now=Date.now(),dueN=0;(OE.cards||[]).forEach(function(c){var s=st[c.id];if(s&&now>=s.due)dueN++});var nx=mods.find(function(m){return !(p[m.slug]&&p[m.slug].done)});el.hidden=false;el.innerHTML='<div class="dl-k">Today</div><div class="dl-row"><a href="flashcards.html"><b>'+dueN+'</b> cards due</a><a href="game.html"><b>1</b> game round</a>'+(nx?'<a href="modules/'+nx.slug+'.html">Continue <b>M'+nx.n+'</b> · '+nx.t+'</a>':'<a href="modules/capstone.html">Capstone</a>')+'</div>'}
$$('.markdone').forEach(function(b){b.addEventListener('click',function(){var s=b.getAttribute('data-slug');var cur=(prog()[s]||{}).done;setProg(s,{done:!cur,at:Date.now()});if(!cur)celebrate(s,null)})});
function celebrate(slug,pct){var m=modBySlug(slug);if(!m)return;var nc=(OE.cards||[]).filter(function(c){return c.m===slug}).length;var hasDos=(OE.dossierSlugs||[]).indexOf(slug)>-1;OE.toast('<b>Module '+m.n+(pct!=null?' mastered ('+pct+'%)':' completed')+'</b><br>'+(nc?nc+' flashcards added to your deck':'')+(hasDos?(nc?' · ':'')+'<a href="'+root+'dossier.html">Hemi dossier page filed →</a>':''),8000)}

/* glossary tooltips */
var tip=$('#glTip'),gl={};(OE.glossary||[]).forEach(function(g){gl[g.t.toLowerCase()]=g});
function showTip(e){var el=e.currentTarget,t=el.getAttribute('data-term');var g=gl[t.toLowerCase()];if(!g||!tip)return;tip.innerHTML='<b>'+g.t+'</b>'+g.d;tip.classList.add('show');var r=el.getBoundingClientRect();var x=Math.min(window.innerWidth-Math.min(360,window.innerWidth-20)-10,Math.max(10,r.left));var y=r.bottom+8;if(y+160>window.innerHeight)y=r.top-tip.offsetHeight-8;tip.style.left=x+'px';tip.style.top=y+'px'}
function hideTip(){if(tip)tip.classList.remove('show')}
$$('abbr.gl').forEach(function(a){a.tabIndex=0;a.setAttribute('role','button');a.addEventListener('mouseenter',showTip);a.addEventListener('focus',showTip);a.addEventListener('mouseleave',hideTip);a.addEventListener('blur',hideTip);a.addEventListener('click',function(e){showTip(e);setTimeout(hideTip,4000)})});
var glf=$('#glFilter');if(glf)glf.addEventListener('input',function(){var q=glf.value.toLowerCase();$$('.gl-item').forEach(function(i){i.style.display=i.textContent.toLowerCase().indexOf(q)>-1?'':'none'})});

/* quizzes: >=80% completes the module */
$$('.quiz').forEach(function(qz){
  var data;try{data=JSON.parse(qz.getAttribute('data-quiz'))}catch(e){return}
  var slug=qz.getAttribute('data-slug'),answered=0,correct=0,missed=[];
  var h='';data.forEach(function(it,i){h+='<fieldset class="qitem" data-i="'+i+'"><legend class="qq"><span class="qn">Q'+(i+1)+'</span>'+it.q+'</legend>'+it.o.map(function(o,j){return '<button type="button" class="qopt" data-j="'+j+'">'+o+'</button>'}).join('')+'<div class="qexp" aria-live="polite">'+(it.e||'')+'</div></fieldset>'});
  h+='<div class="qscore"><span>Score: <span class="big" data-score>–</span></span><span class="muted" data-msg aria-live="polite">Answer all '+data.length+' questions. 80% or more completes the module.</span><button type="button" class="btn tiny ghost" data-reset>Retake</button></div>';
  qz.innerHTML=h;
  qz.addEventListener('click',function(e){
    var b=e.target.closest('.qopt');
    if(e.target.closest('[data-reset]')){answered=0;correct=0;missed=[];$$('.qitem',qz).forEach(function(q){q.classList.remove('answered');$$('.qopt',q).forEach(function(o){o.classList.remove('right','wrong');o.disabled=false})});$('[data-score]',qz).textContent='–';return}
    if(!b)return;var item=b.closest('.qitem');if(item.classList.contains('answered'))return;
    var i=+item.getAttribute('data-i'),j=+b.getAttribute('data-j');item.classList.add('answered');answered++;
    var ok=j===data[i].a;if(ok)correct++;else missed.push(i+1);b.classList.add(ok?'right':'wrong');$$('.qopt',item)[data[i].a].classList.add('right');$$('.qopt',item).forEach(function(o){o.disabled=true});
    var pct=Math.round(correct/data.length*100);$('[data-score]',qz).textContent=correct+'/'+data.length;
    if(answered===data.length){var prev=prog()[slug]||{};var best=Math.max(pct,prev.quiz||0);
      if(pct>=80){setProg(slug,{quiz:best,done:true,at:prev.at||Date.now()});$('[data-msg]',qz).innerHTML='<b>Mastered ('+pct+'%).</b> Module complete.'+((OE.dossierSlugs||[]).indexOf(slug)>-1?' Your Hemi dossier page is filed, and this':' This')+' module\'s flashcards are now in your “Modules I\'ve started” deck.';celebrate(slug,pct)}
      else{setProg(slug,{quiz:best});$('[data-msg]',qz).innerHTML=pct+'%. You need 80% to complete the module. Re-read the explanations for question'+(missed.length>1?'s ':' ')+missed.join(', ')+', use the <a href="#article">section list</a>, then retake.'}}
  });
});

/* dossier: learner writes first, then reveals the analyst page */
function dossier(){var p=prog(),n=0,notes=LS.get('oe.dossierNotes',{});$$('.dos-entry').forEach(function(d){var s=d.getAttribute('data-slug');var open=!!(notes[s]&&notes[s].revealed)||(p[s]&&p[s].done)||d.classList.contains('peeked');d.classList.toggle('locked',!open);if(open)n++});var c=$('#dosCount');if(c)c.textContent=n}
(function(){var notes=LS.get('oe.dossierNotes',{});$$('.dos-entry').forEach(function(d){var s=d.getAttribute('data-slug');var w=$('.dos-write',d);if(!w)return;var ta=$('textarea',w),ta2=$('textarea.own',w);var n=notes[s]||{};if(ta)ta.value=n.text||'';if(ta2)ta2.value=n.own||'';if(n.rate)$$('.rate button',d).forEach(function(b){b.classList.toggle('on',b.dataset.r===n.rate)});
  w.addEventListener('input',function(){var all=LS.get('oe.dossierNotes',{});all[s]=Object.assign(all[s]||{},{text:ta.value,own:ta2?ta2.value:''});LS.set('oe.dossierNotes',all)});
  var rv=$('.reveal',w);if(rv)rv.addEventListener('click',function(){var all=LS.get('oe.dossierNotes',{});all[s]=Object.assign(all[s]||{},{revealed:true,text:ta.value});LS.set('oe.dossierNotes',all);d.classList.add('peeked');dossier();d.classList.add('compare')});
  $$('.rate button',d).forEach(function(b){b.addEventListener('click',function(){var all=LS.get('oe.dossierNotes',{});all[s]=Object.assign(all[s]||{},{rate:b.dataset.r});LS.set('oe.dossierNotes',all);$$('.rate button',d).forEach(function(x){x.classList.toggle('on',x===b)})})});
  if(n.revealed)d.classList.add('compare')})
 var ex=$('#dosExport');if(ex)ex.addEventListener('click',function(){var all=LS.get('oe.dossierNotes',{});var md='# My Hemi dossier\n';$$('.dos-entry').forEach(function(d){var s=d.dataset.slug,n=all[s]||{};md+='\n## '+$('h3',d).textContent+'\n\n**My analysis:** '+(n.text||'_(blank)_')+'\n\n**My own company:** '+(n.own||'_(blank)_')+'\n\n**Self-rating:** '+(n.rate||'-')+'\n'});var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));a.download='my-hemi-dossier.md';a.click()})})();
document.addEventListener('click',function(e){var pk=e.target.closest('.peek');if(pk){pk.closest('.dos-entry').classList.add('peeked');dossier()}});

/* flashcards: Leitner boxes 1..5 */
var INTERVALS=[0,1,3,7,21,60],NEW_PER_DAY=12;
function srs(){return LS.get('oe.srs',{})}
OE.flash=function(el){
  var cards=OE.cards||[];var params=new URLSearchParams(location.search);var mf=params.get('m');
  var state=srs(),now=Date.now(),DAY=864e5,p=prog();
  var started=(OE.modules||[]).filter(function(m){var s=p[m.slug];return s&&(s.done||s.quiz)}).map(function(m){return m.slug});
  var defSel=mf||(started.length?'__started':'how-mining-stocks-behave');
  var filterSel='<label class="sr-only" for="fcFilter">Deck</label><select id="fcFilter" class="w-input"><option value="__started"'+(defSel==='__started'?' selected':'')+'>Modules I\'ve started ('+started.length+')</option><option value="__all">All modules (interleaved)</option>'+(OE.modules||[]).map(function(m){return '<option value="'+m.slug+'"'+(m.slug===defSel?' selected':'')+'>M'+m.n+' · '+m.t+'</option>'}).join('')+'</select>';
  el.innerHTML='<div class="fc-wrap"><div><div class="fc-intro" id="fcIntro"></div><div class="fc-card" id="fcCard" tabindex="0" role="button" aria-label="Flashcard: activate to show the answer"><div class="fc-inner"><div class="fc-face front"><div class="fc-meta"><span id="fcMod"></span><span id="fcBox"></span></div><div class="fc-text" id="fcFront"></div></div><div class="fc-face back"><div class="fc-meta"><span>Answer</span><span></span></div><div class="fc-text" id="fcBack" aria-live="polite"></div></div></div></div><div class="fc-actions"><button class="btn primary" id="fcShow">Show answer <kbd class="hover-only">Space</kbd></button><div class="fc-grade" id="fcGrade" hidden><button class="btn again" id="fcAgain">✗ Again <kbd class="hover-only">1</kbd></button><button class="btn" id="fcHard">~ Hard <kbd class="hover-only">2</kbd></button><button class="btn good" id="fcGood">✓ Got it <kbd class="hover-only">3</kbd></button></div></div></div><aside class="fc-side"><div class="side-h">Deck</div>'+filterSel+'<div class="boxes" id="fcBoxes"></div><div class="kpi-pair"><div class="kpi"><span>Due reviews</span><b id="fcDue">0</b></div><div class="kpi"><span>New today</span><b id="fcNew">0</b></div></div><div class="kpi" style="margin-top:8px"><span>Due tomorrow</span><b id="fcTomorrow">0</b></div><p style="font-size:13px" class="muted">Up to '+NEW_PER_DAY+' new cards a day. Leitner schedule: box 1 = this session, 2 = 1 day, 3 = 3 days, 4 = 7 days, 5 = 21 days. A miss sends a card back to box 1.</p><button class="btn tiny ghost" id="fcReset">Reset progress</button></div></div>';
  var queue=[],cur=null,flipped=false,today=LS.get('oe.srsToday',{d:'',n:0,nw:0});var dstr=new Date().toDateString();if(today.d!==dstr)today={d:dstr,n:0,nw:0};today.nw=today.nw||0;
  function pool(){var f=$('#fcFilter').value;if(f==='__all')return cards;if(f==='__started')return cards.filter(function(c){return started.indexOf(c.m)>-1});return cards.filter(function(c){return c.m===f})}
  function build(){now=Date.now();var pl=pool();var dueRev=pl.filter(function(c){var s=state[c.id];return s&&now>=s.due});var news=pl.filter(function(c){return !state[c.id]});var room=Math.max(0,NEW_PER_DAY-today.nw);
    dueRev.sort(function(a,b){return state[a.id].box-state[b.id].box||Math.random()-.5});queue=dueRev.concat(news.slice(0,room).map(function(c){c._new=1;return c}));
    var f=$('#fcFilter').value;$('#fcIntro').innerHTML=f==='__started'&&!started.length?'':(!started.length&&f==='how-mining-stocks-behave'?'<b>Start here:</b> you haven\'t started a module yet, so this deck shows Module 1\'s cards. As you take quizzes, cards from those modules join "Modules I\'ve started".':'');
    if(f==='__started'&&!started.length){$('#fcFilter').value='how-mining-stocks-behave';return build()}
    stats();next()}
  function stats(){var pl=pool(),b=[0,0,0,0,0,0],tm=0,t1=now+DAY;pl.forEach(function(c){var s=state[c.id];b[s?s.box:0]++;if(s&&s.due<=t1&&s.due>now)tm++});$('#fcBoxes').innerHTML=['New','1','2','3','4','5'].map(function(l,i){return '<div><b>'+b[i]+'</b>'+(i?'Box '+l:'New')+'</div>'}).join('');$('#fcDue').textContent=queue.filter(function(c){return !c._new}).length;$('#fcNew').textContent=today.nw+' / '+NEW_PER_DAY;$('#fcTomorrow').textContent=tm}
  function modName(s){var m=modBySlug(s);return m?'M'+m.n+' · '+m.t:''}
  function setFlip(f){flipped=f;$('#fcCard').classList.toggle('flip',f);$('#fcGrade').hidden=!f;$('#fcShow').hidden=f||!cur}
  function next(){cur=queue.shift();setFlip(false);if(!cur){$('#fcFront').innerHTML='All caught up!<br><span style="font-size:16px" class="muted">No cards due in this deck. Come back tomorrow, or start another module.</span>';$('#fcBack').innerHTML='';$('#fcMod').textContent='';$('#fcBox').textContent='';$('#fcShow').hidden=true;return}$('#fcFront').innerHTML=cur.f;$('#fcBack').innerHTML=cur.b;$('#fcMod').textContent=modName(cur.m);$('#fcBox').textContent=state[cur.id]?'Box '+state[cur.id].box:'New'}
  function grade(g){if(!cur||!flipped)return;var isNew=!state[cur.id];var s=state[cur.id]||{box:0};if(g===0)s.box=1;else if(g===1)s.box=Math.max(1,s.box||1);else s.box=Math.min(5,(s.box||0)+1);s.due=Date.now()+(g===0?0:INTERVALS[s.box]*DAY);state[cur.id]=s;LS.set('oe.srs',state);today.n++;if(isNew)today.nw++;LS.set('oe.srsToday',today);delete cur._new;if(g===0)queue.push(cur);stats();next()}
  $('#fcCard').addEventListener('click',function(){if(cur)setFlip(!flipped)});
  $('#fcCard').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();if(cur)setFlip(!flipped)}});
  $('#fcShow').onclick=function(){setFlip(true);$('#fcGood').focus()};
  $('#fcAgain').onclick=function(){grade(0)};$('#fcHard').onclick=function(){grade(1)};$('#fcGood').onclick=function(){grade(2)};
  $('#fcFilter').onchange=build;$('#fcReset').onclick=function(){if(confirm('Reset all flashcard progress?')){state={};LS.set('oe.srs',state);today.nw=0;LS.set('oe.srsToday',today);build()}};
  document.addEventListener('keydown',function(e){if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();if(cur)setFlip(!flipped)}if(flipped){if(e.key==='1')grade(0);if(e.key==='2')grade(1);if(e.key==='3')grade(2)}});
  build();
};
var fcEl=$('#flashcards');if(fcEl)OE.flash(fcEl);

/* practice tasks */
$$('.tasks').forEach(function(t){var slug=t.getAttribute('data-slug');var all=LS.get('oe.tasks',{});var st=all[slug]||{};$$('input',t).forEach(function(i){i.checked=!!st[i.dataset.i];i.addEventListener('change',function(){var a=LS.get('oe.tasks',{});a[slug]=a[slug]||{};a[slug][i.dataset.i]=i.checked;LS.set('oe.tasks',a)})})});
/* fast track highlight */
var FT=['how-mining-stocks-behave','lassonde-curve','hemi-story','drill-results','resources-reserves','reading-the-numbers','metallurgy-payable-metal','costs','financing-dilution','studies','dcf-nav','sensitivity-priced-in','hedges-royalties-streams','red-flags'];
function track(){var t=LS.get('oe.track',null);try{t=localStorage.getItem('oe.track')}catch(e){}$$('.node').forEach(function(n){n.classList.toggle('ft',t==='fast'&&FT.indexOf(n.getAttribute('data-slug'))>-1)});document.body.classList.toggle('track-fast',t==='fast')}
document.addEventListener('oe:track',track);track();
/* tools gallery filters */
$$('.tg-filters .chip').forEach(function(c){c.addEventListener('click',function(){$$('.tg-filters .chip').forEach(function(x){x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c?'true':'false')});var f=c.dataset.f;$$('.tg-card').forEach(function(k){k.classList.toggle('hidden',f!=='all'&&k.dataset.ph!==f)})})});
$$('.tg-card [data-open]').forEach(function(b){b.addEventListener('click',function(){var card=b.closest('.tg-card');var id=card.dataset.w;var ex=document.getElementById('open-'+id);if(ex){ex.remove();b.textContent='Open here';b.setAttribute('aria-expanded','false');return}var box=document.createElement('div');box.className='tg-open';box.id='open-'+id;box.innerHTML='<div class="widget" data-widget="'+id+'"></div>';var grid=card.parentNode,cards=$$('.tg-card:not(.hidden)',grid),idx=cards.indexOf(card);var cols=Math.max(1,Math.round(grid.clientWidth/card.clientWidth));var last=cards[Math.min(cards.length-1,Math.floor(idx/cols)*cols+cols-1)];last.after(box);b.textContent='Close';b.setAttribute('aria-expanded','true');if(OE.mountWidget)OE.mountWidget(box.firstChild);box.scrollIntoView({behavior:'smooth',block:'nearest'})})});
if(location.hash&&/^#w-/.test(location.hash)){var tc=document.querySelector('.tg-card[data-w="'+location.hash.slice(3)+'"] [data-open]');if(tc)setTimeout(function(){tc.click()},300)}

refresh();
})();
