import"./index-7gJvIPwj.js";const c=document.querySelector('input[type="text"]'),n=document.querySelector("button#active"),t=document.querySelector("#alert"),a=document.querySelector("#alert-message"),i=t.querySelector("#alert-close");n.addEventListener("click",async()=>{const s=c.value,e=await window.activation.active(s);e.status==="invalid"?(a.innerText=e.message,t.classList.replace("hidden","flex")):e.status==="success"&&new Notification("Activation Success",{body:e.message})});i.addEventListener("click",()=>{t.classList.replace("flex","hidden")});
