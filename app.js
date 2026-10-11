'use strict';
(() => {
 const $=id=>document.getElementById(id), KEY='still-faces-v2';
 const faces=[['everyday','Everyday','The familiar, with a little more breathing room.'],['grotesk','Grotesk','Big numbers. A confident little object.'],['orbit','Orbit','Twelve dots, one quiet rhythm.'],['petal','Petal','A softer geometry for the passing hours.'],['roman','Roman','An old soul on a new kind of paper.'],['radial','Radial','A precise rhythm of fine lines.'],['equation','Equation','A little arithmetic, every hour.'],['tumble','Tumble','Serif numerals with a playful lean.'],['cutout','Cutout','Oversized numerals. A clean break.'],['now','Now','A gentle reminder to be here.']];
 const widgets=[['none','None'],['date','Date'],['digital','Digital time'],['week','Week rhythm'],['note','Personal note']];
 let state={face:'everyday',upper:'none',lower:'date',note:'Make room for today',schedule:false}, storageOK=true;
 try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s==='object'){for(const key of ['face','upper','lower','note'])if(typeof s[key]==='string')state[key]=s[key];if(typeof s.schedule==='boolean')state.schedule=s.schedule;}}catch{storageOK=false;}
 if(!faces.some(f=>f[0]===state.face))state.face='everyday';
 for(const key of ['upper','lower'])if(!widgets.some(w=>w[0]===state[key]))state[key]='none';
 state.note=state.note.slice(0,24);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const polar=(r,a)=>[300+r*Math.sin(a*Math.PI/180),300-r*Math.cos(a*Math.PI/180)];
 const text=(x,y,value,size=20,attrs='')=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="${size}" fill="#111" ${attrs}>${esc(value)}</text>`;
 // Fractions remain vector artwork, with a real bar instead of a slash.
 const fraction=(top,bottom)=>text(0,-17,top,27)+`<path d="M-24 0H24" stroke="#111" stroke-width="2"/>`+text(0,20,bottom,27);
 const equations=[()=>text(0,0,'√25 + 7',30),()=>text(0,0,'tan(45°)',27),()=>text(0,0,'log₁₀100',27),()=>text(0,0,'√9',40),()=>fraction('√64','2'),()=>text(0,0,'2² + 1',32),()=>text(0,0,'3!',44),()=>fraction('28','4'),()=>text(0,0,'√25 + 3',29),()=>text(0,0,'3 × 3',35),()=>text(0,0,'97 − 87',28),()=>fraction('33','3')];
 function dial(face){
  let s='<circle cx="300" cy="300" r="300" fill="#fff"/>';
  if(face==='cutout')s+='<circle cx="300" cy="300" r="300" fill="#111"/><circle cx="300" cy="300" r="174" fill="#fff"/>';
  for(let i=0;i<12;i++){
   const a=i*30, n=i||12;
   if(face==='everyday'||face==='roman'){
    const [x,y]=polar(248,a);s+=text(x,y,face==='roman'?['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'][i]:n,face==='roman'?28:29,face==='roman'?'style="font-family:Georgia,serif"':'');
   }else if(face==='grotesk'){
    const [x,y]=polar(i%3===0?232:245,a);s+=text(x,y,n,i%3===0?91:32,'font-weight="900" letter-spacing="-3"');
   }else if(face==='orbit'){
    const [x,y]=polar(253,a);s+=`<circle cx="${x}" cy="${y}" r="${i%3===0?13:6}" fill="#111"/>`;
   }else if(face==='equation'){
    const [x,y]=polar(244,a);s+=`<g transform="translate(${x} ${y})">${equations[i]()}</g>`;
   }else if(face==='tumble'){
    const [x,y]=polar(240,a),tilt=[-9,12,24,5,28,-24,8,26,-18,-12,-30,-20][i];
    s+=text(x,y,n,i%3===0?95:82,`style="font-family:Georgia,serif" letter-spacing="-5" transform="rotate(${tilt} ${x} ${y})"`);
   }else if(face==='cutout'){
    const [x,y]=polar(i%3===0?240:251,a),size=i%3===0?100:45;
    s+=`<g transform="translate(${x} ${y})">${text(0,0,n,size,'style="fill:#fff" font-weight="900" letter-spacing="-5"')}<path d="M-65 -5H65" stroke="#111" stroke-width="5"/></g>`;
   }else if(face==='now'&&i%3===0){
    const [x,y]=polar(239,a);
    s+=text(x,y,'NOW',i%6===0?49:44,'font-weight="300" letter-spacing="1"');
   }else if(face==='petal'){
    s+=`<ellipse cx="300" cy="73" rx="${i%3===0?18:11}" ry="42" fill="${i%3===0?'#111':'#fff'}" stroke="#111" stroke-width="2" transform="rotate(${a} 300 300)"/>`;
   }
  }
  if(face==='radial'||face==='everyday')for(let i=0;i<60;i++){
   const p=polar(face==='radial'?(i%5?263:236):282,i*6),q=polar(289,i*6);
   s+=`<path d="M${p.join(' ')} L${q.join(' ')}" stroke="#111" stroke-width="${i%5?1.5:4}"/>`;
  }
  if(face==='radial')for(let i=0;i<4;i++){const [x,y]=polar(209,i*90);s+=text(x,y,i?i*3:12,22);}
  return s;
 }
 function widget(kind,y,now){
  if(kind==='none')return '';
  let s='';
  if(kind==='date'){s+=text(300,y-12,now.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase(),13,'letter-spacing="3"');s+=text(300,y+15,now.toLocaleDateString('en-US',{month:'short',day:'numeric'}).toUpperCase(),26);}
  if(kind==='digital')s+=text(300,y,now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}),38,'font-weight="600" letter-spacing="2"');
  if(kind==='note')s+=text(300,y,state.note,15,state.note.length>20?'textLength="210" lengthAdjust="spacingAndGlyphs"':'');
  if(kind==='week'){
   const day=(now.getDay()+6)%7;
   ['M','T','W','T','F','S','S'].forEach((v,i)=>{const x=210+i*30;s+=text(x,y-13,v,12);s+=`<circle cx="${x}" cy="${y+12}" r="7" fill="${i===day?'#111':'#fff'}" stroke="#111" stroke-width="1.5"/>`;});
  }
  return s;
 }
 function scheduleWidget(){
  // PM demo: 14:00–18:00 maps to 60°–180° on a conventional 12-hour dial.
  const start=60,end=180,r=168,inner=24,corner=9;
  const p=(radius,angle)=>polar(radius,angle).join(' '), inset=corner/r*180/Math.PI;
  let s='<g aria-label="PM schedule: event from 2 PM to 6 PM">';
  // Only free hours are divided; the event remains one continuous shape.
  for(let hour=0;hour<12;hour++){
   const angle=hour*30;if(angle>start&&angle<end)continue;
   s+=`<path data-free-hour="${hour}" d="M${p(inner,angle)} L${p(r,angle)}" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="4 7"/>`;
  }
  s+=`<path id="schedule-event" data-start-angle="60" data-end-angle="180" d="M${p(inner+corner,start)} L${p(r-corner,start)} Q${p(r,start)} ${p(r,start+inset)} A${r} ${r} 0 0 1 ${p(r,end-inset)} Q${p(r,end)} ${p(r-corner,end)} L${p(inner+corner,end)} Q${p(inner,end)} ${p(inner,end-12)} A${inner} ${inner} 0 0 0 ${p(inner,start+12)} Q${p(inner,start)} ${p(inner+corner,start)} Z" fill="#111"/>`;
  s+=text(390,350,'2–6 PM',18,'style="fill:#fff"');
  return s+'</g>';
 }
 function render(){const now=new Date();$('dial').innerHTML=dial(state.face)+(state.schedule?scheduleWidget():widget(state.upper,194,now)+widget(state.lower,406,now));$('dial').setAttribute('aria-label',`${faces.find(f=>f[0]===state.face)[1]} clock face${state.schedule?', PM schedule: 2–6 PM event':''}, local time ${now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`);$('hour').style.transform=`rotate(${(now.getHours()%12)*30+now.getMinutes()/2}deg)`;$('minute').style.transform=`rotate(${now.getMinutes()*6}deg)`;}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}storageLabel();}
 function storageLabel(){$('storage').textContent=storageOK?'Saved in this browser':'Storage unavailable — changes last this session';}
 function controls(){$('schedule').checked=state.schedule;$('schedule-hint').hidden=!state.schedule;$('small-widgets').hidden=state.schedule;const index=faces.findIndex(f=>f[0]===state.face);$('face-number').textContent=`${String(index+1).padStart(2,'0')} / ${String(faces.length).padStart(2,'0')}`;$('face-title').textContent=faces[index][1];$('face-description').textContent=faces[index][2];document.querySelectorAll('[data-face]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.face===state.face)));$('upper').value=state.upper;$('lower').value=state.lower;$('note').value=state.note;$('note-editor').hidden=![state.upper,state.lower].includes('note');$('widget-hint').textContent=[state.upper,state.lower].includes('week')?'Filled dot marks today. Week runs Monday to Sunday.':'Widgets follow your device’s local time.';}
 $('face-list').innerHTML=faces.map(([id,name])=>`<button class="face" data-face="${id}" aria-pressed="false" aria-label="${name} face"><svg viewBox="0 0 600 600" aria-hidden="true">${dial(id)}<path d="M300 300 L220 210 M300 300 L407 197" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/><circle cx="300" cy="300" r="12" fill="#111"/></svg><span>${name}</span></button>`).join('');
 for(const id of ['upper','lower']){$(id).innerHTML=widgets.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');$(id).addEventListener('change',e=>{state[id]=e.target.value;save();controls();render();});}
 document.querySelectorAll('[data-face]').forEach(b=>b.addEventListener('click',()=>{state.face=b.dataset.face;save();controls();render();}));
 $('note').addEventListener('input',e=>{state.note=e.target.value.slice(0,24);save();render();});
 $('schedule').addEventListener('change',e=>{state.schedule=e.target.checked;save();controls();render();});
 controls();storageLabel();render();setInterval(render,1000);
})();
