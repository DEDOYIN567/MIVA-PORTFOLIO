"use strict";
// Planner: add, complete, delete, filter, persist. Email drafts and calendar alerts for reminders.
// User text only reaches the page through textContent.
(()=>{
const f=document.getElementById("task-form");if(!f)return;
const $=id=>document.getElementById(id);
const ti=$("t-title"),co=$("t-course"),di=$("t-due"),pi=$("t-pri"),te=$("t-err"),de=$("d-err"),cnt=$("t-count"),list=$("t-list"),bar=$("t-bar"),clear=$("t-clear"),digest=$("t-digest"),note=$("t-note"),al=$("t-alert"),mail=$("t-mail"),me=$("m-err");
// ---- Reminder emails via EmailJS: paste your own three values from emailjs.com (see README). ----
// The public key is meant to be visible in the page. Never put a private key here.
const EMAILJS={service:"service_o8i0ek6",template:"template_e7z2eqm",key:"UYCqGdH0-NfOsNAK8"};
const live=!EMAILJS.service.includes("YOUR_");
$("m-note").textContent=live?"Saved in this browser only. When you press Email, this address and that task are passed to EmailJS, which sends one reminder message. Press Calendar instead if you would rather not share your address.":"Saved in this browser only. Email opens a Gmail draft for you to review and send.";
const KEY="planner.tasks",MK="planner.email",RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let tasks=[],filt="all";
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=()=>iso(new Date());
const soon=()=>{const d=new Date();d.setDate(d.getDate()+1);return iso(d)};
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const mk=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n};
const say=m=>{note.textContent=m};
const cmp=(a,b)=>{const x=a.due||"9999",y=b.due||"9999";return x<y?-1:x>y?1:(b.created||0)-(a.created||0)};
const ST=["todo","doing","review","done"],LBL={todo:"To do",doing:"In progress",review:"Review",done:"Done"},TY=["Assignment","Reading","Revision","Deadline"];
const norm=t=>{t.status=ST.includes(t.status)?t.status:(t.done?"done":"todo");t.done=t.status==="done";if(!TY.includes(t.type))t.type="Assignment";return t};
function load(){
  try{const a=JSON.parse(localStorage.getItem(KEY)||"[]");
    tasks=Array.isArray(a)?a.filter(t=>t&&typeof t.id==="string"&&typeof t.title==="string"&&t.title.length<=120&&typeof t.done==="boolean"&&["Low","Medium","High"].includes(t.pri)&&(!t.due||/^\d{4}-\d{2}-\d{2}$/.test(t.due))&&(!t.course||typeof t.course==="string"&&t.course.length<=12)).map(norm):[]}
  catch{tasks=[]}
  try{mail.value=localStorage.getItem(MK)||""}catch{}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(tasks))}catch{say("Browser storage is blocked, so tasks will not survive a refresh.")}}
