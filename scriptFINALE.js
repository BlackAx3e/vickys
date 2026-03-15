const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const form = document.querySelector(".join-form");
const submitButton = form?.querySelector("button[type='submit']");

if (form && submitButton) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitButton.textContent = "Grazie, ti contatteremo presto";
    submitButton.disabled = true;
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
let parallaxTicking = false;

const updateParallax = () => {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed) || 0.1;
    item.style.setProperty("--parallax-offset", `${scrollY * speed}px`);
  });
  parallaxTicking = false;
};

const onScroll = () => {
  if (!parallaxTicking) {
    window.requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
};

const enableParallax = () => {
  window.addEventListener("scroll", onScroll, { passive: true });
  updateParallax();
};

const disableParallax = () => {
  window.removeEventListener("scroll", onScroll);
  parallaxItems.forEach((item) => item.style.setProperty("--parallax-offset", "0px"));
};

if (!prefersReducedMotion.matches) {
  enableParallax();
}

prefersReducedMotion.addEventListener("change", (event) => {
  if (event.matches) {
    disableParallax();
  } else {
    enableParallax();
  }
});

const tiltCards = document.querySelectorAll("[data-tilt]");

const handleTilt = (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateX = ((y / rect.height) - 0.5) * -12;
  const rotateY = ((x / rect.width) - 0.5) * 12;
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

const resetTilt = (event) => {
  event.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
};

if (!prefersReducedMotion.matches) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", handleTilt);
    card.addEventListener("mouseleave", resetTilt);
  });
}

const storyTitle = document.querySelector(".story-title");
const storyText = document.querySelector(".story-text");
const steps = Array.from(document.querySelectorAll(".step"));
const progressDots = Array.from(document.querySelectorAll(".progress-dot"));

const activateStep = (step) => {
  steps.forEach((item) => item.classList.remove("active"));
  step.classList.add("active");

  if (storyTitle && storyText) {
    storyTitle.textContent = step.dataset.title || "";
    storyText.textContent = step.dataset.text || "";
  }

  const index = steps.indexOf(step);
  progressDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
};

if (steps.length) {
  activateStep(steps[0]);
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateStep(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  steps.forEach((step) => stepObserver.observe(step));
}