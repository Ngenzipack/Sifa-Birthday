const audio = document.getElementById("birthday-song");
const button = document.getElementById("music-toggle");
const pdfButton = document.getElementById("pdf-download");
const status = document.getElementById("audio-status");
const progress = document.getElementById("scroll-progress");
const parallaxLayers = Array.from(document.querySelectorAll("[data-parallax]"));
const revealElements = Array.from(document.querySelectorAll(".reveal"));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

audio.volume = 0.42;
let resumeAfterPrint = false;

if (!status.textContent.trim()) {
  status.textContent = "Tap Play, then scroll.";
}

function setPlayingState(isPlaying) {
  button.textContent = isPlaying ? "Pause Song" : "Play Song";
  status.textContent = isPlaying
    ? "Song is playing. Keep scrolling through your birthday story."
    : "Song is paused. Tap Play Song to continue.";
}

button.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    setPlayingState(false);
    return;
  }

  try {
    await audio.play();
    setPlayingState(true);
  } catch (err) {
    status.textContent = "Audio could not start. Tap Play Song again.";
    console.error("Birthday song play failed:", err);
  }
});

audio.addEventListener("error", () => {
  status.textContent = "Birthday song is unavailable. Please reload the page.";
});

if (pdfButton) {
  pdfButton.addEventListener("click", () => {
    resumeAfterPrint = !audio.paused;
    status.textContent = "Opening PDF options...";
    window.print();
  });
}

window.addEventListener("afterprint", async () => {
  if (resumeAfterPrint && audio.paused) {
    try {
      await audio.play();
      setPlayingState(true);
      resumeAfterPrint = false;
      return;
    } catch (err) {
      console.error("Unable to resume audio after print:", err);
    }
  }

  status.textContent = audio.paused
    ? "PDF step done. Tap Play and keep scrolling."
    : "Song is playing. Keep scrolling through your birthday story.";
  resumeAfterPrint = false;
});

if (!reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.24,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const percent = (scrollTop / maxScroll) * 100;
  progress.style.width = `${percent.toFixed(2)}%`;

  if (reducedMotion) {
    return;
  }

  parallaxLayers.forEach((layer) => {
    const speed = Number.parseFloat(layer.dataset.speed || "0.12");
    const rect = layer.getBoundingClientRect();
    const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
    const offset = clamp(-distanceFromCenter * speed, -140, 140);
    layer.style.setProperty("--parallax", `${offset.toFixed(2)}px`);
  });
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      updateScrollEffects();
      ticking = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();
