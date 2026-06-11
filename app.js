
window.onerror=function(m,s,l){var r=document.getElementById('root')||document.body;r.innerHTML='<pre style="color:#f43f5e;padding:16px;white-space:pre-wrap;font-size:13px">JS error:\n'+m+'\n(line '+l+')</pre>';};

/* ====== ДАННЫЕ (из diagnostic_drobi.json, Методист · cond_voice) ======
   opts: массив {t:текст, ok:1 у правильного}. Порядок показа перемешивается. */
const DATA = {
  intro:"Давай честно глянем, как у тебя с дробями? 14 вопросов, минут семь. Без оценок в дневник — только ты и карта: где уже крут, а что стоит подтянуть. 🧠📊",
  cta_url:"https://vk.me/club238196266",
  questions:[
    {id:"q01",theme:"Смысл и виды",ref:"Урок 1",cond:"Какая часть полоски закрашена?",svg:"pie8_3",
     opts:[{t:"3/8",ok:1},{t:"3/5"},{t:"5/8"},{t:"8/3"}],
     explain:{type:"bar-read",n:8,k:3,note:"Верх дроби — сколько закрашено, низ — на сколько долей делили."}},
    {id:"q02",theme:"Смысл и виды",ref:"Урок 1",cond:"Одна из этих дробей — неправильная. Найди её.",
     opts:[{t:"7/5",ok:1},{t:"3/4"},{t:"5/8"},{t:"2/9"}]},
    {id:"q03",theme:"Сокращение",ref:"Урок 2",cond:"Запиши 6/8 короче — сократи.",
     opts:[{t:"3/4",ok:1},{t:"2/4"},{t:"6/8"},{t:"1/2"}],
     explain:{type:"reduce-circle",from:[6,8],to:[3,4],note:"Закрашено столько же — просто кусков стало крупнее. 6/8 = 3/4."}},
    {id:"q04",theme:"Сокращение",ref:"Урок 2",cond:"Сократи 12/18 до конца, не бросай на полпути.",
     opts:[{t:"2/3",ok:1},{t:"6/9"},{t:"4/6"},{t:"1/2"}]},
    {id:"q05",theme:"Сравнение",ref:"Урок 2",cond:"Два повербанка: один заряжен на 3/5, другой на 5/8. У какого заряд больше?",
     opts:[{t:"5/8",ok:1},{t:"3/5"},{t:"равны"},{t:"нельзя сравнить"}]},
    {id:"q06",theme:"Сравнение",ref:"Урок 2",cond:"Кусок в 1/4 пиццы или кусок в 1/6 — какой больше?",
     opts:[{t:"1/4",ok:1},{t:"1/6"},{t:"равны"},{t:"нельзя сравнить"}],
     explain:{type:"compare-circles",a:[1,4],b:[1,6],note:"Чем больше кусков — тем мельче каждый. 1/4 крупнее 1/6."}},
    {id:"q07",theme:"Сложение и вычитание",ref:"Урок 3",cond:"Сколько будет 1/5 + 2/5?",
     opts:[{t:"3/5",ok:1},{t:"3/10"},{t:"3/25"},{t:"2/5"}],
     explain:{type:"bar-add",n:5,k1:1,k2:2,note:"Доли одного размера — складываем верх, низ не трогаем. 1/5 + 2/5 = 3/5."}},
    {id:"q08",theme:"Сложение и вычитание",ref:"Урок 3",cond:"Утром прошёл 1/2 пути, после обеда ещё 1/3. Какая часть пути позади?",
     opts:[{t:"5/6",ok:1},{t:"2/5"},{t:"2/6"},{t:"1/5"}]},
    {id:"q09",theme:"Умножение и деление",ref:"Урок 4",cond:"В банке осталось 3/4 сока. Ты выпил половину от этого остатка. Какая часть полной банки оказалась у тебя в стакане?",
     opts:[{t:"3/8",ok:1},{t:"4/6"},{t:"3/4"},{t:"2/6"}]},
    {id:"q10",theme:"Умножение и деление",ref:"Урок 4",cond:"У тебя 3/4 пиццы. Одна порция — это 1/2 пиццы. Сколько порций выйдет?",
     opts:[{t:"3/2",ok:1},{t:"3/8"},{t:"2/3"},{t:"1/2"}]},
    {id:"q11",theme:"Десятичные",ref:"Урок 5",cond:"Переведи 3/4 в десятичную дробь.",
     opts:[{t:"0,75",ok:1},{t:"0,34"},{t:"0,43"},{t:"3,4"}]},
    {id:"q12",theme:"Десятичные",ref:"Урок 5",cond:"На одной карте 0,5 ₽, на другой 0,45 ₽. Где денег больше?",
     opts:[{t:"0,5",ok:1},{t:"0,45"},{t:"равны"},{t:"нельзя сравнить"}]},
    {id:"q13",theme:"Проценты",ref:"Урок 6",cond:"Скидка 25% на товар за 80 ₽. Какова сумма скидки в рублях?",
     opts:[{t:"20",ok:1},{t:"40"},{t:"25"},{t:"2"}],
     explain:{type:"percent-circle",percent:25,whole:80,unit:" ₽",note:"25% — это четверть. Делим 80 на 4 равных куска: один кусок = 20 ₽."}},
    {id:"q14",theme:"Проценты",ref:"Урок 6",cond:"Толстовка стоит 1000 ₽, скидка 20%. Сколько заплатишь на кассе?",
     opts:[{t:"800 ₽",ok:1},{t:"980 ₽"},{t:"200 ₽"},{t:"750 ₽"}]},
  ],
  senseQ:["q05","q06","q12"],
};
const THEMES=["Смысл и виды","Сокращение","Сравнение","Сложение и вычитание","Умножение и деление","Десятичные","Проценты"];
const KEYS=["A","B","C","D"];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ====== СОСТОЯНИЕ ====== */
let idx=0; const answers={}; // id -> {ok:bool}
const root=document.getElementById('root');
const topEl=document.getElementById('top');
const fill=document.getElementById('fill');
const count=document.getElementById('count');

