const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync('app.js','utf8');
function boot(saved,when,blocked=false){
 const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},value:'',setAttribute(){},addEventListener(){}});return elements.get(id);};
 const NativeDate=Date;class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[when]));}}
 vm.runInNewContext(source,{Date:FixedDate,document:{getElementById:get,querySelectorAll:()=>[]},localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;},setItem(){}},setInterval(){}});return get;
}
let get=boot('{corrupt','2026-12-31T23:59:00');assert.equal(get('face-title').textContent,'Everyday');assert.match(get('storage').textContent,/unavailable/);
get=boot(JSON.stringify({face:'missing',upper:'missing',lower:'date',note:123}),'2027-01-01T00:00:00');assert.equal(get('face-title').textContent,'Everyday');assert.match(get('dial').innerHTML,/JAN 1/);assert.doesNotMatch(get('dial').innerHTML,/undefined|NaN/);
get=boot(JSON.stringify({upper:'week',lower:'date'}),'2024-02-29T12:00:00');assert.match(get('dial').innerHTML,/FEB 29/);
get=boot(JSON.stringify({upper:'week',lower:'none'}),'2026-10-12T00:00:00');assert.match(get('dial').innerHTML,/<circle cx="210" cy="206" r="7" fill="#111"/);
get=boot(JSON.stringify({upper:'note',note:'<svg onload=alert(1)>'}),'2026-10-11T12:00:00');assert.match(get('dial').innerHTML,/&lt;svg/);assert.doesNotMatch(get('dial').innerHTML,/<svg onload/);
get=boot(null,'2026-10-11T12:00:00',true);assert.match(get('storage').textContent,/unavailable/);assert.equal(get('face-title').textContent,'Everyday');
console.log('PASS: invalid storage, invalid selections, year rollover, leap day, Monday week indicator, text escaping, unavailable storage.');
for(const [face,title,index] of [['equation','Equation',7],['tumble','Tumble',8],['cutout','Cutout',9],['now','Now',10]]){
 get=boot(JSON.stringify({face,upper:'week',lower:'date'}),'2027-01-01T00:00:00');
 assert.equal(get('face-title').textContent,title);
 assert.equal(get('face-number').textContent,`${String(index).padStart(2,'0')} / 10`);
 assert.match(get('dial').innerHTML,/JAN 1/);
 assert.doesNotMatch(get('dial').innerHTML,/undefined|NaN/);
}
console.log('PASS: all four new face IDs restore with widgets and correct collection numbering.');

get=boot(JSON.stringify({schedule:true}),'2026-10-11T14:00:00');
assert.match(get('dial').innerHTML,/data-start-angle="60" data-end-angle="180"/);
assert.equal((get('dial').innerHTML.match(/id="schedule-event"/g)||[]).length,1);
assert.equal((get('dial').innerHTML.match(/data-free-hour=/g)||[]).length,9);
for(const hour of [3,4,5])assert.doesNotMatch(get('dial').innerHTML,new RegExp('data-free-hour="'+hour+'"'));
assert.equal(get('small-widgets').hidden,true);
get=boot(JSON.stringify({schedule:false}),'2026-10-11T14:00:00');assert.doesNotMatch(get('dial').innerHTML,/schedule-event/);assert.equal(get('small-widgets').hidden,false);
console.log('PASS: one 2–6 PM sector, free-hour dividers only, toggle restoration.');
