// Synthesized Audio Notification chime using Web Audio API
// Completely offline, no external audio files required, failsafe for any browser

let audioCtx: AudioContext | null = null;

export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Two-tone harmonic bell: note 1 (587.33 Hz / D5) then note 2 (880 Hz / A5)
    const tones = [
      { freq: 587.33, start: 0, duration: 0.2 },
      { freq: 880.0, start: 0.15, duration: 0.35 }
    ];

    tones.forEach((tone) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.freq, now + tone.start);

      // Smooth attack and exponential decay
      gain.gain.setValueAtTime(0.001, now + tone.start);
      gain.gain.exponentialRampToValueAtTime(0.25, now + tone.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + tone.start);
      osc.stop(now + tone.start + tone.duration);
    });
  } catch (err) {
    // Ignore autoplay or audio context constraints safely
  }
};
