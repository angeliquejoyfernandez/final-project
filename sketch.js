let sounds = {};
let colors = [];
let video;

let recorder, soundFile;
let isRecording = false;

let userSong;
let userSongPaused = false;

let glitchEffects = ['THRESHOLD', 'POSTERIZE', 'INVERT', 'BLUR'];
let currentEffect = 'THRESHOLD';
let randomMode = false;

let messages = [
  "💖 You are the beat",
  "🎀 Glitch it louder",
  "🌈 Sound is your sparkle",
  "🫧 Bubble mode: activated",
  "💥 You broke reality",
  "👾 DJ of dreams",
  "☁️ Soft chaos vibes",
  "⭐ Remix your self",
  "🎧 Drop the cute beat",
  "🦄 Magic sound unlocked"
];
let currentMessage = "";
let messageTimer = 0;

function preload() {
  sounds = {
    A: loadSound('sounds/kick-808.wav'),
    S: loadSound('sounds/snare-808.wav'),
    D: loadSound('sounds/clap-808.wav'),
    F: loadSound('sounds/hihat-808.wav'),
    G: loadSound('sounds/hihat-electro.wav'),
    H: loadSound('sounds/openhat-808.wav'),
    J: loadSound('sounds/kick-zapper.wav'),
    K: loadSound('sounds/perc-laser.wav'),
    L: loadSound('sounds/tom-808.wav'),
    Z: loadSound('sounds/ride-acoustic01.wav'),
    X: loadSound('sounds/shaker-shuffle.wav'),
    C: loadSound('sounds/crash-acoustic.wav')
  };
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
  recorder.setInput();

  noStroke();

  document.getElementById('screenshotBtn').addEventListener('click', () => {
    saveCanvas('dj-artwork', 'png');
  });

  document.getElementById('recordBtn').addEventListener('click', () => {
    if (!isRecording) {
      soundFile = new p5.SoundFile();
      recorder.record(soundFile);
      isRecording = true;
      document.getElementById('recordBtn').textContent = "⏹️ Stop Recording";
      document.getElementById('liveLabel').style.display = 'inline';
    } else {
      recorder.stop();
      isRecording = false;
      document.getElementById('recordBtn').textContent = "⏺️ Start Recording";
      document.getElementById('liveLabel').style.display = 'none';
      document.getElementById('saveBtn').disabled = false;
    }
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    soundFile.save('your-beat');
  });

  document.getElementById('volumeSlider').addEventListener('input', e => {
    let vol = parseFloat(e.target.value);
    for (let key in sounds) {
      sounds[key].setVolume(vol);
    }
    if (userSong) userSong.setVolume(vol);
  });

  document.getElementById('glitchBtn').addEventListener('click', () => {
    currentEffect = random(glitchEffects);
  });

  document.getElementById('toggleRandomBtn').addEventListener('click', () => {
    randomMode = !randomMode;
    document.getElementById('toggleRandomBtn').textContent =
      randomMode ? "🎲 Random Effects: ON" : "🎲 Random Effects: OFF";
  });

  // Upload custom song
  document.getElementById('uploadSong').addEventListener('change', function (e) {
    let file = e.target.files[0];
    if (file) {
      userSong = loadSound(URL.createObjectURL(file), () => {
        userSong.loop();
        userSong.setVolume(1);
        document.getElementById('userSongControls').style.display = 'block';
      });
    }
  });

  // Play/Pause user song
  document.getElementById('pauseUserSongBtn').addEventListener('click', () => {
    if (userSong && userSong.isPlaying()) {
      userSong.pause();
      document.getElementById('pauseUserSongBtn').textContent = '▶️ Play Song';
    } else if (userSong) {
      userSong.loop();
      document.getElementById('pauseUserSongBtn').textContent = '⏸️ Pause Song';
    }
  });

  document.getElementById('userVolumeSlider').addEventListener('input', e => {
    let vol = parseFloat(e.target.value);
    if (userSong) userSong.setVolume(vol);
  });

  document.querySelectorAll('.pad').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      triggerSound(key);
    });
  });
}

function draw() {
  image(video, 0, 0);
  applyEffect();

  fill(255, 200, 255, 100);
  ellipse(mouseX + sin(frameCount * 0.1) * 10, mouseY, 20 + sin(frameCount * 0.3) * 5);

  if (frameCount % 300 === 0) {
    currentMessage = random(messages);
    messageTimer = 180;
  }

  if (messageTimer > 0) {
    fill(255, 120, 200, map(messageTimer, 0, 180, 0, 255));
    textSize(12);
    textAlign(LEFT, CENTER);
    text(currentMessage, 10, height / 2);
    messageTimer--;
  }

  for (let c of colors) {
    fill(c.r, c.g, c.b, 80);
    ellipse(c.x, c.y, c.size);
    c.size *= 0.95;
    c.r += random(-2, 2);
    c.g += random(-2, 2);
    c.b += random(-2, 2);
  }

  colors = colors.filter(c => c.size > 5);
}

function applyEffect() {
  switch (currentEffect) {
    case 'THRESHOLD': filter(THRESHOLD); break;
    case 'POSTERIZE': filter(POSTERIZE, 4); break;
    case 'INVERT': filter(INVERT); break;
    case 'BLUR': filter(BLUR, 1); break;
  }
}

function keyPressed() {
  triggerSound(key.toUpperCase());
}

function triggerSound(k) {
  if (sounds[k]) {
    sounds[k].play();
    spawnVisuals();

    if (randomMode) {
      currentEffect = random(glitchEffects);
    }

    const btn = document.querySelector(`.pad[data-key="${k}"]`);
    if (btn) {
      btn.classList.add('flash');
      setTimeout(() => btn.classList.remove('flash'), 150);
    }
  }
}

function spawnVisuals() {
  colors.push({
    x: random(width),
    y: random(height),
    size: random(50, 150),
    r: random(150, 255),
    g: random(50, 200),
    b: random(200, 255)
  });
}

