const $ = (s) => document.querySelector(s);
let attention, signals;
let view = 'overview';
let revealed = false;
let selectedSignal = 'calendar';
const fmt = n => Number(n).toLocaleString('en-US');
const monthName = s => new Date(`${s}-01T12:00:00`).toLocaleDateString('en-US',{month:'short',year:'numeric'});
const safe = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function switchPage(p){
 view=p;
 document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id===`page-${p}`));
 document.querySelectorAll('.nav').forEach(el=>{el.classList.toggle('active',el.dataset.page===p);el.setAttribute('aria-current',el.dataset.page===p?'page':'false')});
 $('#download').textContent=p==='signals'?'↧ Export signal research':'↧ Export chart data';
 window.scrollTo(0,0);
 if(p==='overview')drawOverview(); if(p==='replay')drawReplay(); if(p==='signals')drawSignals();
}

function pointSeries(name,start,end){return attention.series[name].points.filter(p=>p.month>=start&&p.month<=end)}
function makeChart({series, markers=[], cutoff=null, expose=true, name='Chart', height=310}) {
 const width=920, left=70,right=18,top=18,bottom=43;
 const plotW=width-left-right,plotH=height-top-bottom;
 const all=series.flatMap(s=>s.points.filter(p=>expose||!cutoff||p.month<=cutoff).map(p=>p.views));
 const max=Math.max(1,...all)*1.09;
 const months=[...new Set(series.flatMap(s=>s.points.map(p=>p.month)))].sort();
 if(!months.length)return '<p class="empty">No data for this selection.</p>';
 const x=i=>left+(months.length===1?plotW/2:i*plotW/(months.length-1));
 const y=v=>top+plotH-(v/max)*plotH;
 let svg=`<svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safe(name)}" xmlns="http://www.w3.org/2000/svg">`;
 for(let i=0;i<=4;i++){
   const val=max*i/4, yy=y(val);
   svg+=`<line x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}" stroke="#e5e6e5"/><text x="${left-12}" y="${yy+4}" text-anchor="end" class="axis-label">${val>=1000?Math.round(val/1000)+'k':Math.round(val)}</text>`;
 }
 const step=Math.max(1,Math.ceil(months.length/8));
 months.forEach((m,i)=>{if(i%step===0||i===months.length-1)svg+=`<text x="${x(i)}" y="${height-13}" text-anchor="middle" class="axis-label">${monthName(m)}</text>`});
 if(cutoff){const c=months.indexOf(cutoff);if(c>=0){const xcut=x(c)+ (months.length>1?plotW/(months.length-1)*.5:0);svg+=`<line x1="${xcut}" y1="${top}" x2="${xcut}" y2="${top+plotH}" stroke="#b79a62" stroke-dasharray="4 5"/><text x="${Math.min(width-130,xcut+7)}" y="${top+12}" class="chart-label">DECISION CUTOFF</text>`;if(!expose)svg+=`<rect x="${xcut}" y="${top}" width="${Math.max(0,width-right-xcut)}" height="${plotH}" fill="#e9ebeb" opacity=".76"/><text x="${Math.min(width-115,xcut+18)}" y="${top+plotH*.55}" class="chart-label">FUTURE HIDDEN</text>`;}}
 for(const s of series){
   const pts=s.points.filter(p=>expose||!cutoff||p.month<=cutoff);
   const d=pts.map((p,i)=>`${i?'L':'M'} ${x(months.indexOf(p.month)).toFixed(2)} ${y(p.views).toFixed(2)}`).join(' ');
   if(d)svg+=`<path d="${d}" stroke="${s.color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
   pts.forEach(p=>{const xi=x(months.indexOf(p.month)), yi=y(p.views);svg+=`<circle cx="${xi}" cy="${yi}" r="3" fill="${s.color}"><title>${safe(s.label)}: ${monthName(p.month)} · ${fmt(p.views)} views</title></circle>`});
 }
 for(const marker of markers){const i=months.indexOf(marker.month); if(i>=0)svg+=`<line x1="${x(i)}" x2="${x(i)}" y1="${top}" y2="${top+plotH}" stroke="#b79a62" stroke-dasharray="2 5"/><text class="chart-label" x="${Math.min(width-135,x(i)+6)}" y="${top+28}">${safe(marker.label)}</text>`}
 svg+='</svg>';return svg;
}
function drawOverview(){
 if(!attention)return;
 let range=$('#range').value, other=$('#series').value;
 let start=range==='all'?'2023-01':`${range}-01`;
 let end=range==='all'?'2026-08':range==='2026'?'2026-08':`${range}-12`;
 const s=[{label:'Fever',color:'#a53c42',points:pointSeries('fever',start,end)}];
 $('#other-legend').hidden=other==='none';
 if(other!=='none'){
   const label=attention.series[other].name;$('#other-name').textContent=label;
   s.push({label,color:'#aaa086',points:pointSeries(other,start,end)});
 }
 $('#overview-chart').innerHTML=makeChart({series:s,name:'Monthly Wikipedia pageviews for '+s.map(x=>x.label).join(' and ')});
}
const replayCases = {
 fever: {
  key:'fever', label:'FEVER 2024 DRAFT', name:'Fever', color:'#a53c42',
  start:'2023-10', end:'2024-07', cutoffs:['2024-01','2024-02','2024-03'], defaultCutoff:'2024-03',
  eventMonth:'2024-04', outcomeEnd:'2024-05', eventName:'April 15, 2024 draft',
  eventUrl:'https://www.wnba.com/news/wnba-draft-2024-results',
  merchant:'Would any earlier signal have arrived before the binding product order? Testing that requires purchase orders, product launch dates, stock position, and the ability to replenish. Those inputs are private.'
 },
 pacers: {
  key:'pacers', label:'PACERS 2025 FINALS RUN', name:'Pacers', color:'#475f73',
  start:'2024-10', end:'2025-08', cutoffs:['2025-03','2025-04','2025-05'], defaultCutoff:'2025-04',
  eventMonth:'2025-05', outcomeEnd:'2025-06', eventName:'May playoff advance and June Finals',
  eventUrl:'https://www.nba.com/news/2025-nba-playoffs-schedule',
  merchant:'Could rapid replenishment, reserved production capacity or approved commemorative options have changed the response? A test needs order and receipt dates, inventory, vendor lead times, margins, and products still actionable during May and June.'
 }
};
function priorMonth(m){const d=new Date(`${m}-01T12:00:00`); d.setMonth(d.getMonth()-1);return d.toISOString().slice(0,7)}
function drawReplay(){
 if(!attention)return;
 const c=replayCases[$('#case-select').value];
 const cutoff=$('#cutoff').value;
 const points=pointSeries(c.key,c.start,c.end);
 const current=points.find(p=>p.month===cutoff);
 if(!current)return;
 const earlier=points.find(p=>p.month===priorMonth(cutoff));
 const event=points.find(p=>p.month===c.eventMonth);
 const finale=points.find(p=>p.month===c.outcomeEnd);
 const growth=(event.views/current.views).toFixed(1);
 $('#case-label').textContent=`REPLAY · ${c.label}`;
 $('#cutoff-views').textContent=fmt(current.views);
 $('#cutoff-note').textContent=`${monthName(cutoff)} ${c.name} article views`;
 let headline,copy;
 if(c.key==='fever'){
  headline='The pre-draft signal did not reveal the magnitude of April.';
  copy=`Through ${monthName(cutoff)}, the public article series reached ${fmt(current.views)} views${earlier?`, from ${fmt(earlier.views)} the month before`:''}. The April draft-month outcome remains hidden until you reveal it.`;
 } else if(cutoff==='2025-05'){
  headline='May is already a surge month, not an early warning.';
  copy='The Eastern Conference Finals were already underway in May. Use the March or April cutoff to test what was visible before that increase. June is still hidden.';
 } else {
  headline='The later playoff surge was not yet visible in monthly pageviews.';
  copy=`At the end of ${monthName(cutoff)}, Pacers article views stood at ${fmt(current.views)}. The major increase in May and June had not yet appeared in the monthly series.`;
 }
 $('#replay-headline').textContent=headline;
 $('#replay-copy').textContent=copy;
 $('#replay-chart').innerHTML=makeChart({series:[{label:c.name,color:c.color,points}],cutoff,expose:revealed,name:`Historical replay: ${c.name} monthly Wikipedia views`});
 $('#reveal').disabled=revealed;
 $('#reveal').textContent=revealed?'Outcome revealed':'Reveal the outcome';
 $('#revealed-note').textContent=revealed?`${monthName(c.eventMonth)}: ${fmt(event.views)} views. ${monthName(c.outcomeEnd)}: ${fmt(finale.views)} views. These are public attention signals, not merchandise sales.`:'Post-cutoff observations are hidden.';
 $('#replay-result-title').textContent=revealed?`${monthName(c.eventMonth)}: ${fmt(event.views)} views`:'Outcome hidden';
 $('#replay-result-copy').textContent=revealed?(c.key==='fever'?`April was ${growth} times ${monthName(cutoff)}. The draft-month change was large, but this monthly series cannot show the timing or predictive value of any pre-order signals.`:`Pacers article views rose from 48,390 in April to 303,980 in May and 458,587 in June 2025. May was about 6.3 times April. June was about 9.5 times April. The Finals appearance occurred after the May playoff run was already underway.`):`Reveal the subsequent observations after selecting a historical decision cutoff.`;
 $('#replay-summary-title').textContent=!revealed?'Result hidden':(c.key==='fever'?'March: 18,664. April: 146,680.':'April: 48,390. May: 303,980. June: 458,587.');
 $('#replay-summary-copy').textContent=!revealed?'Future observations stay hidden until you choose Reveal the outcome.':(c.key==='fever'?'Most of the observed rise came in the draft month. March alone did not reveal its size. This is not an estimate of store demand.':'The Pacers attention surge unfolded as the team advanced through the playoffs. May was already a high-attention month; April is the cleaner pre-surge cutoff. This is not an estimate of store demand.');
 $('#replay-merchant-copy').textContent=c.merchant;
 $('#replay-event-link').href=c.eventUrl;
 $('#replay-event-link').textContent=c.key==='fever'?'Official WNBA draft record ↗':'Official NBA playoff results ↗';
}
function drawSignals(){
 if(!signals)return;
 const filter=$('#signal-filter').value, list=signals.filter(s=>filter==='all'||s.kind===filter);
 if(!list.some(s=>s.id===selectedSignal))selectedSignal=list[0]?.id;
 $('#signal-list').innerHTML=list.map((s,i)=>`<button class="signal-item ${s.id===selectedSignal?'selected':''}" data-id="${safe(s.id)}"><span class="signal-num">0${i+1}</span><span class="signal-item-body"><span class="signal-type">${safe(s.kind)}</span><strong>${safe(s.title)}</strong><small>${safe(s.date)}</small></span><span class="signal-arrow">↗</span></button>`).join('');
 document.querySelectorAll('.signal-item').forEach(el=>el.addEventListener('click',()=>{selectedSignal=el.dataset.id;drawSignals()}));
 const s=list.find(x=>x.id===selectedSignal);
 $('#signal-detail').innerHTML=s?`<div class="detail-top"><span class="tiny-tag">${safe(s.tag)}</span><span>${safe(s.date)}</span></div><h2>${safe(s.title)}</h2><div class="detail-block"><span class="eyebrow">THE MERCHANT QUESTION</span><p class="big-question">${safe(s.question)}</p></div><div class="detail-block needed"><span class="eyebrow">WHAT WOULD LET US ANSWER IT</span><p>${safe(s.need)}</p></div><div class="detail-block"><span class="eyebrow">KNOWN CONTEXT</span><p>${safe(s.fact)}</p><a target="_blank" rel="noreferrer" href="${safe(s.source)}">${safe(s.sourceTitle)} ↗</a></div><div class="detail-block"><span class="eyebrow">HISTORICAL PARALLEL</span><p>${safe(s.history)}</p></div><div class="risk"><strong>Boundary of this evidence</strong><p>${safe(s.risk)}</p></div>`:'<p>No matching signals.</p>';
}
function csvEscape(v){const t=String(v??'');return /[",\n]/.test(t)?'"'+t.replaceAll('"','""')+'"':t}
function exportCsv(){
 let rows,name;
 if(view==='signals'){
   rows=[['Moment','Date','Type','Verified fact','Merchant question','Historical context','Data needed','Limitation','Source'],...signals.filter(s=>$('#signal-filter').value==='all'||s.kind===$('#signal-filter').value).map(s=>[s.title,s.date,s.kind,s.fact,s.question,s.history,s.need,s.risk,s.source])];name='fever-signals.csv';
 }else if(view==='replay'){
   const c=replayCases[$('#case-select').value];rows=[['Case','Month','Article views','Visible before cutoff'],...pointSeries(c.key,c.start,c.end).map(p=>[c.name,p.month,p.views,p.month<=$('#cutoff').value?'yes':'no'])];name=c.key+'-replay.csv';
 }else{
   const range=$('#range').value;const start=range==='all'?'2023-01':`${range}-01`;const end=range==='all'?'2026-08':range==='2026'?'2026-08':`${range}-12`;
   const other=$('#series').value;const fever=pointSeries('fever',start,end);
   const map=new Map(other==='none'?[]:pointSeries(other,start,end).map(p=>[p.month,p.views]));
   rows=[['Month','Fever Wikipedia views',...(other==='none'?[]:[attention.series[other].name+' Wikipedia views'])],...fever.map(p=>[p.month,p.views,...(other==='none'?[]:[map.get(p.month)??''])])];name='fever-public-attention.csv';
 }
 const csv=rows.map(r=>r.map(csvEscape).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
async function init(){
 try{
  const [a,s]=await Promise.all([fetch('data/attention.json'),fetch('data/signals.json')]);if(!a.ok||!s.ok)throw new Error('Unable to load local research files');
  attention=await a.json();signals=await s.json();
  for(const key of ['fever','wnba','pacers'])if(!attention.series[key]?.points?.length)throw new Error('Historical series missing: '+key);
  drawOverview();drawSignals();drawReplay();
 }catch(e){document.querySelectorAll('.chart-wrap').forEach(el=>el.innerHTML='<p class="empty">Research data could not be loaded. Use a local web server or GitHub Pages instead of opening index.html directly.</p>');console.error(e)}
 document.querySelectorAll('.nav').forEach(el=>el.addEventListener('click',()=>switchPage(el.dataset.page)));
 document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>switchPage(el.dataset.go)));
 $('#range').addEventListener('change',drawOverview);$('#series').addEventListener('change',drawOverview);
 $('#case-select').addEventListener('change',()=>{const c=replayCases[$('#case-select').value];$('#cutoff').innerHTML=c.cutoffs.map(m=>`<option value="${m}" ${m===c.defaultCutoff?'selected':''}>${monthName(m)}</option>`).join('');revealed=false;drawReplay()});
 $('#cutoff').addEventListener('change',()=>{revealed=false;drawReplay()});
 $('#reveal').addEventListener('click',()=>{revealed=true;drawReplay()});
 $('#reset-replay').addEventListener('click',()=>{revealed=false;drawReplay()});
 $('#signal-filter').addEventListener('change',drawSignals);
 $('#download').addEventListener('click',exportCsv);
}
init();
