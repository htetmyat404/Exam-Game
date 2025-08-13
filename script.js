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

setTimeout(() => {
  introEl.classList.add('hidden');
  totalPointsEl.textContent = `ဖြေဆိုရမည့် အမှတ်စုစုပေါင်း: ${questions.length * POINTS_PER_QUESTION}`;
  totalPointsEl.style.animation = 'glowText 3s ease forwards';

  bgMusic.play().catch(e => console.log('bgMusic play error:', e));

  startQuiz();
}startQuiz
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

// user input တစ်ခုထဲမှာ keywords အနည်းဆုံး တစ်ခု ပါရင်မှ correct ဆိုမယ်
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
  showQuestion();
  messageEl.textContent = "";
  answerInput.value = "";
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
  const q = questions[randomizedOrder[currentQIndex]];
  const userAnswer = answerInput.value;

  const matched = isAnswerCorrect(userAnswer, q.correctKeywords);

  if(matched) {
    score += POINTS_PER_QUESTION;
    messageEl.textContent = `Congratulations 👏🎉`;
    messageEl.className = "message congrats";

    correctSound.currentTime = 0;
    correctSound.play();

    setTimeout(() => {
      nextStep();
    }, 1000);

  } else {
    messageEl.textContent = "စာမေးပွဲကျပီသာမှတ်!";
    messageEl.className = "message fail";

    wrongSound.currentTime = 0;
    wrongSound.play();

    setTimeout(() => {
      nextStep();
    }, 1000);
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
  bgMusic.play().catch(e => console.log('bgMusic play error:', e));
});
