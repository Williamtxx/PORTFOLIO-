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


// Project detail modals and evidence lightbox. Delegated handlers keep every
// project card and screenshot functional even if markup is rearranged later.
const projectModals = {
  "soc-l1": document.getElementById("socL1Modal"),
  "alert-8816": document.getElementById("alert8816Modal")
};
let activeProjectModal = null;
const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");

function setModal(modal, open) {
  if (!modal) return;
  if (open) {
    // Close another open project first so body scroll and keyboard state stay in sync.
    Object.values(projectModals).forEach(other => {
      if (other && other !== modal) {
        other.classList.remove("active");
        other.setAttribute("aria-hidden", "true");
      }
    });
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    activeProjectModal = modal;
    document.body.classList.add("modal-open");
    const closeButton = modal.querySelector(".modal-close");
    if (closeButton) closeButton.focus({ preventScroll: true });
  } else {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    if (activeProjectModal === modal) activeProjectModal = null;
    document.body.classList.toggle("modal-open", Boolean(activeProjectModal));
  }
}

document.addEventListener("click", event => {
  const projectButton = event.target.closest("[data-project-modal]");
  if (projectButton) {
    event.preventDefault();
    setModal(projectModals[projectButton.dataset.projectModal], true);
    return;
  }

  const modalClose = event.target.closest("[data-modal-close]");
  if (modalClose) {
    const modal = modalClose.closest(".project-modal");
    if (modal) setModal(modal, false);
    return;
  }

  const imageButton = event.target.closest("[data-lightbox-src]");
  if (imageButton) {
    event.preventDefault();
    setLightbox(true, imageButton.dataset.lightboxSrc, imageButton.dataset.lightboxTitle || "Investigation evidence");
    return;
  }

  if (event.target.closest("[data-lightbox-close]")) setLightbox(false);
});

function setLightbox(open, src = "", title = "") {
  if (!imageLightbox || !lightboxImage || !lightboxTitle) return;
  imageLightbox.classList.toggle("active", open);
  imageLightbox.setAttribute("aria-hidden", String(!open));
  if (open) {
    lightboxImage.onerror = () => {
      lightboxImage.alt = "This evidence image could not be loaded. Check that the assets folder was uploaded with the website.";
      lightboxTitle.textContent = `${title} — image unavailable`;
    };
    lightboxImage.src = src;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
  } else {
    lightboxImage.onerror = null;
    lightboxImage.removeAttribute("src");
    lightboxTitle.textContent = "";
  }
}

// Give broken thumbnail paths a visible, useful fallback instead of a blank tile.
document.querySelectorAll(".evidence-image-button img").forEach(img => {
  img.addEventListener("error", () => {
    img.classList.add("image-load-error");
    img.alt = "Evidence image unavailable — make sure the assets folder was uploaded.";
    const card = img.closest(".evidence-image-card");
    if (card) {
      const note = card.querySelector("figcaption small");
      if (note) note.textContent = "Image could not load. Check the assets folder and filename.";
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (imageLightbox?.classList.contains("active")) {
    setLightbox(false);
    return;
  }
  if (activeProjectModal?.classList.contains("active")) setModal(activeProjectModal, false);
});
