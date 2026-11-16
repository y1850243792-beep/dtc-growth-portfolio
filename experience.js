/* A visible reading route, accessible case switches, and deep-link recovery. */
(()=>{
 const cases=[...document.querySelectorAll('.guided-case')];
 const links=[...document.querySelectorAll('.journey-links a')];
 const status=document.getElementById('journey-status');
 const next=document.getElementById('journey-next');
 const names={zh:['开拓渠道','推动销售','提升创意','改善转化'],en:['New channel','Sales growth','Creative','Conversion']};
 let queued=false;
 function update(){
  queued=false;const language=document.documentElement.lang==='en'?'en':'zh';let active=-1;
  cases.forEach((section,i)=>{if(section.getBoundingClientRect().top<=210)active=i;});
  const closing=document.getElementById('closing').getBoundingClientRect().top<=210;
  links.forEach((a,i)=>{if(i===active&&!closing)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
  status.textContent=closing?(language==='zh'?'回到我的核心能力':'What I bring'):active<0?(language==='zh'?'从成果开始':'Start with results'):`${String(active+1).padStart(2,'0')} / 04 · ${names[language][active]}`;
  const target=closing?'work':active<0?cases[0].id:active<cases.length-1?cases[active+1].id:'closing';
  next.href='#'+target;
  next.firstElementChild.textContent=closing?(language==='zh'?'返回成果速览':'Back to the overview'):active<0?(language==='zh'?'从第一个案例开始':'Start the first case'):active<cases.length-1?(language==='zh'?'下一站：':'Next: ')+names[language][active+1]:(language==='zh'?'看看我能带来什么':'What I bring');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('toggle',schedule,true);
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 document.querySelectorAll('.insight-tabs').forEach(tablist=>{
  const tabs=[...tablist.querySelectorAll('[role="tab"]')];
  function select(tab,focus=false){tabs.forEach(t=>{const chosen=t===tab;t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!chosen;});if(focus)tab.focus();}
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>select(tab));
   tab.addEventListener('keydown',event=>{let n=index;if(event.key==='ArrowRight')n=(index+1)%tabs.length;else if(event.key==='ArrowLeft')n=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')n=0;else if(event.key==='End')n=tabs.length-1;else return;event.preventDefault();select(tabs[n],true);});
  });
 });
 function revealHash(hash,scroll=true){
  let target;try{target=document.getElementById(decodeURIComponent(hash.replace(/^#/,'')));}catch{return;}
  if(!target)return;
  for(let parent=target.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
  if(scroll)requestAnimationFrame(()=>{target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});schedule();});
 }
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a)return;revealHash(a.getAttribute('href'),false);});
 window.addEventListener('hashchange',()=>revealHash(location.hash));
 if(location.hash)revealHash(location.hash);update();
})();
