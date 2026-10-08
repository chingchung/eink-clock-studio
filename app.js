'use strict';
(() => {
 const $=id=>document.getElementById(id), KEY='still-studio-v1';
 const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const today=()=>iso(new Date());
 const future=new Date(); future.setDate(future.getDate()+30);
 const defaults={face:'quiet',markers:true,date:true,weather:true,period:'PM',target:iso(future),started:today(),title:'A little adventure',threshold:145,invert:false,image:null,strokes:[],signedIn:false};
 let state={...defaults}, artwork=null, drawing=false, stroke=null, toastTimer, uploadVersion=0;
 try { const saved=JSON.parse(localStorage.getItem(KEY)); if(saved&&typeof saved==='object')state={...defaults,...saved}; } catch(e) { }
 if(!['quiet','agenda','countdown','canvas'].includes(state.face))state.face='quiet';
 if(!Array.isArray(state.strokes))state.strokes=[];
 const canvas=$('art'),ctx=canvas.getContext('2d');
 function toast(msg){$('status').textContent=msg;$('status').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('status').classList.remove('show'),4200)}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('storage').textContent='✓ Saved on this browser';}catch(e){$('storage').textContent='Storage unavailable or full. Changes are only in this session.';}}
 function dayNumber(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return NaN;const [y,m,d]=s.split('-').map(Number);const date=new Date(Date.UTC(y,m-1,d));return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d?date.getTime()/86400000:NaN;}
 function remaining(){return Math.max(0,dayNumber(state.target)-dayNumber(today()));}
 function label(x,y,text,size=18,extra=''){return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="#232620" ${extra}>${text}</text>`;}
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function polar(r,a){const t=(a-90)*Math.PI/180;return [300+r*Math.cos(t),300+r*Math.sin(t)];}
 function ring(start,end,r=237){const a=polar(r,start),b=polar(r,end);return `<path d="M ${a.join(' ')} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${b.join(' ')}" fill="none" stroke="#232620" stroke-width="24"/>`;}
 function render(){
  ctx.fillStyle='#fffff9';ctx.fillRect(0,0,600,600);
  if(state.face==='canvas'){
   if(artwork){const ratio=Math.max(600/artwork.width,600/artwork.height),w=artwork.width*ratio,h=artwork.height*ratio;ctx.drawImage(artwork,(600-w)/2,(600-h)/2,w,h);const pixels=ctx.getImageData(0,0,600,600);for(let i=0;i<pixels.data.length;i+=4){const g=.2126*pixels.data[i]+.7152*pixels.data[i+1]+.0722*pixels.data[i+2];let v=g>=state.threshold?255:0;if(state.invert)v=255-v;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;}ctx.putImageData(pixels,0,0);}
   ctx.strokeStyle='#111';ctx.lineWidth=5;ctx.lineCap=ctx.lineJoin='round';for(const points of state.strokes){if(!points.length)continue;ctx.beginPath();ctx.moveTo(...points[0]);if(points.length===1)ctx.lineTo(points[0][0]+.1,points[0][1]);else for(const p of points.slice(1))ctx.lineTo(...p);ctx.stroke();}
  }
  let svg='';
  if(state.markers){for(let i=0;i<60;i++){const p=polar(i%5?274:265,i*6),q=polar(281,i*6);svg+=`<path d="M${p.join(' ')} L${q.join(' ')}" stroke="#232620" stroke-width="${i%5?1:3}"/>`;}}
  if(state.face==='quiet'){svg+=label(300,142,'S T I L L',14);svg+=label(300,396,'MAKE ROOM FOR TODAY',12);}
  if(state.face==='agenda'){const pm=state.period==='PM';const events=pm?[[2,3],[4,4.5],[6.5,7.5]]:[[9,10],[11,11.5]];for(const [start,end] of events)svg+=ring(start*30,end*30);svg+=label(300,177,pm?'12 PM → 12 AM':'12 AM → 12 PM',16);svg+=label(300,395,pm?'2–3 PM · DESIGN REVIEW':'9–10 AM · FOCUS TIME',17);svg+=label(300,421,'DEMO CALENDAR',11);}
  if(state.face==='countdown'){const days=remaining(),total=Math.max(1,dayNumber(state.target)-dayNumber(state.started)),progress=Math.min(1,Math.max(0,(total-days)/total));svg+='<circle cx="300" cy="300" r="238" fill="none" stroke="#c6c6bf" stroke-width="16"/>';if(progress>0)svg+=ring(0,Math.min(359.99,progress*360));svg+=label(300,195,Number.isFinite(days)?days:'—',68);svg+=label(300,223,days===0?'TODAY OR COMPLETED':'DAYS TO GO',13);svg+=label(300,397,escape(state.title.slice(0,32)),22);svg+=label(300,426,escape(state.target),13);}
  if(state.date){const date=new Date();const text=date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}).toUpperCase();svg+=label(300,state.face==='quiet'?183:470,text,16);}
  if(state.weather)svg+=label(300,state.face==='quiet'?444:505,'☀ 24° · DEMO',15);
  $('dial').innerHTML=svg;updateHands();
 }
 function updateHands(){const now=new Date();$('hour').style.transform=`rotate(${(now.getHours()%12)*30+now.getMinutes()/2}deg)`;$('minute').style.transform=`rotate(${now.getMinutes()*6+now.getSeconds()/10}deg)`;}
 function settings(){
  const name=state.face[0].toUpperCase()+state.face.slice(1);$('settings-title').textContent=name+' details';$('face-caption').textContent=({quiet:'QUIET / EVERYDAY CLARITY',agenda:'AGENDA / A SHAPE TO YOUR DAY',countdown:'COUNTDOWN / GOOD THINGS AHEAD',canvas:'CANVAS / YOUR OWN EXPRESSION'})[state.face];
  document.querySelectorAll('[data-face]').forEach(b=>{const selected=b.dataset.face===state.face;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);});
  $('markers').checked=!!state.markers;$('date-widget').checked=!!state.date;$('weather-widget').checked=!!state.weather;
  let html='';
  if(state.face==='quiet')html='<p class="hint">An uncluttered face with the date, a little weather, and space to breathe.</p><div class="event">Local time<small>Physical hands follow your device clock.</small></div><div class="event">24° · Sunny<small>Sample weather · no location access</small></div>';
  if(state.face==='agenda')html='<label class="field">12-hour window<select id="period"><option>AM</option><option>PM</option></select></label><p class="hint">Sectors show occupied hours within the selected half-day. Noon is at the top in PM; midnight is at the top in AM.</p><div id="events"></div>';
  if(state.face==='countdown')html='<label class="field">Looking forward to<input id="target-title" maxlength="32"></label><label class="field">Target date<input id="target-date" type="date"></label><p class="hint">Counts calendar days in your local timezone. The outer ring fills as the target approaches, starting when you choose a date. Past dates show 0 days.</p>';
  if(state.face==='canvas')html='<p class="hint">Upload a photo or draw directly on the clock. Images are cropped to fill and converted to black and white on this device.</p><label class="field">Add artwork<input id="upload" type="file" accept="image/png,image/jpeg,image/webp"></label><label class="field">Threshold <output id="threshold-value"></output><input id="threshold" type="range" min="0" max="255"></label><label class="toggle">Invert image<input id="invert" type="checkbox"></label><div class="tools"><button id="remove-image">Remove image</button><button id="undo">Undo stroke</button><button id="clear">Clear drawing</button></div><p class="hint">PNG, JPEG, WebP · up to 8 MB. Draw with a mouse, pen, or touch. Artwork stays local.</p>';
  $('face-settings').innerHTML=html;
  if(state.face==='agenda'){$('period').value=state.period;const events=()=>{$('events').innerHTML=state.period==='PM'?'<div class="event">2–3 PM<small>Design review</small></div><div class="event">4–4:30 PM<small>Walk & reset</small></div><div class="event">6:30–7:30 PM<small>Dinner with friends</small></div>':'<div class="event">9–10 AM<small>Focus time</small></div><div class="event">11–11:30 AM<small>Team check-in</small></div>';};events();$('period').onchange=e=>{state.period=e.target.value;events();save();render();};}
  if(state.face==='countdown'){$('target-title').value=state.title;$('target-date').value=state.target;$('target-title').oninput=e=>{state.title=e.target.value;save();render();};$('target-date').onchange=e=>{if(!Number.isFinite(dayNumber(e.target.value))){toast('Choose a valid target date.');e.target.value=state.target;return;}state.target=e.target.value;state.started=today();save();render();};}
  if(state.face==='canvas'){$('threshold').value=state.threshold;$('threshold-value').textContent=state.threshold;$('invert').checked=state.invert;$('threshold').oninput=e=>{state.threshold=Number(e.target.value);$('threshold-value').textContent=state.threshold;save();render();};$('invert').onchange=e=>{state.invert=e.target.checked;save();render();};$('remove-image').onclick=()=>{uploadVersion++;state.image=null;artwork=null;$('upload').value='';save();render();};$('undo').onclick=()=>{state.strokes.pop();save();render();};$('clear').onclick=()=>{state.strokes=[];save();render();};$('upload').onchange=upload;}
 }
 async function upload(e){const file=e.target.files[0];if(!file)return;const version=++uploadVersion;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){toast('Choose a PNG, JPEG, or WebP image under 8 MB.');e.target.value='';return;}const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();if(version!==uploadVersion)return;if(img.width*img.height>40000000)throw Error('Large image');const resized=document.createElement('canvas');resized.width=resized.height=600;const c=resized.getContext('2d');c.fillStyle='white';c.fillRect(0,0,600,600);const r=Math.max(600/img.width,600/img.height);c.drawImage(img,(600-img.width*r)/2,(600-img.height*r)/2,img.width*r,img.height*r);const data=resized.toDataURL('image/jpeg',.85);const ready=new Image();ready.src=data;await ready.decode();if(version!==uploadVersion)return;state.image=data;artwork=ready;save();render();toast('Artwork converted. Adjust the threshold to find your balance.');}catch(err){toast('This image could not be read. Try a smaller valid image.');}finally{URL.revokeObjectURL(url);e.target.value='';}}
 function point(e){const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(600,(e.clientX-r.left)/r.width*600)),Math.max(0,Math.min(600,(e.clientY-r.top)/r.height*600))];}
 canvas.onpointerdown=e=>{if(state.face!=='canvas'||(e.pointerType==='mouse'&&e.button!==0))return;if(state.strokes.length>=500){toast('Drawing limit reached. Clear or undo some strokes.');return;}drawing=true;stroke=[point(e)];state.strokes.push(stroke);canvas.setPointerCapture(e.pointerId);render();};
 canvas.onpointermove=e=>{if(!drawing||!stroke)return;if(stroke.length<2000)stroke.push(point(e));render();};
 function finish(){if(drawing){drawing=false;stroke=null;save();}}canvas.onpointerup=finish;canvas.onpointercancel=finish;canvas.onlostpointercapture=finish;
 document.querySelectorAll('[data-face]').forEach(b=>b.onclick=()=>{finish();state.face=b.dataset.face;settings();save();render();});
 for(const [id,key]of [['markers','markers'],['date-widget','date'],['weather-widget','weather']])$(id).onchange=e=>{state[key]=e.target.checked;save();render();};
 function loginText(){$('login').textContent=state.signedIn?'Kenny · demo · sign out':'Sign in · demo';}$('login').onclick=()=>{state.signedIn=!state.signedIn;loginText();save();toast(state.signedIn?'Demo session started. No account or credentials used.':'Demo session ended.');};
 $('apply').onclick=()=>{toast('Simulated apply complete — '+state.face+' face. No hardware was contacted.');};
 loginText();settings();render();setInterval(render,60000);setInterval(updateHands,1000);
 // A pending restore must not overwrite artwork removed or replaced after startup.
 if(typeof state.image==='string'&&state.image.startsWith('data:image/')){
  const version=uploadVersion, savedImage=state.image, img=new Image();
  const isCurrent=()=>version===uploadVersion&&state.image===savedImage;
  img.onload=()=>{if(!isCurrent())return;artwork=img;render();};
  img.onerror=()=>{if(!isCurrent())return;state.image=null;toast('Saved artwork could not be loaded. Please upload it again.');};
  img.src=savedImage;
 }
})();
