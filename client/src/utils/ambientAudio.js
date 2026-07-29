/**
 * Professional Web Audio API Synthesizer for Focus Mode Ambient Sounds.
 * Generates high-fidelity Soft Rain, Oscillating Ocean Waves, Coffee Shop hum, and Pure White Noise.
 */

let audioCtx = null;
let currentNodes = null; // { source, filter, lfo, lfoGain, gain }

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAmbientSound(type, volume = 0.5) {
  stopAmbientSound();

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // Create 5-second seamless noise buffer
  const bufferSize = ctx.sampleRate * 5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate pink/brown/white noise base
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    if (type === 'waves' || type === 'coffee') {
      // Brown Noise (smooth deep rumble)
      data[i] = (b0 + 0.02 * white) / 1.02;
      b0 = data[i];
      data[i] *= 3.5;
    } else if (type === 'rain') {
      // Pink Noise (natural rain frequency curve)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    } else {
      // White Noise
      data[i] = white * 0.25;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Filter chain
  const filter = ctx.createBiquadFilter();
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(Math.max(0.1, volume), ctx.currentTime);

  let lfo = null;
  let lfoGain = null;

  if (type === 'rain') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
  } else if (type === 'waves') {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    // Low Frequency Oscillator (LFO) for periodic ocean wave swell effect (0.12 Hz = ~8 second wave cycle)
    lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);

    lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.35, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(mainGain.gain);
    lfo.start();
  } else if (type === 'coffee') {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);
  } else {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);
  }

  source.connect(filter);
  filter.connect(mainGain);
  mainGain.connect(ctx.destination);

  source.start();
  currentNodes = { source, filter, lfo, lfoGain, gain: mainGain };
}

export function setAmbientVolume(volume) {
  if (currentNodes && currentNodes.gain && audioCtx) {
    currentNodes.gain.gain.setValueAtTime(Math.max(0.05, volume), audioCtx.currentTime);
  }
}

export function stopAmbientSound() {
  if (currentNodes) {
    try {
      if (currentNodes.source) {
        currentNodes.source.stop();
        currentNodes.source.disconnect();
      }
      if (currentNodes.lfo) {
        currentNodes.lfo.stop();
        currentNodes.lfo.disconnect();
      }
      if (currentNodes.filter) currentNodes.filter.disconnect();
      if (currentNodes.gain) currentNodes.gain.disconnect();
    } catch (e) {}
    currentNodes = null;
  }
}
