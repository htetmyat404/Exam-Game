const questions = [
  {
    id: 1,
    text: "အဓိက အပိုင်း ၃ပိုင်း ကို ဖြေဆိုပါ",
    correctKeywords: ["computer", "network", "power"]
  },
  {
    id: 2,
    text: "ဖုန်းတစ်လုံးကို စက်နှိုးဖို့ ဗို့အား အနည်းဆုံး ဘယ်လောက်ရှိရမလဲ?",
    correctKeywords: ["3.6"]
  },
  {
    id: 3,
    text: "Network ပိုင်းမှာ နှစ်မျိုးရှိတယ် အဲ့တာဘာတေလဲ့ ?",
    correctKeywords: ["sim လိုတဲ့ network", "sim မလိုတဲ့ network"]
  },
  {
    id: 4,
    text: "Coil ရဲ့ စာသင်ကေတတေ ဖြေဆိုပါ English!",
    correctKeywords: ["l", "lb", "pl", "fb", "b"]
  },
  {
    id: 5,
    text: "Computer ပိုင်းမှာ ဘာတေရှိလဲ့ Englishလိုဖြေ?",
    correctKeywords: ["cpu", "emmc"]
  },
  {
    id: 6,
    text: "Phone တစ်လုံးမှာ Battery ငုတ် ဘယ်နှစ်ငုတ်ပါလဲ့?",
    correctKeywords: ["4", "5"]
  },
  {
    id: 7,
    text: "ဖုန်းservice လုပ်တော့မယ်ဆို အကြမ်းဖျင်း heatgun အပူ ဘယ်လောက်လဲ့? လေကရော ဘယ်လောက်လဲ့?",
    correctKeywords: ["365", "55"]
  },
  {
    id: 8,
    text: "Crystal ရဲ့ စာသင်ကေတက ဘာလဲ့?",
    correctKeywords: ["x", "y"]
  },
  {
    id: 9,
    text: "Phone တစ်လုံးမှာ Batteryပင် 5ပင် ပါတယ်ဆိုရင် 2ပင်က +- 2ပင်က detat(ဒီတက်😁)ဆိုရင် ကျန်တဲ့ 1ပင်က ဘာပင်ဖြစ်မလဲ့?",
    correctKeywords: ["nc"]
  }
];

const POINTS_PER_QUESTION = 5;

let currentQIndex = 0;
let randomizedOrder = [];
let score = 0;

const introEl = document.getElementById('intro');
const totalPointsEl = document.getElementById('totalPoints');
const quizArea = document.getElementById('quizArea');
const questionBox = document.getElementById('questionBox');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const messageEl = document.getElementById('message');
const thankYouEl = document.getElementById('thankYou');
const finalScoreEl = document.getElementById('finalScore');
const restartIcon = document.getElementById('restartIcon');

const bgMusic = document.getElementById('bgMusic');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

// Play bgMusic safely when user clicks anything
function playMusicOnce() {
  if (bgMusic.paused) {
    bgMusic.play().catch(e => console.log('bgMusic play error:', e));
  }
}

setTimeout(() => {
  introEl.classList.add('hidden');
  totalPointsEl.textContent = `ဖြေဆိုရမည့် အမှတ်စုစုပေါင်း: ${questions.length * POINTS_PER_QUESTION}`;
  totalPointsEl.style.animation = 'glowText 3s ease forwards';
  startQuiz();
}, 3500);

function shuffleArray(array) {
  let arr = array.slice();
  for(let i = arr.length -1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAnswerCorrect(userInput, keywords) {
  const normalizedInput = normalizeText(userInput);
  return keywords.some(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    return normalizedInput.includes(normalizedKeyword);
  });
}

function startQuiz() {
  score = 0;
  currentQIndex = 0;
  randomizedOrder = shuffleArray(questions.map((_, i) => i));
  introEl.classList.add('hidden');
  thankYouEl.classList.add('hidden');
  quizArea.classList.remove('hidden');
  restartIcon.classList.remove('show');
  restartIcon.style.display = 'none';
  messageEl.textContent = "";
  answerInput.value = "";
  showQuestion();
  answerInput.focus();
}

function showQuestion() {
  const q = questions[randomizedOrder[currentQIndex]];
  questionBox.style.animation = 'none';
  void questionBox.offsetWidth;
  questionBox.style.animation = null;
  questionBox.textContent = `မေးခွန်း နံပါတ် ${q.id} - ${q.text}`;
  messageEl.textContent = "";
  answerInput.value = "";
  answerInput.focus();
}

function checkAnswer() {
  playMusicOnce(); // Play music when answering

  const q = questions[randomizedOrder[currentQIndex]];
  const userAnswer = answerInput.value;
  const matched = isAnswerCorrect(userAnswer, q.correctKeywords);

  // correct answer text
  const correctText = `✔ Correct answer: ${q.correctKeywords.join(", ")}`;

  if (matched) {
    score += POINTS_PER_QUESTION;
    messageEl.innerHTML = `Congratulations 👏🎉<br><span class="correct-ans">${correctText}</span>`;
    messageEl.className = "message congrats";

    correctSound.currentTime = 0;
    correctSound.play();

    animateCorrectAnswer();

    setTimeout(() => {
      nextStep();
    }, 4000);

  } else {
    messageEl.innerHTML = `စာမေးပွဲကျပီသာမှတ်!<br><span class="correct-ans">${correctText}</span>`;
    messageEl.className = "message fail";

    wrongSound.currentTime = 0;
    wrongSound.play();

    animateCorrectAnswer();

    setTimeout(() => {
      nextStep();
    }, 4000);
  }
}

// animation for correct answer
function animateCorrectAnswer() {
  const correctAnsEl = document.querySelector('.correct-ans');
  if (correctAnsEl) {
    correctAnsEl.style.display = 'inline-block';
    correctAnsEl.style.opacity = '0';
    correctAnsEl.style.transform = 'scale(0.8)';
    correctAnsEl.style.transition = 'all 0.6s ease';

    setTimeout(() => {
      correctAnsEl.style.opacity = '1';
      correctAnsEl.style.transform = 'scale(1)';
      correctAnsEl.style.color = '#00ffcc';
      correctAnsEl.style.fontWeight = 'bold';
      correctAnsEl.style.textShadow = '0 0 10px #00ffcc, 0 0 20px #00ffcc';
    }, 50);
  }
}

function nextStep() {
  currentQIndex++;
  if(currentQIndex >= questions.length) {
    quizArea.classList.add('hidden');
    thankYouEl.classList.remove('hidden');
    finalScoreEl.textContent = `ရော့ကွာ မင်းရတဲ့ အမှတ်🫴: ${score}`;
    restartIcon.style.display = 'flex';
    restartIcon.classList.add('show');
    bgMusic.pause();
  } else {
    showQuestion();
    messageEl.className = "message";
  }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keyup', e => {
  if(e.key === 'Enter') checkAnswer();
});

restartIcon.addEventListener('click', () => {
  startQuiz();
  bgMusic.currentTime = 0;
  playMusicOnce();
});
