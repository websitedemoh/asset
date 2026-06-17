const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const dropdownToggles = Array.from(document.querySelectorAll(".dropdown-toggle"));

function initLogoIntro() {
  const logo = document.querySelector(".brand-logo");
  const brand = logo?.closest(".brand");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isAnimating = false;

  if (!logo || !brand || prefersReducedMotion) {
    return;
  }

  function playIntro() {
    if (isAnimating) {
      return;
    }

    const target = logo.getBoundingClientRect();

    if (!target.width || !target.height) {
      return;
    }

    isAnimating = true;

    const overlay = document.createElement("div");
    const animatedLogo = logo.cloneNode();
    const introSize = Math.min(window.innerWidth * 0.72, window.innerHeight * 0.72, 720);
    const startLeft = (window.innerWidth - introSize) / 2;
    const startTop = (window.innerHeight - introSize) / 2;
    const introDuration = 3600;

    overlay.className = "logo-intro";
    overlay.setAttribute("aria-hidden", "true");
    animatedLogo.className = "logo-intro-image";
    animatedLogo.removeAttribute("alt");
    animatedLogo.style.left = `${target.left}px`;
    animatedLogo.style.top = `${target.top}px`;
    animatedLogo.style.width = `${target.width}px`;
    animatedLogo.style.height = `${target.height}px`;
    overlay.appendChild(animatedLogo);

    document.body.classList.add("logo-intro-active");
    logo.classList.add("logo-intro-target");
    document.body.appendChild(overlay);

    const logoAnimation = animatedLogo.animate(
      [
        {
          height: `${introSize * 0.82}px`,
          left: `${(window.innerWidth - introSize * 0.82) / 2}px`,
          opacity: 0,
          top: `${(window.innerHeight - introSize * 0.82) / 2}px`,
          width: `${introSize * 0.82}px`
        },
        {
          height: `${introSize}px`,
          left: `${startLeft}px`,
          opacity: 1,
          offset: 0.18,
          top: `${startTop}px`,
          width: `${introSize}px`
        },
        {
          height: `${introSize}px`,
          left: `${startLeft}px`,
          opacity: 1,
          offset: 0.58,
          top: `${startTop}px`,
          width: `${introSize}px`
        },
        {
          height: `${target.height}px`,
          left: `${target.left}px`,
          opacity: 1,
          top: `${target.top}px`,
          width: `${target.width}px`
        }
      ],
      {
        duration: introDuration,
        easing: "cubic-bezier(0.65, 0, 0.25, 1)",
        fill: "forwards"
      }
    );

    overlay.animate(
      [
        { opacity: 1, offset: 0.88 },
        { opacity: 0 }
      ],
      {
        duration: introDuration,
        easing: "ease-out",
        fill: "forwards"
      }
    );

    logoAnimation.finished
      .catch(() => {})
      .finally(() => {
        logo.classList.remove("logo-intro-target");
        document.body.classList.remove("logo-intro-active");
        overlay.remove();
        isAnimating = false;
      });
  }

  brand.addEventListener("click", (event) => {
    event.preventDefault();
    window.requestAnimationFrame(playIntro);
  });
}

function isMobileNav() {
  return window.innerWidth <= 1080;
}

function initSlider() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsContainer = document.getElementById("sliderDots");
  const previousButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");

  if (!slides.length || !dotsContainer || !previousButton || !nextButton) {
    return;
  }

  let currentSlide = 0;
  let autoSlideTimer;

  function setSlide(nextIndex) {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;

    slides[currentSlide].classList.remove("active");
    slides[currentSlide].setAttribute("aria-hidden", "true");
    dotsContainer.children[currentSlide].classList.remove("active");
    dotsContainer.children[currentSlide].setAttribute("aria-current", "false");

    currentSlide = normalizedIndex;

    slides[currentSlide].classList.add("active");
    slides[currentSlide].setAttribute("aria-hidden", "false");
    dotsContainer.children[currentSlide].classList.add("active");
    dotsContainer.children[currentSlide].setAttribute("aria-current", "true");
  }

  function nextSlide() {
    setSlide(currentSlide + 1);
  }

  function previousSlide() {
    setSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    autoSlideTimer = window.setInterval(nextSlide, 4000);
  }

  function restartAutoSlide() {
    window.clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      setSlide(index);
      restartAutoSlide();
    });

    dotsContainer.appendChild(dot);
  });

  nextButton.addEventListener("click", () => {
    nextSlide();
    restartAutoSlide();
  });

  previousButton.addEventListener("click", () => {
    previousSlide();
    restartAutoSlide();
  });

  startAutoSlide();
}

function closeDropdowns() {
  dropdownToggles.forEach((toggle) => {
    const parent = toggle.closest(".has-dropdown");
    parent?.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function toggleMenu() {
  if (!primaryNav || !menuToggle) {
    return;
  }

  const isOpen = primaryNav.classList.toggle("open");

  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

  if (!isOpen) {
    closeDropdowns();
  }
}

function closeMenu() {
  if (!primaryNav || !menuToggle) {
    return;
  }

  primaryNav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  closeDropdowns();
}

function initNavigation() {
  if (!primaryNav || !menuToggle) {
    return;
  }

  menuToggle.addEventListener("click", toggleMenu);

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (!isMobileNav()) {
        return;
      }

      const parent = toggle.closest(".has-dropdown");
      const willOpen = !parent.classList.contains("open");

      closeDropdowns();
      parent.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.matches(".dropdown-toggle")) {
      return;
    }

    if (event.target.matches("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileNav()) {
      closeMenu();
    }
  });
}

function initPromoterTabs() {
  const promoterSection = document.querySelector("[data-promoter-tabs]");

  if (!promoterSection) {
    return;
  }

  const tabs = Array.from(promoterSection.querySelectorAll("[data-promoter-tab]"));
  const panels = Array.from(promoterSection.querySelectorAll("[data-promoter-panel]"));

  function showPromoter(promoterId) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.promoterTab === promoterId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.promoterPanel === promoterId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showPromoter(tab.dataset.promoterTab);
    });
  });
}

