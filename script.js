const audio = document.getElementById("birthday-song");
const button = document.getElementById("music-toggle");
const status = document.getElementById("audio-status");

audio.volume = 0.42;

function setPlayingState(isPlaying) {
  button.textContent = isPlaying ? "Pause Song" : "Play Song";
  status.textContent = isPlaying
    ? "Birthday song is playing in the background."
    : "Song is paused. Tap Play Song anytime.";
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
    status.textContent = "Audio did not start. Try tapping Play Song again.";
    console.error("Birthday song play failed:", err);
  }
});

audio.addEventListener("error", () => {
  status.textContent = "Birthday song is unavailable. Please reload the page.";
});
