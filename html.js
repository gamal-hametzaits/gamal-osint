export const HTML = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>עוקב - חיפוש נוכחות ברשת</title>
<style>
:root{--bg:#0b0b0b;--panel:#141414;--line:#242424;--text:#ece8e1;--dim:#8a857c;--red:#e10600;--green:#2fbf71;--amber:#e8a13a;--grey:#6b675f}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif;min-height:100vh}
.wrap{max-width:760px;margin:0 auto;padding:28px 18px 80px}
h1{font-size:34px;font-weight:200;letter-spacing:.5px}
h1 b{color:var(--red);font-weight:600}
.sub{color:var(--dim);font-size:13px;margin-top:6px;line-height:1.7}
.tabs{display:flex;gap:8px;margin:26px 0 14px}
.tab{flex:1;padding:12px;border:1px solid var(--line);background:var(--panel);color:var(--dim);border-radius:10px;cursor:pointer;font-size:15px;text-align:center}
.tab.on{border-color:var(--red);color:var(--text)}
form{display:flex;gap:8px}
input{flex:1;background:var(--panel);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:14px;font-size:16px;outline:none}
input:focus{border-color:var(--red)}
button.go{background:var(--red);color:#fff;border:0;border-radius:10px;padding:0 22px;font-size:16px;cursor:pointer}
button.go:disabled{opacity:.5}
.note{margin-top:14px;color:var(--dim);font-size:12px;line-height:1.8;border:1px dashed var(--line);border-radius:10px;padding:10px 14px}
.spin{margin:30px 0;color:var(--dim);font-size:14px}
.summary{margin:24px 0 10px;font-size:15px;color:var(--text)}
.summary b{color:var(--red)}
h2{font-size:13px;color:var(--dim);font-weight:400;margin:22px 0 8px;border-bottom:1px solid var(--line);padding-bottom:6px}
.card{display:flex;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:8px;text-decoration:none;color:var(--text)}
.card:hover{border-color:#3a3a3a}
.card .pname{flex:0 0 auto;min-width:90px;font-size:14px}
.card .cat{color:var(--dim);font-size:11px}
.card .u{flex:1;direction:ltr;text-align:left;color:var(--dim);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.badge{flex:0 0 auto;font-size:11px;padding:3px 9px;border-radius:20px;border:1px solid}
.b-verified{color:var(--green);border-color:var(--green)}
.b-likely{color:var(--amber);border-color:var(--amber)}
.b-weak{color:var(--amber);border-color:var(--amber);opacity:.7}
.b-blocked{color:var(--grey);border-color:var(--grey)}
.b-notfound{color:var(--grey);border-color:var(--line)}
.res{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:8px;background:var(--panel)}
.res a{color:var(--text);font-size:14px;text-decoration:none;display:block;direction:ltr;text-align:left}
.res a:hover{color:var(--red)}
.res .snip{color:var(--dim);font-size:12px;margin-top:6px;line-height:1.6}
.dork{display:inline-block;margin:0 0 8px 8px;padding:7px 12px;border:1px solid var(--line);border-radius:20px;color:var(--dim);font-size:12px;text-decoration:none;background:var(--panel)}
.dork:hover{color:var(--text);border-color:var(--red)}
details{margin-top:6px}
summary{cursor:pointer;color:var(--dim);font-size:13px;padding:6px 0}
footer{margin-top:50px;color:#4a463f;font-size:11px;line-height:1.8;border-top:1px solid var(--line);padding-top:16px}
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