const svgPie8 = `<svg width="220" height="92" viewBox="0 0 220 92" xmlns="http://www.w3.org/2000/svg">
  ${Array.from({length:8}).map((_,i)=>{
    const x=6+i*26, filled=i<3;
    return `<rect x="${x}" y="6" width="25" height="80" rx="4"
      fill="${filled?'rgba(168,85,247,.85)':'rgba(255,255,255,.05)'}"
      stroke="${filled?'#c084fc':'#2a2a4d'}" stroke-width="2"
      ${filled?'filter="url(#g)"':''}/>`;
  }).join('')}
  <defs><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
</svg>`;

/* ====== ОБЪЯСНЯЛКИ (живая математика, авто-анимация, после ответа) ======
   Появляются ПОСЛЕ выбора ответа — диагностика измеряет кнопками, объяснялка учит.
   Геометрия долей/секторов портирована из живой_пирог. Без Pointer Events. */
const EX_FILL='rgba(168,85,247,.85)', EX_EMPTY='rgba(255,255,255,.05)';
const EX_SON='#c084fc', EX_SOFF='#2a2a4d';

function exPol(cx,cy,r,a){return [cx+r*Math.cos(a), cy+r*Math.sin(a)];}
function exSector(cx,cy,r,i,n){
  if(n===1) return `M${cx-r},${cy} A${r},${r} 0 1 1 ${cx+r},${cy} A${r},${r} 0 1 1 ${cx-r},${cy} Z`;
  const step=2*Math.PI/n, a0=-Math.PI/2+i*step, a1=a0+step;
  const [x0,y0]=exPol(cx,cy,r,a0),[x1,y1]=exPol(cx,cy,r,a1);
  return `M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${step>Math.PI?1:0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`;
}
function exGlow(uid){return `<defs><filter id="exg${uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;}

function exCircleSVG(uid,n,size){
  const r=size/2-6, c=size/2;
  let s=`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${exGlow(uid)}`;
  for(let i=0;i<n;i++) s+=`<path data-c="${uid}" data-i="${i}" d="${exSector(c,c,r,i,n)}" fill="${EX_EMPTY}" stroke="${EX_SOFF}" stroke-width="2" stroke-linejoin="round"/>`;
  s+=`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#4a3a78" stroke-width="2" opacity=".5"/></svg>`;
  return s;
}
function exBarSVG(uid,n,w,h){
  const gap=4, cw=(w-gap*(n-1))/n;
  let s=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${exGlow(uid)}`;
  for(let i=0;i<n;i++){const x=i*(cw+gap);s+=`<rect data-c="${uid}" data-i="${i}" x="${x.toFixed(1)}" y="0" width="${cw.toFixed(1)}" height="${h}" rx="5" fill="${EX_EMPTY}" stroke="${EX_SOFF}" stroke-width="2"/>`;}
  s+=`</svg>`;return s;
}
function exLight(host,uid,i){
  const el=host.querySelector(`[data-c="${uid}"][data-i="${i}"]`); if(!el) return;
  el.setAttribute('fill',EX_FILL); el.setAttribute('stroke',EX_SON); el.setAttribute('filter',`url(#exg${uid})`);
}
function exFrac(k,n){return `<span class="exf"><b>${k}</b><i></i><b>${n}</b></span>`;}

// последовательность шагов с задержкой; гасим, если экран сменился
function exSeq(host,steps){
  let t=0;
  steps.forEach(step=>{ t+=step.wait||0; setTimeout(()=>{ if(host.isConnected) step.run(); }, t); });
}

function renderExplain(spec,host){
  const uid=Math.random().toString(36).slice(2,7);
  if(spec.type==='bar-read'){
    const {n,k}=spec;
    host.innerHTML=`<div class="exhead">👀 пощупай, почему</div>
      <div class="exfig">${exBarSVG(uid,n,260,52)}</div>
      <div class="exlbl" id="exl">${exFrac(0,n)}</div>
      <div class="exnote">${spec.note}</div>`;
    const lbl=host.querySelector('#exl');
    const steps=[];
    for(let j=1;j<=k;j++) steps.push({wait:520,run:()=>{exLight(host,uid,j-1);if(lbl)lbl.innerHTML=exFrac(j,n);}});
    exSeq(host,steps);
  }
  else if(spec.type==='bar-add'){
    const {n,k1,k2}=spec;
    host.innerHTML=`<div class="exhead">👀 пощупай, почему</div>
      <div class="exfig">${exBarSVG(uid,n,260,52)}</div>
      <div class="exlbl" id="exl">${exFrac(0,n)}</div>
      <div class="exnote">${spec.note}</div>`;
    const lbl=host.querySelector('#exl');
    const steps=[];
    for(let j=1;j<=k1;j++) steps.push({wait:520,run:()=>{exLight(host,uid,j-1);if(lbl)lbl.innerHTML=exFrac(j,n);}});
    for(let j=1;j<=k2;j++) steps.push({wait:520,run:()=>{exLight(host,uid,k1+j-1);if(lbl)lbl.innerHTML=exFrac(k1+j,n);}});
    exSeq(host,steps);
  }
  else if(spec.type==='reduce-circle'){
    const [kf,nf]=spec.from, [kt,nt]=spec.to;
    host.innerHTML=`<div class="exhead">👀 пощупай, почему</div>
      <div class="exfig"><div class="exstage" id="exs">${exCircleSVG(uid,nf,170)}</div></div>
      <div class="exlbl" id="exl">${exFrac(kf,nf)}</div>
      <div class="exnote">${spec.note}</div>`;
    const stage=host.querySelector('#exs'), lbl=host.querySelector('#exl');
    const steps=[];
    for(let j=0;j<kf;j++) steps.push({wait:300,run:()=>exLight(host,uid,j)});
    // перегруппировка: тот же сектор, но крупнее доли
    steps.push({wait:900,run:()=>{
      if(!stage) return;
      const uid2=uid+'b';
      stage.style.opacity=0;
      setTimeout(()=>{ if(!host.isConnected) return;
        stage.innerHTML=exCircleSVG(uid2,nt,170); stage.style.opacity=1;
        for(let j=0;j<kt;j++) setTimeout(()=>exLight(host,uid2,j),120*(j+1));
        if(lbl) lbl.innerHTML=`${exFrac(kf,nf)} <span class="exeq">=</span> ${exFrac(kt,nt)}`;
      },260);
    }});
    exSeq(host,steps);
  }
  else if(spec.type==='compare-circles'){
    const [ka,na]=spec.a, [kb,nb]=spec.b;
    host.innerHTML=`<div class="exhead">👀 пощупай, почему</div>
      <div class="exfig excmp">
        <div class="excol"><div class="exstage" id="exA">${exCircleSVG(uid+'a',na,150)}</div><div class="exlbl">${exFrac(ka,na)}</div></div>
        <div class="excol"><div class="exstage" id="exB">${exCircleSVG(uid+'b',nb,150)}</div><div class="exlbl">${exFrac(kb,nb)}</div></div>
      </div>
      <div class="exnote">${spec.note}</div>`;
    exSeq(host,[
      {wait:500,run:()=>{for(let j=0;j<ka;j++) exLight(host,uid+'a',j);}},
      {wait:600,run:()=>{for(let j=0;j<kb;j++) exLight(host,uid+'b',j);}},
    ]);
  }
  else if(spec.type==='percent-circle'){
    const {percent,whole,unit}=spec;
    const n=Math.round(100/percent), val=whole*percent/100;
    host.innerHTML=`<div class="exhead">👀 пощупай, почему</div>
      <div class="exfig">${exCircleSVG(uid,n,170)}</div>
      <div class="exlbl" id="exl">${percent}% = ${exFrac(1,n)}</div>
      <div class="exnote">${spec.note}</div>`;
    const lbl=host.querySelector('#exl');
    exSeq(host,[
      {wait:600,run:()=>{exLight(host,uid,0);}},
      {wait:700,run:()=>{if(lbl)lbl.innerHTML=`${percent}% = ${exFrac(1,n)} = <b class="exval">${val}${unit||''}</b>`;}},
    ]);
  }
}

/* ====== ЭКРАНЫ ====== */
function intro(){
  topEl.classList.add('hidden');
  root.innerHTML=`<div class="screen">
    <div class="kicker">Диагностика · 7 минут</div>
    <h1>Дроби: где ты сейчас?</h1>
    <p class="lead">${DATA.intro}</p>
    <div class="btn-row">
      <button class="btn" id="go">Поехали 🚀</button>
      <button class="btn ghost" id="later">Чуть позже</button>
    </div>
  </div>`;
  document.getElementById('go').onclick=()=>{idx=0;render();};
  document.getElementById('later').onclick=()=>{root.innerHTML=`<div class="screen"><p class="lead">Окей! Возвращайся, когда будешь готов 💜</p></div>`;};
}

function render(){
  const q=DATA.questions[idx];
  topEl.classList.remove('hidden');
  fill.style.width=((idx)/DATA.questions.length*100)+'%';
  count.textContent=`${idx} / ${DATA.questions.length}`;

  // перемешиваем варианты один раз на вопрос (правильный — на случайной позиции)
  const shown = q._shown || (q._shown = shuffle(q.opts));

  const fig = q.svg==='pie8_3' ? `<div class="fig">${svgPie8}</div>` : '';
  root.innerHTML=`<div class="screen" key="${q.id}">
    <div class="q">${q.theme} · вопрос ${idx+1}</div>
    <p class="cond">${q.cond}</p>
    ${fig}
    <div class="opts" id="opts">
      ${shown.map((o,i)=>`<button class="opt" data-i="${i}"><span class="key">${KEYS[i]}</span><span>${o.t}</span></button>`).join('')}
    </div>
    <div class="explain hidden" id="explain"></div>
    <div class="next"><button class="btn hidden" id="next">${idx<DATA.questions.length-1?'Дальше →':'Узнать результат ✨'}</button></div>
  </div>`;

  const opts=[...document.querySelectorAll('.opt')];
  opts.forEach(o=>o.onclick=()=>{
    if(answers[q.id]) return;
    const chosen=shown[+o.dataset.i]; answers[q.id]={ok:!!chosen.ok};
    opts.forEach(x=>{
      x.classList.add('locked');
      const oo=shown[+x.dataset.i];
      if(oo.ok) x.classList.add('correct');
      if(x===o && !chosen.ok) x.classList.add('wrong');
    });
    fill.style.width=((idx+1)/DATA.questions.length*100)+'%';
    count.textContent=`${idx+1} / ${DATA.questions.length}`;
    document.getElementById('next').classList.remove('hidden');
    // живая объяснялка — после ответа (измерение уже зафиксировано кнопкой)
    if(q.explain){
      const host=document.getElementById('explain');
      if(host){ renderExplain(q.explain,host); requestAnimationFrame(()=>host.classList.remove('hidden')); }
    }
  });
  document.getElementById('next').onclick=()=>{
    idx++;
    if(idx>=DATA.questions.length){result();}
    else render();
  };
}

/* ====== РЕЗУЛЬТАТ (профиль, не балл) ====== */
function isCorrect(id){return !!(answers[id]&&answers[id].ok);}

function result(){
  topEl.classList.add('hidden');
  const byTheme={};
  DATA.questions.forEach(q=>{(byTheme[q.theme]=byTheme[q.theme]||[]).push(isCorrect(q.id));});
  const status={};
  THEMES.forEach(t=>{const a=byTheme[t]||[];const c=a.filter(Boolean).length;status[t]=c===a.length?'ok':(c===0?'gap':'warn');});

  const strong=THEMES.filter(t=>status[t]==='ok');
  const gaps=THEMES.filter(t=>status[t]==='gap'||status[t]==='warn');

  const senseMiss=DATA.senseQ.filter(id=>!isCorrect(id)).length;
  const mechMiss=DATA.questions.filter(q=>!DATA.senseQ.includes(q.id)&&!isCorrect(q.id)).length;
  let verdict;
  if(senseMiss===0&&mechMiss>0) verdict="Чувствуешь число, но техника местами хромает — база есть, шлифуем приёмы.";
  else if(mechMiss===0&&senseMiss>0) verdict="Считаешь по правилам, но не всегда чувствуешь — легко не заметить абсурдный ответ.";
  else if(senseMiss>0&&mechMiss>0) verdict="Начинаем с фундамента — со смысла дроби, дальше техника.";
  else verdict="Сильная база и чувство числа — берём темп повыше! 🔥";

  const total=DATA.questions.filter(q=>isCorrect(q.id)).length;

  const mapHtml=THEMES.map(t=>`<div class="theme">
      <span class="dot ${status[t]}"></span>
      <span class="nm">${t}</span>
      <span class="st">${status[t]==='ok'?'крепко':status[t]==='warn'?'шатко':'пробел'}</span>
    </div>`).join('');

  root.innerHTML=`<div class="screen">
    <div class="kicker">Твоя карта · ${total} из 14</div>
    <h1>Вот где ты сейчас</h1>
    <div class="legend">
      <span><span class="dot ok"></span>крепко</span>
      <span><span class="dot warn"></span>шатко</span>
      <span><span class="dot gap"></span>пробел</span>
    </div>
    <div class="map">${mapHtml}</div>
    <div class="vcard">${verdict}</div>
    ${strong.length?`<div class="vcard">💪 Крепко держишь: <b>${strong.join(', ')}</b>.</div>`:''}
    ${gaps.length?`<div class="vcard">🎯 Подтянем: <b>${gaps.join(', ')}</b> — это закрывается за пару недель на спринте.</div>`:''}
    <div class="btn-row" style="margin-top:8px">
      <button class="btn" id="cta">Хочу разобрать на пробном 🎯</button>
      <button class="btn ghost" id="again">Пройти ещё раз</button>
    </div>
    <div class="note">Тест ничего не сохраняет — это только твоя картинка уровня.</div>
  </div>`;
  document.getElementById('again').onclick=()=>{DATA.questions.forEach(q=>delete q._shown);Object.keys(answers).forEach(k=>delete answers[k]);idx=0;intro();};
  document.getElementById('cta').onclick=()=>{window.open(DATA.cta_url,'_blank');};
}

intro();
