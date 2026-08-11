'use strict';

// Helper function untuk toggle class active
const elementToggleFunc = function (elem) {
  if (elem) elem.classList.toggle("active");
};


// ==========================================
// 1. SIDEBAR TOGGLE (UNTUK TAMPILAN MOBILE)
// ==========================================
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}


// ==========================================
// 2. TESTIMONIALS MODAL
// ==========================================
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
};

if (testimonialsItem.length > 0) {
  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt;
      }
      if (modalTitle && title) modalTitle.innerHTML = title.innerHTML;
      if (modalText && text) modalText.innerHTML = text.innerHTML;

      testimonialsModalFunc();
    });
  }
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);


// ==========================================
// 3. CUSTOM SELECT & FILTERING (PORTFOLIO)
// ==========================================
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]") || document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// Event untuk item pada dropdown select (Mobile)
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase().trim();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// Event untuk tombol filter layar lebar (Desktop)
if (filterBtn.length > 0) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase().trim();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}


// ==========================================
// 4. NAVIGASI HALAMAN (PAGE NAVIGATION)
// ==========================================
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

if (navigationLinks.length > 0 && pages.length > 0) {
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {
      const targetPage = this.innerHTML.toLowerCase().trim();

      for (let j = 0; j < pages.length; j++) {
        if (targetPage === pages[j].dataset.page) {
          pages[j].classList.add("active");
          navigationLinks[j].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          pages[j].classList.remove("active");
          navigationLinks[j].classList.remove("active");
        }
      }
    });
  }
}


// ==========================================
// 5. CONTACT FORM & EMAILJS
// ==========================================
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (form) {
  // Validasi input form
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        if (formBtn) formBtn.removeAttribute("disabled");
      } else {
        if (formBtn) formBtn.setAttribute("disabled", "");
      }
    });
  }

  // Proses Pengiriman Email via EmailJS
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!formBtn) return;
    const btnText = formBtn.querySelector("span");
    const originalText = btnText ? btnText.textContent : "Send Message";

    if (btnText) btnText.textContent = "Sending...";
    formBtn.setAttribute("disabled", "");

    const serviceID = "service_02";   // Service ID Anda
    const templateID = "Tn.alvin02"; // Template ID Anda

    if (typeof emailjs !== "undefined") {
      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          if (btnText) btnText.textContent = "Sent Successfully! ✅";
          form.reset();
          setTimeout(() => {
            if (btnText) btnText.textContent = originalText;
          }, 3000);
        }, (error) => {
          if (btnText) btnText.textContent = "Failed to Send ❌";
          alert("Gagal mengirim pesan: " + JSON.stringify(error));
          formBtn.removeAttribute("disabled");
        });
    } else {
      alert("EmailJS SDK belum terpasang di HTML! Silakan cek file index.html Anda.");
      if (btnText) btnText.textContent = originalText;
      formBtn.removeAttribute("disabled");
    }
  });
}


// ==========================================
// 6. PROSES DOWNLOAD CV
// ==========================================
const downloadCvBtn = document.getElementById("download-cv-btn");
const cvText = document.getElementById("cv-text");
const cvIcon = document.getElementById("cv-icon");
const cvStatusDesc = document.getElementById("cv-status-desc");

if (downloadCvBtn) {
  downloadCvBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Mengambil URL direct download langsung dari atribut href HTML
    const fileUrl = this.getAttribute("href");

    // 1. Ubah tampilan ke status Loading
    if (cvText) cvText.textContent = "Downloading...";
    if (cvIcon) cvIcon.innerHTML = `<span class="cv-spinner"></span>`;
    if (cvStatusDesc) cvStatusDesc.textContent = "Please wait a moment...";
    downloadCvBtn.style.pointerEvents = "none";

    // 2. Memicu Download (Cara ini didukung 100% oleh iOS Safari, Android, dan Laptop)
    // Browser akan mendeteksi file dan men-download-nya tanpa berpindah halaman
    window.location.href = fileUrl;

    // 3. Tampilkan efek sukses (ceklis) setelah 1.5 detik
    setTimeout(() => {
      if (cvText) cvText.textContent = "Downloaded!";
      if (cvIcon) cvIcon.innerHTML = `<span class="cv-success-icon">✅</span>`;
      if (cvStatusDesc) cvStatusDesc.textContent = "CV downloaded successfully!";

      // 4. Kembalikan ke tombol semula setelah 3 detik
      setTimeout(() => {
        if (cvText) cvText.textContent = "Download CV";
        if (cvIcon) cvIcon.textContent = "📥";
        if (cvStatusDesc) cvStatusDesc.textContent = "Click to download my CV in PDF format.";
        downloadCvBtn.style.pointerEvents = "auto";
      }, 3000);

    }, 1500);
  });
}