function addr(){
  const v=mail.value.trim();me.textContent="";mail.removeAttribute("aria-invalid");
  if(!RE.test(v)){mail.setAttribute("aria-invalid","true");me.textContent="Enter a valid email address to receive reminders.";mail.focus();return""}
  try{localStorage.setItem(MK,v)}catch{}
  return v;
}
let cool=0;
async function draft(subject,body){
  const to=addr();if(!to)return;
  if(!live){
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(to)+"&su="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body),"_blank","noopener,noreferrer");
    say("Email sending is not set up yet, so a Gmail draft opened instead. Review it and press Send.");return;
  }
  if(Date.now()<cool){say("Please wait a few seconds before sending another reminder.");return}
  cool=Date.now()+15000;say("Sending…");
  try{
    const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EMAILJS.service,template_id:EMAILJS.template,user_id:EMAILJS.key,template_params:{to_email:to,subject:subject,message:body}})});
    if(!r.ok)throw new Error("HTTP "+r.status);
    say("Reminder sent to "+to+". Check your inbox, and your spam folder if it does not appear.");
  }catch(err){cool=0;say("The reminder could not be sent. Check your connection and try again, or use the Calendar alert.")}
}
const line=t=>"- "+t.title+(t.course?" ["+t.course+"]":"")+" ("+t.type+", "+t.pri+", "+LBL[t.status]+(t.due?", due "+t.due:"")+")";
const remind=t=>draft("Reminder: "+t.title+(t.due?" (due "+t.due+")":""),"Reminder from my academic planner:\n\n"+line(t)+"\n");
const esc=s=>s.replace(/[\\;,]/g,"\\$&").replace(/\n/g,"\\n");
function ics(t){
  const stamp=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  const x=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Academic Planner//EN","BEGIN:VEVENT","UID:"+t.id+"@academic-planner","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+t.due.replace(/-/g,""),"SUMMARY:"+esc(t.title),"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+esc(t.title),"TRIGGER:-PT15H","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([x],{type:"text/calendar"}));a.download="task-"+t.due+".ics";a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  say("Calendar file downloaded. Open it to add an alert at 9:00 the day before the due date.");
}
function draw(){
  list.replaceChildren();
  const td=today(),vis=tasks.filter(t=>filt==="all"||t.status===filt).sort(cmp);
  vis.forEach(t=>{
    const li=mk("li","task"+(t.done?" done":"")),cb=document.createElement("input");cb.type="checkbox";cb.checked=t.done;
    cb.setAttribute("aria-label",(t.done?"Mark not done: ":"Mark done: ")+t.title);
    cb.addEventListener("change",()=>{t.status=cb.checked?"done":"todo";t.done=cb.checked;save();draw()});
    const body=mk("div"),tags=mk("div","tags");
    tags.append(mk("span","bd",t.type));
    if(t.course)tags.append(mk("span","bd",t.course));
    tags.append(mk("span","bd"+(t.pri==="High"?" hi":""),{High:"▲ High",Medium:"● Medium",Low:"▼ Low"}[t.pri]));
    if(t.due){const o=!t.done&&t.due<td;tags.append(mk("span","bd"+(o?" hi":""),(o?"Overdue ":"Due ")+t.due))}
    body.append(mk("div","tt",t.title),tags);
    const act=mk("div","act"),sel=mk("select","sel");sel.setAttribute("aria-label","Status: "+t.title);
    ST.forEach(k=>{const o=mk("option","",LBL[k]);o.value=k;o.selected=k===t.status;sel.append(o)});
    sel.addEventListener("change",()=>{t.status=sel.value;t.done=t.status==="done";save();draw()});
    act.append(sel);
    const b=(x,fn,l)=>{const e=mk("button","btn sm",x);e.type="button";e.setAttribute("aria-label",l+": "+t.title);e.addEventListener("click",fn);act.append(e)};
    if(!t.done){b("Email",()=>remind(t),"Email reminder");if(t.due)b("Calendar",()=>ics(t),"Add calendar alert")}
    b("Delete",()=>{tasks=tasks.filter(x=>x.id!==t.id);save();draw()},"Delete");
    li.append(cb,body,act);list.append(li);
  });
  if(!vis.length)list.append(mk("li","empty",tasks.length?"Nothing in this filter. Try another status or add a new task.":"No tasks yet. Use the form to add your first assignment, reading or deadline."));
  const n=k=>tasks.filter(t=>t.status===k).length,d=n("done");
  const over=tasks.filter(t=>!t.done&&t.due&&t.due<td).length,due=tasks.filter(t=>!t.done&&t.due&&t.due<=soon()).length;
  ST.forEach(k=>{$("s-"+k).textContent=n(k)});$("s-over").textContent=over;
  bar.style.width=tasks.length?Math.round(d/tasks.length*100)+"%":"0";
  clear.disabled=!d;digest.disabled=tasks.length===d;
  al.hidden=!due;al.textContent=due+(due===1?" task is":" tasks are")+" overdue or due within a day.";
}
f.addEventListener("submit",e=>{
  e.preventDefault();const title=ti.value.trim();let bad=null;
  [ti,di].forEach(i=>i.removeAttribute("aria-invalid"));te.textContent=de.textContent="";
  if(!title||title.length>120){ti.setAttribute("aria-invalid","true");te.textContent=title?"Keep the task to 120 characters or fewer.":"Enter a task before adding it.";bad=ti}
  if(di.value&&di.value<today()){di.setAttribute("aria-invalid","true");de.textContent="Choose today or a later date.";bad=bad||di}
  if(bad){bad.focus();return}
  tasks.unshift({id:uid(),title,course:co.value.trim().toUpperCase(),type:$("t-type").value,status:"todo",done:false,created:Date.now(),due:di.value,pri:pi.value});
  save();f.reset();cnt.textContent="0/120";draw();ti.focus();
});
ti.addEventListener("input",()=>{cnt.textContent=ti.value.length+"/120"});
mail.addEventListener("change",()=>{if(RE.test(mail.value.trim())){me.textContent="";mail.removeAttribute("aria-invalid");try{localStorage.setItem(MK,mail.value.trim())}catch{}}});
digest.addEventListener("click",()=>{const o=tasks.filter(t=>!t.done).sort(cmp);if(o.length)draft("My open tasks ("+o.length+")","My open tasks:\n\n"+o.map(line).join("\n")+"\n")});
document.querySelectorAll("[data-f]").forEach(b=>b.addEventListener("click",()=>{
  filt=b.dataset.f;document.querySelectorAll("[data-f]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));draw();
}));
clear.addEventListener("click",()=>{tasks=tasks.filter(t=>!t.done);save();draw()});
load();draw();
})();
