"use strict";
// Contact form: validation (no empty fields, valid email, digits-only phone) and delivery to email through Formspree.
(()=>{
const ENDPOINT="https://formspree.io/f/mnqkqyyj"; // paste your own Formspree form link here
const f=document.getElementById("contact-form");if(!f)return;
const $=id=>document.getElementById(id);
const rules={
  name:v=>!v?"Enter your name.":v.length<2?"Your name needs at least 2 characters.":"",
  email:v=>!v?"Enter your email address.":!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?"Enter a full email such as name@example.com.":"",
  phone:v=>!v?"Enter your phone number.":!/^\d+$/.test(v)?"Use digits only: no spaces, dashes or +.":v.length<7||v.length>15?"Use between 7 and 15 digits.":"",
  msg:v=>!v?"Write a message.":v.length<10?"Add a little more detail (10 characters or more).":""
};
const fields=[["name","c-name","e-name"],["email","c-email","e-email"],["phone","c-phone","e-phone"],["msg","c-msg","e-msg"]];
function check([k,i,e]){const inp=$(i),m=rules[k](inp.value.trim());inp.setAttribute("aria-invalid",String(!!m));$(e).textContent=m;return m?inp:null}

// Status line under the button for "not set up" and "could not send" messages.
const sendBtn=f.querySelector('button[type="submit"]')||f.querySelector("button:not([type])");
let status=$("c-status");
if(!status){status=document.createElement("p");status.id="c-status";status.className="err";status.setAttribute("role","alert");f.append(status)}

f.addEventListener("submit",async ev=>{
  ev.preventDefault();status.textContent="";
  const bad=fields.map(check).filter(Boolean);
  if(bad.length){bad[0].focus();return}
  if(ENDPOINT.includes("YOUR_FORM_ID")){status.textContent="This form is not set up yet: add your Formspree link at the top of contact.js.";return}

  const label=sendBtn?sendBtn.textContent:"";
  if(sendBtn){sendBtn.disabled=true;sendBtn.textContent="Sending…"}
  const name=$("c-name").value.trim();
  try{
    const res=await fetch(ENDPOINT,{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({
        name:name,
        email:$("c-email").value.trim(),
        phone:$("c-phone").value.trim(),
        message:$("c-msg").value.trim(),
        _subject:"Portfolio message from "+name
      })
    });
    if(!res.ok)throw new Error("HTTP "+res.status);
  }catch(err){
    status.textContent="Your message could not be sent. Check your connection and try again in a moment.";
    if(sendBtn){sendBtn.disabled=false;sendBtn.textContent=label}
    return;
  }
  if(sendBtn){sendBtn.disabled=false;sendBtn.textContent=label}

  const ok=$("c-ok");ok.replaceChildren();
  const h=document.createElement("h2");h.textContent="Thanks, "+name+"!";h.tabIndex=-1;
  const p=document.createElement("p");p.textContent="Your message has been sent. I will reply to the email address you gave as soon as I can.";
  const b=document.createElement("button");b.type="button";b.className="btn";b.textContent="Send another message";
  b.addEventListener("click",()=>{f.reset();$("c-count").textContent="0/1000";fields.forEach(x=>{$(x[1]).removeAttribute("aria-invalid");$(x[2]).textContent=""});status.textContent="";ok.hidden=true;f.hidden=false;$("c-name").focus()});
  ok.append(h,p,b);f.hidden=true;ok.hidden=false;h.focus();
});
fields.forEach(x=>$(x[1]).addEventListener("input",()=>{if($(x[1]).getAttribute("aria-invalid")==="true")check(x)}));
$("c-msg").addEventListener("input",e=>{$("c-count").textContent=e.target.value.length+"/1000"});
})();