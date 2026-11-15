document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initPackages();
  initCalculator();
  initTestimonials();
  initGallery();
});

function initNav() {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (!navToggle || !mainNav) return;

  function setNavOpen(isOpen) {
    mainNav.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", function () {
    setNavOpen(!mainNav.classList.contains("open"));
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) {
      setNavOpen(false);
    }
  });
}

function initPackages() {
  const packagesGrid = document.getElementById("packagesGrid");
  if (!packagesGrid) return;

  const defaultWhatsAppNumber = "923008292033";
  const localStorageKey = "lavishPackagesData";

  function normalizePackage(pkg) {
    return {
      title: pkg && pkg.title ? String(pkg.title) : "Package",
      price: pkg && pkg.price ? String(pkg.price) : "Custom Pricing",
      features: Array.isArray(pkg && pkg.features) ? pkg.features.map(String).filter(Boolean) : [],
      popular: Boolean(pkg && pkg.popular),
      whatsappNumber: pkg && pkg.whatsappNumber ? String(pkg.whatsappNumber) : defaultWhatsAppNumber
    };
  }

  function renderPackages(packagesList) {
    packagesGrid.innerHTML = "";
    packagesList.forEach(function (pkg) {
      const article = document.createElement("article");
      article.className = "package-card" + (pkg.popular ? " package-popular" : "");

      if (pkg.popular) {
        const badge = document.createElement("span");
        badge.className = "popular-badge";
        badge.textContent = "Most Popular";
        article.appendChild(badge);
      }

      const title = document.createElement("h3");
      title.textContent = pkg.title;
      article.appendChild(title);

      const price = document.createElement("p");
      price.className = "package-price";
      price.textContent = pkg.price;
      article.appendChild(price);

      const features = document.createElement("ul");
      features.className = "package-features";
      pkg.features.forEach(function (featureText) {
        const li = document.createElement("li");
        li.textContent = featureText;
        features.appendChild(li);
      });
      article.appendChild(features);

      const button = document.createElement("a");
      button.className = "btn btn-primary package-btn";
      button.href = "https://wa.me/" + (pkg.whatsappNumber || defaultWhatsAppNumber);
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.textContent = "Get Quote";
      article.appendChild(button);

      packagesGrid.appendChild(article);
    });
  }

  function getLocalPackages() {
    try {
      const raw = localStorage.getItem(localStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return null;
      return parsed.map(normalizePackage);
    } catch (err) {
      return null;
    }
  }

  const localPackages = getLocalPackages();
  if (localPackages) {
    renderPackages(localPackages);
    return;
  }

  fetch("assets/data/packages.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Failed to load packages.json");
      return response.json();
    })
    .then(function (data) {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid package data");
      }
      renderPackages(data.map(normalizePackage));
    })
    .catch(function () {
      renderPackages([
        normalizePackage({
          title: "Basic Package",
          price: "Rs. 700/head",
          popular: false,
          whatsappNumber: defaultWhatsAppNumber,
          features: [
            "Starter + 1 main course + dessert",
            "Professional buffet setup",
            "Serving staff included",
            "Ideal for small family events"
          ]
        }),
        normalizePackage({
          title: "Standard Wedding",
          price: "Rs. 1800-2500/head",
          popular: true,
          whatsappNumber: defaultWhatsAppNumber,
          features: [
            "Multiple starters and premium mains",
            "Customized menu consultation",
            "Full service team on-site",
            "Wedding buffet presentation",
            "Dessert and beverage options"
          ]
        }),
        normalizePackage({
          title: "Premium Events",
          price: "Custom Pricing",
          popular: false,
          whatsappNumber: defaultWhatsAppNumber,
          features: [
            "Fully bespoke event menu",
            "Live stations and specialty dishes",
            "Premium tableware and setup",
            "Dedicated event coordinator"
          ]
        })
      ]);
    });
}

