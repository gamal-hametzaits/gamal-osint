export const HTML = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>עוקב - חיפוש נוכחות ברשת</title>
<style>
:root{
  --paper:#ece5d3;--paper-deep:#d8cdb2;--ink:#18231d;--muted:#667066;--olive:#33483a;
  --olive-2:#516553;--signal:#e45b32;--amber:#d9a62e;--green:#287653;--line:#9e9b86;--white:#fffdf4;
}
*{box-sizing:border-box;margin:0;padding:0}
html{background:#1d2a22}
body{color:var(--ink);font-family:"Courier New",ui-monospace,monospace;min-height:100vh;background:
  linear-gradient(90deg,rgba(51,72,58,.06) 1px,transparent 1px),
  linear-gradient(rgba(51,72,58,.06) 1px,transparent 1px),var(--paper);background-size:24px 24px}
body::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.2;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(24,35,29,.08) 4px);z-index:50}
.wrap{max-width:960px;margin:0 auto;padding:0 22px 90px;position:relative}
.wrap::before{content:"תיק חקירה / OPEN SOURCE";display:block;background:var(--olive);color:#dfe8d8;margin:0 -22px 28px;padding:10px 22px;font-size:11px;letter-spacing:3px;text-align:left;direction:ltr}
h1{font-size:clamp(44px,8vw,76px);line-height:.92;font-weight:900;letter-spacing:-4px;position:relative;display:inline-block}
h1::after{content:"PUBLIC DATA";position:absolute;top:-9px;left:-78px;border:2px solid var(--signal);color:var(--signal);font:700 10px/1 "Courier New";letter-spacing:1px;padding:7px 9px;transform:rotate(-7deg)}
h1 b{color:var(--signal);font-weight:900;font-size:.55em;letter-spacing:0;display:block;margin-top:10px;text-align:left}
.sub{color:var(--olive);font-size:14px;margin-top:21px;line-height:1.8;max-width:700px;border-right:5px solid var(--amber);padding:4px 16px 4px 0;font-weight:700}
.tabs{display:flex;gap:0;margin:34px 0 0;border:2px solid var(--olive)}
.tab{flex:1;padding:14px;border:0;border-left:1px solid var(--olive);background:transparent;color:var(--olive);cursor:pointer;font-size:14px;text-align:center;font-weight:800;letter-spacing:.2px;transition:background .18s,color .18s}
.tab:last-child{border-left:0}.tab:hover{background:rgba(51,72,58,.1)}
.tab.on{background:var(--olive);color:var(--white);box-shadow:inset 0 -5px 0 var(--amber)}
form{display:flex;gap:0;border:2px solid var(--olive);border-top:0;background:var(--white);padding:12px}
input{flex:1;background:transparent;border:0;border-bottom:2px solid var(--olive);color:var(--ink);border-radius:0;padding:14px 12px;font:700 17px "Courier New",monospace;outline:none}
input:focus{border-color:var(--signal);background:rgba(228,91,50,.05)}
button.go{background:var(--signal);color:#fff;border:2px solid var(--ink);padding:0 28px;font:900 15px "Courier New",monospace;cursor:pointer;box-shadow:4px 4px 0 var(--ink);transition:transform .12s,box-shadow .12s}
button.go:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink)}button.go:active{transform:translate(3px,3px);box-shadow:1px 1px 0 var(--ink)}button.go:disabled{opacity:.5}
.note{margin-top:18px;color:#4f584f;font-size:12px;line-height:1.8;border:1px dashed var(--olive-2);padding:14px 18px;background:rgba(255,253,244,.6);position:relative}
.note::before{content:"מקרא ראיות";position:absolute;top:-10px;right:14px;background:var(--paper);padding:0 8px;color:var(--olive);font-weight:900}
.spin{margin:28px 0;color:var(--olive);font-size:14px;font-weight:900;border:2px solid var(--olive);padding:22px;position:relative;overflow:hidden;background:var(--white)}
.spin::after{content:"";position:absolute;inset:0 auto 0 -20%;width:18%;background:linear-gradient(90deg,transparent,rgba(217,166,46,.48),transparent);animation:scan 1.35s linear infinite}@keyframes scan{to{left:110%}}
.summary{margin:28px 0 12px;font-size:14px;color:var(--ink);background:var(--olive);padding:15px 18px;color:#fff;border-right:8px solid var(--amber)}
.summary b{color:#ffe08c}
h2{font-size:12px;color:var(--olive);font-weight:900;margin:30px 0 10px;border-bottom:2px solid var(--olive);padding-bottom:8px;letter-spacing:.4px}
.card{display:grid;grid-template-columns:120px 95px 1fr auto;align-items:center;gap:12px;background:rgba(255,253,244,.8);border:1px solid var(--line);border-right:6px solid var(--olive);padding:13px 15px;margin-bottom:8px;text-decoration:none;color:var(--ink);box-shadow:2px 3px 0 rgba(51,72,58,.16);transition:transform .15s,border-color .15s,background .15s}
.card:nth-of-type(even){transform:translateX(-7px)}.card:hover{transform:translateX(-4px);border-color:var(--signal);background:var(--white)}
.card .pname{font-weight:900;font-size:14px}.card .cat{color:var(--muted);font-size:10px;text-transform:uppercase}.card .u{direction:ltr;text-align:left;color:var(--muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.badge{font-size:10px;padding:5px 9px;border:2px solid;font-weight:900;transform:rotate(-2deg);background:var(--paper);text-transform:uppercase}
.b-verified{color:var(--green);border-color:var(--green)}.b-likely,.b-weak{color:#8a6310;border-color:var(--amber)}.b-weak{opacity:.72}.b-blocked,.b-notfound{color:var(--muted);border-color:var(--line)}
.res{border:1px solid var(--line);border-right:6px solid var(--olive);padding:14px 16px;margin-bottom:9px;background:rgba(255,253,244,.82)}
.res a{color:var(--ink);font-size:13px;font-weight:900;text-decoration:underline;text-decoration-color:var(--amber);text-decoration-thickness:3px;display:block;direction:ltr;text-align:left}.res a:hover{color:var(--signal)}
.res .snip{color:var(--muted);font-size:11px;margin-top:8px;line-height:1.7}
.dork{display:inline-block;margin:0 0 9px 7px;padding:8px 12px;border:1px solid var(--olive);color:var(--olive);font-size:11px;font-weight:900;text-decoration:none;background:transparent}.dork:hover{color:#fff;background:var(--olive)}
details{margin-top:8px;border-top:1px dashed var(--line)}summary{cursor:pointer;color:var(--muted);font-size:12px;padding:12px 0;font-weight:900}
footer{margin-top:58px;color:#596359;font-size:10px;line-height:1.8;border-top:4px double var(--olive);padding-top:16px;max-width:720px}
footer::after{content:"END OF FILE";display:block;margin-top:16px;color:var(--signal);letter-spacing:4px;font-weight:900;direction:ltr;text-align:left}
@media(max-width:700px){.wrap{padding-inline:14px}.wrap::before{margin-inline:-14px;padding-inline:14px}h1::after{display:none}form{flex-direction:column;gap:12px}button.go{height:48px}.card{grid-template-columns:1fr auto}.card .cat,.card .u{grid-column:1/-1}.card:nth-of-type(even){transform:none}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<div class="wrap">
<h1>עוּקָב <b>OSINT</b></h1>
<div class="sub">חיפוש נוכחות פומבית של שם משתמש או שם מלא ברשתות, בפלטפורמות ובאינטרנט הפתוח.<br>מקורות פתוחים בלבד. בלי התחברות, בלי אינטראקציה, בלי זיהוי פנים.</div>

<div class="tabs">
<div class="tab on" id="tab-u" onclick="setTab('u')">חיפוש לפי יוזר</div>
<div class="tab" id="tab-c" onclick="setTab('c')">שם / הקשר חופשי</div>
</div>

<form id="f-u" onsubmit="return goUser(event)">
<input id="in-u" dir="ltr" placeholder="username - בלי @" autocomplete="off">
<button class="go" type="submit">חפש</button>
</form>
<form id="f-c" style="display:none" onsubmit="return goCtx(event)">
<input id="in-c" placeholder='שם מלא, כינוי, עיר - למשל: נועה קרני נתניה' autocomplete="off">
<button class="go" type="submit">חפש</button>
</form>

<div class="note">איך לקרוא תוצאות: <b style="color:var(--green)">מאומת</b> = נבדק מול API רשמי. <b style="color:var(--amber)">סביר</b> = הדף קיים אך ייתכנן חיובי-כוזב (אותו יוזר, אדם אחר). <b style="color:var(--grey)">חסום</b> = הרשת חוסמת בדיקה אוטומטית - נסו את הקישור הידני. "לא נמצא" = הפרופיל לא קיים תחת היוזר הזה, לא הוכחה שהאדם לא שם.</div>

<div id="out"></div>

<footer>רץ על Cloudflare Workers (תוכנית חינמית, ~100 אלף בקשות ביום). כל בדיקה פונה לעד 42 אתרים - חלקם חוסמים בקשות משרתים, ולכן תוצאות "חסום" צפויות. המקור מלא ב-GitHub. אין שמירה של חיפושים בשרת.</footer>
</div>
<script>
function setTab(t){
  document.getElementById('tab-u').classList.toggle('on', t==='u');
  document.getElementById('tab-c').classList.toggle('on', t==='c');
  document.getElementById('f-u').style.display = t==='u'?'flex':'none';
  document.getElementById('f-c').style.display = t==='c'?'flex':'none';
}
const out = document.getElementById('out');
const badge = c => ({verified:'<span class="badge b-verified">מאומת</span>',likely:'<span class="badge b-likely">סביר</span>',weak:'<span class="badge b-weak">חלש</span>',blocked:'<span class="badge b-blocked">חסום</span>'}[c]||'');
const esc = s => s.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function card(r){
  return '<a class="card" target="_blank" rel="noopener" href="'+r.url+'"><span class="pname">'+esc(r.name)+'</span><span class="cat">'+esc(r.cat)+'</span><span class="u">'+esc(r.url)+'</span>'+badge(r.confidence)+'</a>';
}
function dorks(list){
  return '<h2>חיפושים ידניים מוכנים (נפתח בגוגל/בינג)</h2>'+list.map(d=>'<a class="dork" target="_blank" rel="noopener" href="'+d.url+'">'+esc(d.label)+'</a>').join('');
}
async function goUser(e){
  e.preventDefault();
  const u = document.getElementById('in-u').value.trim().replace(/^@/,'');
  if(!u) return false;
  out.innerHTML = '<div class="spin">סורק 42 פלטפורמות... זה יכול לקחת עד 15 שניות.</div>';
  try{
    const r = await fetch('/api/username?u='+encodeURIComponent(u));
    const d = await r.json();
    if(d.error){ out.innerHTML = '<div class="spin">יותר מדי חיפושים ברצף - נסו שוב בעוד דקה.</div>'; return false; }
    let h = '<div class="summary">היוזר <b dir="ltr">'+esc(d.username)+'</b>: '+d.found.length+' נמצאו, '+d.notfound.length+' לא קיימים, '+d.unknown.length+' לא ניתן לבדוק (מתוך '+d.checked+').</div>';
    const v = d.found.filter(x=>x.confidence==='verified'), l = d.found.filter(x=>x.confidence==='likely'), w = d.found.filter(x=>x.confidence==='weak');
    if(v.length) h += '<h2>נמצא - מאומת</h2>'+v.map(card).join('');
    if(l.length) h += '<h2>נמצא - סביר (בדקו ידנית שזה האדם הנכון)</h2>'+l.map(card).join('');
    if(w.length) h += '<h2>אינדיקציה חלשה בלבד</h2>'+w.map(card).join('');
    if(d.unknown.length) h += '<h2>לא ניתן לבדוק אוטומטית - לחצו לבדיקה ידנית</h2>'+d.unknown.map(card).join('');
    h += '<details><summary>לא נמצא ('+d.notfound.length+')</summary>'+d.notfound.map(card).join('')+'</details>';
    h += dorks(d.dorks);
    out.innerHTML = h;
  }catch(err){ out.innerHTML = '<div class="spin">שגיאה בחיפוש - נסו שוב.</div>'; }
  return false;
}
async function goCtx(e){
  e.preventDefault();
  const q = document.getElementById('in-c').value.trim();
  if(!q) return false;
  out.innerHTML = '<div class="spin">מחפש ברשת הפתוחה...</div>';
  try{
    const r = await fetch('/api/context?q='+encodeURIComponent(q));
    const d = await r.json();
    if(d.error){ out.innerHTML = '<div class="spin">יותר מדי חיפושים ברצף - נסו שוב בעוד דקה.</div>'; return false; }
    let h = '<div class="summary">תוצאות עבור <b>'+esc(d.query)+'</b>'+(d.engine?' (מנוע: '+d.engine+')':'')+'</div>';
    if(d.results.length){
      h += '<h2>תוצאות מהאינטרנט הפתוח</h2>'+d.results.map(x=>'<div class="res"><a target="_blank" rel="noopener" href="'+x.url+'">'+esc(x.title)+'</a>'+(x.snippet?'<div class="snip">'+esc(x.snippet)+'</div>':'')+'</div>').join('');
    } else {
      h += '<div class="note">המנוע החינמי לא החזיר תוצאות אוטומטיות (קורה לפעמים מחסימת שרתים). הקישורים הידניים למטה עובדים תמיד.</div>';
    }
    h += dorks(d.dorks);
    out.innerHTML = h;
  }catch(err){ out.innerHTML = '<div class="spin">שגיאה בחיפוש - נסו שוב.</div>'; }
  return false;
}
</script>
</body>
</html>`;
