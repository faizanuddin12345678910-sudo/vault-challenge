// stage-sound.js
// Drop this file into your app and include it on pages where stages complete.
// Use a path that resolves correctly when index.html is served from the repo root.

(function () {
  // When index.html is at the repo root and the MP3 is at public/sounds/,
  // use the following relative path so previews (raw.githack/raw.githubusercontent) load it correctly.
  const soundUrl = 'public/sounds/fart-9-228245.mp3';
  const audio = new Audio(soundUrl);
  audio.preload = 'auto';
  audio.volume = 0.9; // adjust as needed

  // Try to allow immediate playback by warming the audio on first user gesture
  let unlocked = false;
  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {
      // ignore play errors (browser may still block); later plays may succeed
    });
    // remove listeners
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  }

  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });

  // Play when someone dispatches the 'stage:complete' custom event
  window.addEventListener('stage:complete', () => {
    try {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && p.catch) p.catch(err => {
        // play blocked or error — optional: console.warn(err)
      });
    } catch (e) {
      // fallback: create a new audio each time
      const a = new Audio(soundUrl);
      a.play().catch(() => {});
    }
  });

  // Optional helper: expose a global function triggerStageSound()
  window.triggerStageSound = function () {
    window.dispatchEvent(new CustomEvent('stage:complete'));
  };
})();