function initImageFallbacks() {
  const framedImages = Array.from(document.querySelectorAll(".promoter-photo img"));

  framedImages.forEach((image) => {
    const frame = image.closest(".promoter-photo");

    function markMissingImage() {
      frame?.classList.add("image-missing");
    }

    image.addEventListener("error", markMissingImage);

    if (image.complete && image.naturalWidth === 0) {
      markMissingImage();
    }
  });
}

function initGovernanceAccordion() {
  const accordion = document.querySelector("[data-governance-accordion]");

  if (!accordion) {
    return;
  }

  const items = Array.from(accordion.querySelectorAll(".governance-item"));

  function closeItem(item) {
    const trigger = item.querySelector(".governance-trigger");
    const icon = item.querySelector(".governance-icon");
    const panel = item.querySelector(".governance-panel");

    item.classList.remove("open");
    trigger?.setAttribute("aria-expanded", "false");
    if (icon) {
      icon.textContent = "+";
    }
    if (panel) {
      panel.style.maxHeight = "0px";
    }
  }

  function openItem(item) {
    const trigger = item.querySelector(".governance-trigger");
    const icon = item.querySelector(".governance-icon");
    const panel = item.querySelector(".governance-panel");

    item.classList.add("open");
    trigger?.setAttribute("aria-expanded", "true");
    if (icon) {
      icon.textContent = "-";
    }
    if (panel) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  }

  items.forEach((item) => {
    const trigger = item.querySelector(".governance-trigger");

    trigger?.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("open");

      items.forEach(closeItem);

      if (shouldOpen) {
        openItem(item);
      }
    });
  });

  window.addEventListener("resize", () => {
    const openPanel = accordion.querySelector(".governance-item.open .governance-panel");

    if (openPanel) {
      openPanel.style.maxHeight = `${openPanel.scrollHeight}px`;
    }
  });
}

function initComplaintForm() {
  const complaintForm = document.getElementById("complaintForm");

  if (!complaintForm) {
    return;
  }

  complaintForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.alert("Complaint submitted successfully.");
    complaintForm.reset();
  });
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const captchaAnswer = contactForm.querySelector("#captchaAnswer");
    const answer = captchaAnswer ? captchaAnswer.value.trim() : "";

    if (answer !== "9") {
      window.alert("Please solve the captcha correctly.");
      return;
    }

    window.alert("Message submitted successfully.");
    contactForm.reset();
  });
}

function initAuctionTable() {
  const tableRoots = Array.from(document.querySelectorAll("[data-auction-table]"));

  if (!tableRoots.length) {
    return;
  }

  tableRoots.forEach((auctionRoot) => {
    const table = auctionRoot.querySelector("[data-table]") || auctionRoot.querySelector("#auctionTable");
    const searchInput = auctionRoot.querySelector("[data-table-search]") || auctionRoot.querySelector("#auctionSearch");
    const entriesSelect = auctionRoot.querySelector("[data-table-entries]") || auctionRoot.querySelector("#auctionEntries");
    const info = auctionRoot.querySelector("[data-table-info]") || auctionRoot.querySelector("#auctionInfo");

    if (!table || !searchInput || !entriesSelect || !info) {
      return;
    }

    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const configuredTotal = Number(auctionRoot.dataset.totalEntries);
    const totalEntries = Number.isFinite(configuredTotal) && configuredTotal > 0 ? configuredTotal : rows.length;

    function updateTable() {
      const query = searchInput.value.trim().toLowerCase();
      const visibleLimit = Number(entriesSelect.value) || rows.length;
      const matchedRows = rows.filter((row) => row.textContent.toLowerCase().includes(query));
      let shownCount = 0;

      rows.forEach((row) => {
        const isMatch = matchedRows.includes(row);
        const shouldShow = isMatch && shownCount < visibleLimit;

        row.hidden = !shouldShow;

        if (shouldShow) {
          shownCount += 1;
        }
      });

      if (matchedRows.length === 0) {
        info.textContent = query
          ? "Showing 0 to 0 of 0 filtered entries"
          : `Showing 0 to 0 of ${totalEntries} entries`;
        return;
      }

      const endCount = Math.min(visibleLimit, matchedRows.length);
      info.textContent = query
        ? `Showing 1 to ${endCount} of ${matchedRows.length} filtered entries`
        : `Showing 1 to ${endCount} of ${totalEntries} entries`;
    }

    searchInput.addEventListener("input", updateTable);
    entriesSelect.addEventListener("change", updateTable);
    updateTable();
  });
}

initLogoIntro();
initSlider();
initNavigation();
initPromoterTabs();
initImageFallbacks();
initGovernanceAccordion();
initComplaintForm();
initContactForm();
initAuctionTable();
