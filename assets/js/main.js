
const state={lang:localStorage.getItem('lab_lang')||'en'};
async function loadLang(lang){
  try{const res=await fetch(`./i18n/${lang}.json`);const dict=await res.json();applyDict(dict);state.lang=lang;localStorage.setItem('lab_lang',lang);}catch(e){console.error(e);}
}
const Q=s=>document.querySelector(s);
function setHTML(sel,html){const el=Q(sel);if(el) el.innerHTML=html;}
function applyDict(d){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n'); const val=key.split('.').reduce((o,k)=>o&&o[k], d);
    if(typeof val==='string') el.textContent=val;
  });
  document.title = d.meta?.title || document.title;
  setHTML('#topics',(d.content?.research_topics||[]).map(t=>`<li>${t}</li>`).join(''));
  const mem=d.content?.members||[];
  setHTML('#membersBody', mem.map(m=>{
    const emails=Array.isArray(m.email)?m.email:(m.email?[m.email]:[]);
    const emHTML=emails.map(e=>`<a href="mailto:${e}">${e}</a>`).join(' / ');
    return `<tr><td>${m.name}</td><td>${m.role}</td><td>${emHTML}</td></tr>`;
  }).join(''));
  setHTML('#pubs',(d.content?.publications||[]).map(p=>`<li>${p}</li>`).join(''));
  const news=d.content?.activities||[];
  setHTML('#news',news.map(n=>`<li><span class="badge">${n.date}</span> <strong>${n.title}</strong> — ${n.note||''}</li>`).join(''));
}
document.addEventListener('DOMContentLoaded',()=>{
  const sel=document.getElementById('langSelect');
  if(sel){ sel.value=state.lang; sel.addEventListener('change',e=>loadLang(e.target.value)); }
  loadLang(state.lang);
});
