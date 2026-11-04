"use strict";
// Projects: category filter and text search with a live count.
(()=>{
const cards=[...document.querySelectorAll("[data-cat]")];if(!cards.length)return;
const btns=[...document.querySelectorAll("[data-filter]")],q=document.getElementById("pq"),count=document.getElementById("pcount"),none=document.getElementById("pnone");
let cat="all";
function run(){
  const t=q.value.trim().toLowerCase();let n=0;
  cards.forEach(c=>{const ok=(cat==="all"||c.dataset.cat===cat)&&c.textContent.toLowerCase().includes(t);c.hidden=!ok;if(ok)n++});
  count.textContent=n+" of "+cards.length+" projects shown";none.hidden=n>0;
}
btns.forEach(b=>b.addEventListener("click",()=>{cat=b.dataset.filter;btns.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));run()}));
q.addEventListener("input",run);run();
})();
