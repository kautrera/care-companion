/**
 * Soft chime + vibration helpers. Volume is intentionally low so the patient
 * isn't startled; vibration is a brief double-tap pattern.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

interface ToneOpts {
  frequency: number;
  duration: number;
  volume?: number;
  type?: OscillatorType;
}

function playTone({ frequency, duration, volume = 0.08, type = "sine" }: ToneOpts) {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") {
    audio.resume().catch(() => undefined);
  }
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + duration
  );
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration + 0.05);
}

export function playConfirmChime() {
  playTone({ frequency: 660, duration: 0.16 });
  setTimeout(() => playTone({ frequency: 880, duration: 0.22 }), 140);
}

export function playYesChime() {
  playTone({ frequency: 740, duration: 0.16 });
  setTimeout(() => playTone({ frequency: 990, duration: 0.22 }), 130);
}

export function playNoChime() {
  playTone({ frequency: 440, duration: 0.18, type: "triangle" });
  setTimeout(
    () => playTone({ frequency: 330, duration: 0.22, type: "triangle" }),
    150
  );
}

export function vibrateShort() {
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.([60, 40, 60]);
}

export function vibrateLong() {
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.(180);
}
