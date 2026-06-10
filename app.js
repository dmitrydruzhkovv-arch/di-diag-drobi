
window.onerror=function(m,s,l){var r=document.getElementById('root')||document.body;r.innerHTML='<pre style="color:#f43f5e;padding:16px;white-space:pre-wrap;font-size:13px">JS error:\n'+m+'\n(line '+l+')</pre>';};

/* ====== ДАННЫЕ (из diagnostic_drobi.json, Методист · cond_voice) ======
   opts: массив {t:текст, ok:1 у правильного}. Порядок показа перемешивается. */
const DATA = {
  intro:"Давай честно глянем, как у тебя с дробями? 14 вопросов, минут семь. Без оценок в дневник — только ты и карта: где уже крут, а что стоит подтянуть. 🧠📊",
  cta_url:"https://vk.me/club238196266",
  questions:[
    {id:"q01",theme:"Смысл и виды",ref:"Урок 1",cond:"Какая часть полоски закрашена?",svg:"pie8_3",
     opts:[{t:"3/8",ok:1},{t:"3/5"},{t:"5/8"},{t:"8/3"}]},
    {id:"q02",theme:"Смысл и виды",ref:"Урок 1",cond:"Одна из этих дробей — неправильная. Найди её.",
     opts:[{t:"7/5",ok:1},{t:"3/4"},{t:"5/8"},{t:"2/9"}]},
    {id:"q03",theme:"Сокращение",ref:"Урок 2",cond:"Запиши 6/8 короче — сократи.",
     opts:[{t:"3/4",ok:1},{t:"2/4"},{t:"6/8"},{t:"1/2"}]},
    {id:"q04",theme:"Сокращение",ref:"Урок 2",cond:"Сократи 12/18 до конца, не бросай на полпути.",
     opts:[{t:"2/3",ok:1},{t:"6/9"},{t:"4/6"},{t:"1/2"}]},
    {id:"q05",theme:"Сравнение",ref:"Урок 2",cond:"Два повербанка: один заряжен на 3/5, другой на 5/8. У какого заряд больше?",
     opts:[{t:"5/8",ok:1},{t:"3/5"},{t:"равны"},{t:"нельзя сравнить"}]},
    {id:"q06",theme:"Сравнение",ref:"Урок 2",cond:"Кусок в 1/4 пиццы или кусок в 1/6 — какой больше?",
     opts:[{t:"1/4",ok:1},{t:"1/6"},{t:"равны"},{t:"нельзя сравнить"}]},
    {id:"q07",theme:"Сложение и вычитание",ref:"Урок 3",cond:"Сколько будет 1/5 + 2/5?",
     opts:[{t:"3/5",ok:1},{t:"3/10"},{t:"3/25"},{t:"2/5"}]},
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
     opts:[{t:"20",ok:1},{t:"40"},{t:"25"},{t:"2"}]},
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
