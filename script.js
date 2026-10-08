const header=document.querySelector(".site-header"),menuToggle=document.getElementById("menuToggle"),navLinks=document.getElementById("navLinks"),toast=document.getElementById("toast"),toastMessage=document.getElementById("toastMessage"),year=document.getElementById("year");

if(year)year.textContent=new Date().getFullYear();
function updateHeader(){if(header)header.classList.toggle("scrolled",window.scrollY>30)}
window.addEventListener("scroll",updateHeader,{passive:true});
updateHeader();

if(menuToggle&&navLinks){
  menuToggle.addEventListener("click",()=>{const open=navLinks.classList.toggle("active");menuToggle.setAttribute("aria-expanded",String(open))});
  navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{navLinks.classList.remove("active");menuToggle.setAttribute("aria-expanded","false")}));
}

let toastTimer;
function showToast(msg){
  if(!toast||!toastMessage)return;
  toastMessage.textContent=msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),3200);
}

document.querySelectorAll("[data-placeholder],a[href='#']").forEach(e=>e.addEventListener("click",ev=>{
  const href=e.getAttribute("href");
  if(href&&href!=="#")return;
  ev.preventDefault();
  showToast(e.dataset.placeholder||"This link has not been added yet.");
}));

if("IntersectionObserver"in window){
  const observer=new IntersectionObserver((entries,o)=>entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.style.opacity="1";
    e.target.style.transform="none";
    o.unobserve(e.target);
  }),{threshold:.08});
  document.querySelectorAll(".about-grid,.skill-strip,.project-card,.learning-grid,.certification-card,.community-card,.contact-container").forEach(e=>{
    if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
      e.style.opacity="0";
      e.style.transform="translateY(16px)";
      e.style.transition="opacity 600ms ease,transform 600ms ease";
    }
    observer.observe(e);
  });
}

console.log("%cWilliam Arteaga — Cybersecurity Portfolio","color:#50e3b2;font-size:16px;font-weight:bold;");


const projectModals={
  "soc-l1":document.getElementById("socL1Modal"),
  "alert-8816":document.getElementById("alert8816Modal")
};
let activeProjectModal=null;
const imageLightbox=document.getElementById("imageLightbox");
const lightboxImage=document.getElementById("lightboxImage");
const lightboxTitle=document.getElementById("lightboxTitle");

function setModal(modal,open){
  if(!modal)return;
  modal.classList.toggle("active",open);
  modal.setAttribute("aria-hidden",String(!open));
  if(open)activeProjectModal=modal;
  else if(activeProjectModal===modal)activeProjectModal=null;
  document.body.classList.toggle("modal-open",Boolean(activeProjectModal));
}

document.querySelectorAll("[data-project-modal]").forEach(btn=>btn.addEventListener("click",()=>setModal(projectModals[btn.dataset.projectModal],true)));
document.querySelectorAll("[data-modal-close]").forEach(el=>el.addEventListener("click",()=>setModal(el.closest(".project-modal"),false)));

function setLightbox(open,src="",title=""){
  if(!imageLightbox)return;
  imageLightbox.classList.toggle("active",open);
  imageLightbox.setAttribute("aria-hidden",String(!open));
  if(open){lightboxImage.src=src;lightboxImage.alt=title;lightboxTitle.textContent=title;}
  else{lightboxImage.src="";lightboxTitle.textContent="";}
}

document.querySelectorAll("[data-lightbox-src]").forEach(btn=>btn.addEventListener("click",()=>setLightbox(true,btn.dataset.lightboxSrc,btn.dataset.lightboxTitle||"SOC investigation evidence")));
document.querySelectorAll("[data-lightbox-close]").forEach(el=>el.addEventListener("click",()=>setLightbox(false)));

document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;
  if(imageLightbox?.classList.contains("active")){setLightbox(false);return;}
  if(activeProjectModal?.classList.contains("active"))setModal(activeProjectModal,false);
});