function initCalculator() {
  const guestCountEl = document.getElementById("guestCount");
  const eventTypeEl = document.getElementById("eventType");
  const riceItemEl = document.getElementById("riceItem");
  const gravyItemEl = document.getElementById("gravyItem");
  const bbqItemEl = document.getElementById("bbqItem");
  const dessertItemEl = document.getElementById("dessertItem");
  const estimatedTotalEl = document.getElementById("estimatedTotal");
  const whatsappQuoteBtn = document.getElementById("whatsappQuoteBtn");

  if (!guestCountEl || !eventTypeEl || !riceItemEl || !gravyItemEl || !bbqItemEl || !dessertItemEl || !estimatedTotalEl || !whatsappQuoteBtn) {
    return;
  }

  // Hardcoded for now; can be replaced with admin-configured values later.
  const config = {
    per100Kg: {
      rice: 8,
      gravy: 10,
      bbq: 10,
      dessert: 12
    },
    pricesPerKg: {
      rice: 1900,
      gravy: 1400,
      bbq: 1200,
      dessert: 1400
    },
    eventMultipliers: {
      Wedding: 1.15,
      Mehndi: 1.05,
      Corporate: 1.1
    }
  };

  function formatPKR(value) {
    return "Rs. " + Math.round(value).toLocaleString("en-PK");
  }

  function itemLabel(value, fallback) {
    return value && value.trim() ? value : fallback;
  }

  function updateEstimate() {
    const guests = Number(guestCountEl.value) || 0;
    const eventType = eventTypeEl.value;
    const riceItem = riceItemEl.value;
    const gravyItem = gravyItemEl.value;
    const bbqItem = bbqItemEl.value;
    const dessertItem = dessertItemEl.value;

    const blocksOf100 = guests / 100;
    const riceCost = riceItem ? blocksOf100 * config.per100Kg.rice * config.pricesPerKg.rice : 0;
    const gravyCost = gravyItem ? blocksOf100 * config.per100Kg.gravy * config.pricesPerKg.gravy : 0;
    const bbqCost = blocksOf100 * config.per100Kg.bbq * config.pricesPerKg.bbq;
    const dessertCost = blocksOf100 * config.per100Kg.dessert * config.pricesPerKg.dessert;

    const subtotal = riceCost + gravyCost + bbqCost + dessertCost;
    const multiplier = config.eventMultipliers[eventType] || 1;
    const total = subtotal * multiplier;

    estimatedTotalEl.textContent = formatPKR(total);
    estimatedTotalEl.classList.remove("updated");
    void estimatedTotalEl.offsetWidth;
    estimatedTotalEl.classList.add("updated");

    const messageLines = [
      "Assalam o Alaikum, I need an exact catering quote.",
      "",
      "Event Cost Calculator Selection:",
      `Guests: ${guests}`,
      `Event Type: ${eventType}`,
      `Rice Item: ${itemLabel(riceItem, "None")}`,
      `Gravy Item: ${itemLabel(gravyItem, "None")}`,
      `BBQ Item: ${itemLabel(bbqItem, "Not selected")}`,
      `Dessert Item: ${itemLabel(dessertItem, "Not selected")}`,
      `Estimated Cost: ${formatPKR(total)}`
    ];

    const encodedMessage = encodeURIComponent(messageLines.join("\n"));
    whatsappQuoteBtn.href = `https://wa.me/923008292033?text=${encodedMessage}`;
  }

  [guestCountEl, eventTypeEl, riceItemEl, gravyItemEl, bbqItemEl, dessertItemEl].forEach(function (el) {
    el.addEventListener("change", updateEstimate);
  });

  updateEstimate();
}

function initTestimonials() {
  const carousel = document.getElementById("testimonialsCarousel");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const dotsWrap = document.getElementById("testimonialDots");
  const slides = document.querySelectorAll("#testimonialTrack .testimonial-card");

  if (!carousel || !prevBtn || !nextBtn || !dotsWrap || !slides.length) return;

  let activeIndex = 0;
  let autoSlideTimer = null;
  const AUTO_SLIDE_MS = 5000;
  const dots = [];

  slides.forEach(function (_, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "testimonial-dot";
    dot.setAttribute("aria-label", "Go to testimonial " + (index + 1));
    dot.addEventListener("click", function () {
      showSlide(index);
      startAutoSlide();
    });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === activeIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === activeIndex);
    });
  }

  function nextSlide() {
    showSlide(activeIndex + 1);
  }

  function prevSlide() {
    showSlide(activeIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, AUTO_SLIDE_MS);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  prevBtn.addEventListener("click", function () {
    prevSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener("click", function () {
    nextSlide();
    startAutoSlide();
  });

  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);
  carousel.addEventListener("focusin", stopAutoSlide);
  carousel.addEventListener("focusout", startAutoSlide);

  showSlide(0);
  startAutoSlide();
}

function initGallery() {
  const filterButtons = document.querySelectorAll("#galleryFilters .gallery-filter");
  const galleryItems = document.querySelectorAll(".gallery-grid .gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  if (!galleryItems.length) return;

  let visibleImages = [];
  let currentIndex = 0;

  function getVisibleImages() {
    return Array.from(galleryItems)
      .filter(function (item) { return !item.classList.contains("hidden"); })
      .map(function (item) { return item.querySelector(".glight"); })
      .filter(Boolean);
  }

  function applyFilter(filterValue) {
    galleryItems.forEach(function (item) {
      const category = item.getAttribute("data-category");
      const shouldShow = filterValue === "all" || category === filterValue;
      item.classList.toggle("hidden", !shouldShow);
    });
    visibleImages = getVisibleImages();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");
      filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
      button.classList.add("active");
      applyFilter(filter);
    });
  });

  function openLightboxByImage(imgEl) {
    visibleImages = getVisibleImages();
    currentIndex = visibleImages.indexOf(imgEl);
    if (currentIndex < 0) return;
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function showImageByIndex(nextIndex) {
    if (!visibleImages.length) return;
    currentIndex = (nextIndex + visibleImages.length) % visibleImages.length;
    const nextImg = visibleImages[currentIndex];
    lightboxImg.src = nextImg.src;
    lightboxImg.alt = nextImg.alt || "";
  }

  galleryItems.forEach(function (item) {
    const image = item.querySelector(".glight");
    if (!image) return;
    image.addEventListener("click", function () {
      openLightboxByImage(image);
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener("click", function () {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      showImageByIndex(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      showImageByIndex(currentIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (event.key === "Escape") {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    } else if (event.key === "ArrowLeft") {
      showImageByIndex(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      showImageByIndex(currentIndex + 1);
    }
  });

  applyFilter("all");
}
  