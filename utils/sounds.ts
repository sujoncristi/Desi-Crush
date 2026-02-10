
let audioCtx: AudioContext | null = null;
let musicInterval: any = null;
let musicGain: GainNode | null = null;
let masterSfxVolume = 0.5;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const setMusicVolume = (v: number) => {
  if (musicGain) musicGain.gain.setValueAtTime(v * 0.2, getCtx().currentTime);
};

export const setSfxVolume = (v: number) => {
  masterSfxVolume = v;
};

export const startBackgroundMusic = () => {
  const ctx = getCtx();
  if (musicInterval) return;

  musicGain = ctx.createGain();
  musicGain.gain.setValueAtTime(0.05, ctx.currentTime);
  musicGain.connect(ctx.destination);

  let step = 0;
  const bpm = 110;
  const stepTime = 60 / bpm / 2;

  musicInterval = setInterval(() => {
    const time = ctx.currentTime;
    if (step % 2 === 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, time);
      osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
      g.gain.setValueAtTime(0.1, time);
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(g);
      g.connect(musicGain!);
      osc.start(time);
      osc.stop(time + 0.1);
    }
    step = (step + 1) % 16;
  }, stepTime * 1000);
};

export const stopBackgroundMusic = () => {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  if (musicGain) {
    musicGain.gain.exponentialRampToValueAtTime(0.001, getCtx().currentTime + 0.5);
  }
};

const playSfx = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(masterSfxVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playPop = () => playSfx(600, 'sine', 0.1);
export const playSwap = () => playSfx(300, 'triangle', 0.05);
export const playSpecial = () => playSfx(150, 'square', 0.3);
export const playWin = () => [523, 659, 783].forEach((f, i) => setTimeout(() => playSfx(f, 'sine', 0.3), i * 100));
export const playLose = () => playSfx(100, 'sawtooth', 0.5);
