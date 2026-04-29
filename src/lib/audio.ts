/**
 * Soft chime + vibration helpers and localized text-to-speech. Volume is
 * intentionally low and patterns short so the patient isn't startled.
 *
 * All playback is gated on the user's audio preferences in the Zustand
 * store: chimes + vibration follow `soundsEnabled`, speech follows
 * `voiceEnabled`. When a flag is off the corresponding helper no-ops.
 */
import { useAppStore } from "../store/useAppStore";

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

function soundsOn(): boolean {
  return useAppStore.getState().soundsEnabled;
}

function voiceOn(): boolean {
  return useAppStore.getState().voiceEnabled;
}

export function playConfirmChime() {
  if (!soundsOn()) return;
  playTone({ frequency: 660, duration: 0.16 });
  setTimeout(() => playTone({ frequency: 880, duration: 0.22 }), 140);
}

export function playYesChime() {
  if (!soundsOn()) return;
  playTone({ frequency: 740, duration: 0.16 });
  setTimeout(() => playTone({ frequency: 990, duration: 0.22 }), 130);
}

export function playNoChime() {
  if (!soundsOn()) return;
  playTone({ frequency: 440, duration: 0.18, type: "triangle" });
  setTimeout(
    () => playTone({ frequency: 330, duration: 0.22, type: "triangle" }),
    150
  );
}

export function vibrateShort() {
  if (!soundsOn()) return;
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.([60, 40, 60]);
}

export function vibrateLong() {
  if (!soundsOn()) return;
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.(180);
}

/**
 * Speak a localized string. Cancels any in-flight utterance first so quick
 * navigation doesn't queue up old questions. No-ops if voice is disabled or
 * the platform doesn't support SpeechSynthesis.
 */
export function speak(text: string, lang: string) {
  if (!voiceOn()) return;
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.95;
  u.pitch = 1;
  synth.speak(u);
}

export function cancelSpeak() {
  if (typeof window === "undefined") return;
  window.speechSynthesis?.cancel();
}

/**
 * iOS Safari blocks SpeechSynthesis until the first utterance is triggered
 * from a real user gesture. Call this from a tap handler that navigates to
 * a screen which will speak on mount, so the gesture context is preserved.
 */
export function primeAudio() {
  if (typeof window === "undefined") return;
  // Resume the audio context (also gesture-gated on iOS).
  getCtx()?.resume().catch(() => undefined);
  const synth = window.speechSynthesis;
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  synth.speak(u);
}
