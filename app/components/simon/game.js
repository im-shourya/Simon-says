export const COLORS = ["green", "red", "yellow", "blue"];

export const GAME_STATES = {
  IDLE: "idle",
  SHOWING_SEQUENCE: "showing-sequence",
  PLAYER_TURN: "player-turn",
  GAME_OVER: "game-over",
};

export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

export const getPlaybackSpeed = (round) => {
  return Math.max(250, 600 - round * 30);
};

let audioCtx = null;

const FREQUENCIES = {
  green: 415.3,
  red: 311.13,
  yellow: 277.18,
  blue: 207.65,
};

export const playTone = (color, durationMs = 300) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = FREQUENCIES[color];

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + durationMs / 1000);

    oscillator.start(now);
    oscillator.stop(now + durationMs / 1000);
  } catch (error) {
    console.error("Audio playback failed", error);
  }
};
