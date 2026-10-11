'use strict';
(() => {
 const $=id=>document.getElementById(id), KEY='still-faces-v2';
 const faces=[['everyday','Everyday','The familiar, with a little more breathing room.'],['grotesk','Grotesk','Big numbers. A confident little object.'],['orbit','Orbit','Twelve dots, one quiet rhythm.'],['petal','Petal','A softer geometry for the passing hours.'],['roman','Roman','An old soul on a new kind of paper.'],['radial','Radial','A precise rhythm of fine lines.']];
 const widgets=[['none','None'],['date','Date'],['digital','Digital time'],['week','Week rhythm'],['note','Personal note']];
 let state={face:'everyday',upper:'none',lower:'date',note:'Make room for today'}, storageOK=true;
 try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s==='object'){for(const key of ['face','upper','lower','note'])if(typeof s[key]==='string')state[key]=s[key];}}catch{storageOK=false;}
 if(!faces.some(f=>f[0]===state.face))state.face='everyday';
 for(const key of ['upper','lower'])if(!widgets.some(w=>w[0]===state[key]))state[key]='none';
 state.note=state.note.slice(0,24);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const polar=(r,a)=>[300+r*Math.sin(a*Math.PI/180),300-r*Math.cos(a*Math.PI/180)];
 const text=(x,y,value,size=20,attrs='')=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="${size}" fill="#111" ${attrs}>${esc(value)}</text>`;
 function dial(face){
  let s='<circle cx="300" cy="300" r="300" fill="#fff"/>';
  for(let i=0;i<12;i++){
   const a=i*30, n=i||12;
   if(face==='everyday'||face==='roman'){
    const [x,y]=polar(248,a);s+=text(x,y,face==='roman'?['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'][i]:n,face==='roman'?28:29,face==='roman'?'style="font-family:Georgia,serif"':'');
   }else if(face==='grotesk'){
    const [x,y]=polar(i%3===0?232:245,a);s+=text(x,y,n,i%3===0?91:32,'font-weight="900" letter-spacing="-3"');
   }else if(face==='orbit'){
    const [x,y]=polar(253,a);s+=`<circle cx="${x}" cy="${y}" r="${i%3===0?13:6}" fill="#111"/>`;
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
 function render(){const now=new Date();$('dial').innerHTML=dial(state.face)+widget(state.upper,194,now)+widget(state.lower,406,now);$('dial').setAttribute('aria-label',`${faces.find(f=>f[0]===state.face)[1]} clock face, local time ${now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`);$('hour').style.transform=`rotate(${(now.getHours()%12)*30+now.getMinutes()/2}deg)`;$('minute').style.transform=`rotate(${now.getMinutes()*6}deg)`;}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}storageLabel();}
 function storageLabel(){$('storage').textContent=storageOK?'Saved in this browser':'Storage unavailable — changes last this session';}
 function controls(){const index=faces.findIndex(f=>f[0]===state.face);$('face-number').textContent=`0${index+1} / 06`;$('face-title').textContent=faces[index][1];$('face-description').textContent=faces[index][2];document.querySelectorAll('[data-face]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.face===state.face)));$('upper').value=state.upper;$('lower').value=state.lower;$('note').value=state.note;$('note-editor').hidden=![state.upper,state.lower].includes('note');$('widget-hint').textContent=[state.upper,state.lower].includes('week')?'Filled dot marks today. Week runs Monday to Sunday.':'Widgets follow your device’s local time.';}
 $('face-list').innerHTML=faces.map(([id,name])=>`<button class="face" data-face="${id}" aria-pressed="false" aria-label="${name} face"><svg viewBox="0 0 600 600" aria-hidden="true">${dial(id)}<path d="M300 300 L220 210 M300 300 L407 197" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/><circle cx="300" cy="300" r="12" fill="#111"/></svg><span>${name}</span></button>`).join('');
 for(const id of ['upper','lower']){$(id).innerHTML=widgets.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');$(id).addEventListener('change',e=>{state[id]=e.target.value;save();controls();render();});}
 document.querySelectorAll('[data-face]').forEach(b=>b.addEventListener('click',()=>{state.face=b.dataset.face;save();controls();render();}));
 $('note').addEventListener('input',e=>{state.note=e.target.value.slice(0,24);save();render();});
 controls();storageLabel();render();setInterval(render,1000);
})();
