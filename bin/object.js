const t=(t,e)=>{let o=JSON.stringify(e);JSON.stringify(o);for(let o in e)t[o]=e[o]};function e(t,e){if(t)for(let o of Object.keys(e))t.style[o]=e[o];else console.log("setDomStyle cant find params dom!")}function o(t,e){if(t)for(let o of Object.keys(e))t.setAttribute(o,e[o]);else console.log("setDomStyle cant find params dom!")}export{t as mergeByShallow,o as setDomAttrubites,e as setDomStyles};
