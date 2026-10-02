const PASSCODE = '0311';

const screens = {
  unlock: document.getElementById('unlock-screen'),
  question: document.getElementById('question-screen'),
  letter: document.getElementById('letter-screen'),
  gifts: document.getElementById('gifts-screen'),
  heart: document.getElementById('heart-screen'),
  bomb: document.getElementById('bomb-screen'),
  song: document.getElementById('song-screen')
};

const unlockInput = document.getElementById('passcode-input');
const unlockBtn = document.getElementById('unlock-btn');
const unlockMessage = document.getElementById('unlock-message');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const heartBtn = document.getElementById('heart-btn');
const heartNote = document.getElementById('heart-note');
const bombBtn = document.getElementById('bomb-btn');
const bombNote = document.getElementById('bomb-note');
const bombVisual = document.getElementById('bomb-visual');
const songBtn = document.getElementById('play-song-btn');
const songStatus = document.getElementById('song-status');
const ratingButtons = document.querySelectorAll('.rating-btn');
const ratingMessage = document.getElementById('rating-message');

let currentScale = 1;
let audioCtx = null;
let musicStarted = false;

function showScreen(name) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove('active');
  });
  screens[name].classList.add('active');
}

unlockBtn.addEventListener('click', () => {
  const value = unlockInput.value.trim();
  if (value === PASSCODE) {
    unlockMessage.textContent = 'Correct! Welcome to your surprise 💖';
    unlockMessage.classList.remove('hidden');
    setTimeout(() => showScreen('question'), 700);
  } else {
    unlockMessage.textContent = 'Wrong code. Try again.';
    unlockMessage.classList.remove('hidden');
    unlockInput.value = '';
    unlockInput.focus();
  }
});

unlockInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    unlockBtn.click();
  }
});

noBtn.addEventListener('click', () => {
  currentScale += 0.12;
  yesBtn.style.transform = `scale(${Math.min(currentScale, 2.3)})`;
  yesBtn.classList.add('grow');
  setTimeout(() => yesBtn.classList.remove('grow'), 300);
  noBtn.textContent = 'Nope 😅';
});

yesBtn.addEventListener('click', () => {
  showScreen('letter');
});

const giftBoxes = document.querySelectorAll('.gift-box');
giftBoxes.forEach((box) => {
  box.addEventListener('click', () => {
    const note = box.dataset.note;
    const overlay = document.createElement('div');
    overlay.className = 'heart-note';
    overlay.textContent = note;
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.style.background = 'rgba(47, 15, 12, 0.38)';
    overlay.style.zIndex = '20';
    overlay.style.fontSize = 'clamp(1.4rem, 4vw, 2.2rem)';
    overlay.style.fontWeight = '700';
    overlay.style.padding = '20px';
    overlay.style.textAlign = 'center';
    overlay.style.color = '#fff5f0';
    overlay.style.backdropFilter = 'blur(4px)';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Next 💞';
    closeBtn.style.marginTop = '18px';
    closeBtn.className = 'primary-btn';
    closeBtn.addEventListener('click', () => {
      overlay.remove();
      showScreen('heart');
    });

    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
  });
});

heartBtn.addEventListener('click', () => {
  heartBtn.classList.add('burst');
  setTimeout(() => {
    heartBtn.style.display = 'none';
    heartNote.classList.remove('hidden');
    const kissContainer = document.getElementById('floating-kisses');
    for (let i = 0; i < 18; i += 1) {
      const kiss = document.createElement('span');
      kiss.textContent = i % 2 === 0 ? '💋' : '💞';
      const angle = (Math.PI * 2 * i) / 18;
      const radius = 120 + Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      kiss.style.setProperty('--x', `${x}px`);
      kiss.style.setProperty('--y', `${y}px`);
      kiss.style.left = '50%';
      kiss.style.top = '50%';
      kiss.style.animationDelay = `${i * 0.06}s`;
      kissContainer.appendChild(kiss);
    }
    setTimeout(() => {
      heartNote.textContent = 'I love you babyy 💞';
      setTimeout(() => showScreen('bomb'), 1800);
    }, 900);
  }, 300);
});

bombBtn.addEventListener('click', () => {
  bombBtn.classList.add('exploded');
  bombVisual.classList.add('blast');
  bombNote.classList.remove('hidden');
  setTimeout(() => {
    showScreen('song');
  }, 1500);
});

songBtn.addEventListener('click', () => {
  startMusic();
});

ratingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    ratingButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    const value = button.dataset.value;
    ratingMessage.textContent = `Thanks for rating it ${value}/10 💕`;
    ratingMessage.classList.remove('hidden');
  });
});

function startMusic() {
  const notes = [
    { note: 'C4', duration: 0.42 },
    { note: 'E4', duration: 0.42 },
    { note: 'G4', duration: 0.42 },
    { note: 'A4', duration: 0.56 },
    { note: 'G4', duration: 0.42 },
    { note: 'E4', duration: 0.42 },
    { note: 'D4', duration: 0.42 },
    { note: 'C4', duration: 0.56 },
    { note: 'E4', duration: 0.42 },
    { note: 'G4', duration: 0.42 },
    { note: 'A4', duration: 0.42 },
    { note: 'G4', duration: 0.42 },
    { note: 'E4', duration: 0.42 },
    { note: 'D4', duration: 0.56 },
    { note: 'C4', duration: 0.9 }
  ];

  if (musicStarted) return;
  musicStarted = true;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    songStatus.textContent = 'Your browser does not support audio playback.';
    return;
  }

  audioCtx = new AudioContextClass();
  const now = audioCtx.currentTime + 0.12;
  let currentTime = now;

  notes.forEach(({ note, duration }) => {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequencyFromNote(note);
    gain.gain.setValueAtTime(0.0001, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration);
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration + 0.05);
    currentTime += duration + 0.05;
  });

  songStatus.textContent = 'Playing your song for baby 💘';
}

function frequencyFromNote(note) {
  const frequencies = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    G4: 392.0,
    A4: 440.0
  };
  return frequencies[note] || 440;
}

showScreen('unlock');
