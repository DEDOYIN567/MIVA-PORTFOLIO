"use strict";
// Shared: theme toggle, mobile menu, footer year.
const root=document.documentElement,tb=document.getElementById("theme");
function theme(t,s){root.dataset.theme=t;if(tb)tb.textContent=t==="light"?"Dark mode":"Light mode";if(s)try{localStorage.setItem("theme",t)}catch{}}
let saved=null;try{saved=localStorage.getItem("theme")}catch{}
theme(saved||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),false);
if(tb)tb.addEventListener("click",()=>theme(root.dataset.theme==="light"?"dark":"light",true));
const mb=document.getElementById("menu"),nav=document.getElementById("nav");
if(mb&&nav){
  const set=o=>{mb.setAttribute("aria-expanded",String(o));nav.classList.toggle("open",o)};
  mb.addEventListener("click",()=>set(mb.getAttribute("aria-expanded")!=="true"));
  nav.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
  addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){set(false);mb.focus()}});
}
const yr=document.getElementById("yr");if(yr)yr.textContent=new Date().getFullYear();
const up=document.getElementById("to-top");
if(up)addEventListener("scroll",()=>{up.hidden=scrollY<500},{passive:true});

// Print / save as PDF buttons
document.querySelectorAll("#print,[data-print]").forEach(b=>b.addEventListener("click",()=>print()));
