'use strict';
function runRestorationChecks(source) {
 const start = source.indexOf(" if(typeof state.image==='string'&&state.image.startsWith('data:image/'))");
 const end = source.lastIndexOf('\n})();');
 if(start < 0 || end <= start) throw new Error('Restoration block not found');
 const block = source.slice(start,end);
 const setup = new Function(`
  let uploadVersion=0, state={image:'data:image/png;base64,old'}, artwork=null;
  let renders=0, notices=0, pending;
  class Image { constructor(){pending=this;} }
  function render(){renders++;}
  function toast(){notices++;}
  ` + block + `
  return {
   change(version,image,art){uploadVersion=version;state.image=image;artwork=art;},
   fire(event){pending[event]();},
   read(){return {image:state.image,artwork,renders,notices,pending};}
  };
 `);
 const assert=(ok,label)=>{if(!ok)throw new Error(label);};
 let passed=0;
 for(const event of ['onload','onerror']){
  const current=setup(); current.fire(event); const c=current.read();
  assert(event==='onload'
   ? c.artwork===c.pending&&c.renders===1&&c.notices===0
   : c.image===null&&c.renders===0&&c.notices===1,'current '+event);
  passed++;
  for(const [name,version,image] of [
   ['removed',1,null],
   ['new upload pending',1,'data:image/png;base64,old'],
   ['source changed',0,'data:image/png;base64,new']
  ]){
   const harness=setup(), sentinel={name};
   harness.change(version,image,sentinel); harness.fire(event); const r=harness.read();
   assert(r.artwork===sentinel&&r.image===image&&r.renders===0&&r.notices===0,name+' '+event);
   passed++;
  }
 }
 return passed;
}

const source = require('node:fs').readFileSync(require('node:path').join(__dirname,'..','app.js'),'utf8');
console.log(`${runRestorationChecks(source)} restoration callback checks passed`);
