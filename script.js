// Initialize AOS animations
function initAOS() {
  AOS.init({
    duration: 1000,
    easing: "ease-out-cubic",
    once: true,
    offset: 100,
  });
}

  // Configure Particles.js
  function initParticles() {
    particlesJS('particles-js', {
        particles: {
          number: { value: 120, density: { enable: true, value_area: 800 } },
          color: { value: ['#4A90E2', '#50E3C2', '#FFFFFF'] }, // Dynamic particles
          shape: { type: 'circle' },
          opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
          size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
          line_linked: { enable: true, distance: 120, color: '#4A90E2', opacity: 0.3, width: 1.5 },
          move: { enable: true, speed: 3, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
          modes: { grab: { distance: 150, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    particlesJS('particles-js', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } }, // Fewer snow particles
          color: { value: '#FFFFFF' }, // Pure white for snow
          shape: { type: 'circle' },
          opacity: { value: 0.6, random: true, anim: { enable: false } },
          size: { value: 3, random: true, anim: { enable: false } },
          line_linked: { enable: false }, // No connections for snow
          move: {
            enable: true,
            speed: 1, // Slower movement for snow effect
            direction: 'bottom', // Falling effect
            straight: true, // Straight fall
            out_mode: 'out', // Particles disappear when out of bounds
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: false }, onclick: { enable: false } }, // No interaction for snow
          modes: {}
        },
        retina_detect: true
      });
  }

// Handle menu toggle
function initMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  menuToggle.addEventListener("click", () => {
    const isExpanded = navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isExpanded);
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      targetElement.scrollIntoView({ behavior: "smooth" });
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");

      document.querySelectorAll(".nav-menu a").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

// Handle back to top button
function initBackToTop() {
  const backToTop = document.querySelector(".back-to-top");
  const progressCircle = backToTop.querySelector(".progress-circle circle");

  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 400 ? "flex" : "none";
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const offset = 283 - scrollPercent * 283;
    progressCircle.style.strokeDashoffset = offset;
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Animate stats on scroll
function initStatsAnimation() {
  const counters = document.querySelectorAll(".count");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-target"));
          let count = 0;
          const updateCounter = () => {
            const increment = target / 100;
            count += increment;
            if (count < target) {
              counter.textContent = Math.ceil(count);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          updateCounter();
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

// Handle testimonials carousel
function initTestimonialsCarousel() {
  const carousel = document.querySelector(".testimonials-carousel");
  const cards = carousel.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  let currentIndex = 0;

  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  });

  showCard(currentIndex);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  }, 5000);
}

// Handle contact form submission
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const submitButton = contactForm.querySelector("button[type='submit']");

  function validateForm() {
    const name = contactForm.querySelector("input[name='name']").value.trim();
    const email = contactForm.querySelector("input[name='email']").value.trim();
    const message = contactForm.querySelector("textarea[name='message']").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return name.length >= 2 && emailRegex.test(email) && message.length >= 10;
  }

  contactForm.addEventListener("input", () => {
    submitButton.disabled = !validateForm();
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      formMessage.textContent = "Please fill out all fields correctly.";
      formMessage.style.color = "#EF4444";
      return;
    }

    submitButton.disabled = true;
    formMessage.textContent = "Sending message...";
    formMessage.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formMessage.textContent = "Message sent successfully!";
        formMessage.style.color = "#10B981";
        contactForm.reset();
        submitButton.disabled = true;
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      formMessage.textContent = "Failed to send message. Please try again.";
      formMessage.style.color = "#EF4444";
    } finally {
      setTimeout(() => {
        formMessage.textContent = "";
        submitButton.disabled = false;
      }, 3000);
    }
  });
}

// Handle theme toggle
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme") || (prefersDarkScheme.matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", currentTheme);
  themeToggle.querySelector("i").className = currentTheme === "dark" ? "bx bx-moon" : "bx bx-sun";

  themeToggle.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.querySelector("i").className = newTheme === "dark" ? "bx bx-moon" : "bx bx-sun";
  });
}

// Initialize all functionality
document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initParticles();
  initMenuToggle();
  initBackToTop();
  initStatsAnimation();
  initTestimonialsCarousel();
  initContactForm();
  initThemeToggle();
});