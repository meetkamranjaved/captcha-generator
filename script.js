// DOM elements
const captchaTextBox = document.querySelector(".captch_box input");
const refreshButton = document.querySelector(".refresh_button");
const captchaInputBox = document.querySelector(".captch_input input");
const message = document.querySelector(".message");
const submitButton = document.querySelector(".button");
const strengthMeter = document.querySelector(".strength-meter");
const strengthMeterFill = document.querySelector(".strength-meter-fill");
const difficultyOptions = document.querySelectorAll(".difficulty-option");
const attemptsCounter = document.getElementById("attempts");

// Variables
let captchaText = null;
let difficulty = "normal";
let attempts = 3;

// Character sets for different difficulty levels
const charSets = {
  normal: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  hard: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
  extreme:
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// Generate random string based on difficulty
const generateRandomString = (length, charset) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

// Generate captcha based on difficulty
const generateCaptcha = () => {
  let length, charset;

  switch (difficulty) {
    case "hard":
      length = 8;
      charset = charSets.hard;
      break;
    case "extreme":
      length = 10;
      charset = charSets.extreme;
      break;
    default:
      length = 6;
      charset = charSets.normal;
  }

  const randomString = generateRandomString(length, charset);
  const randomStringArray = randomString.split("");

  // Randomly transform some characters
  const changeString = randomStringArray.map((char) =>
    Math.random() > 0.5
      ? Math.random() > 0.5
        ? char.toUpperCase()
        : char.toLowerCase()
      : char
  );

  // Add random spacing between characters
  captchaText = changeString.join(
    " ".repeat(Math.floor(Math.random() * 3) + 1)
  );
  captchaTextBox.value = captchaText;

  // Update strength meter
  updateStrengthMeter();
};

// Update strength meter based on difficulty
const updateStrengthMeter = () => {
  let width, color;

  switch (difficulty) {
    case "hard":
      width = "66%";
      color = "#f39c12";
      break;
    case "extreme":
      width = "100%";
      color = "#e74c3c";
      break;
    default:
      width = "33%";
      color = "#2ecc71";
  }

  strengthMeterFill.style.width = width;
  strengthMeterFill.style.backgroundColor = color;
};

// Refresh button click handler
const refreshBtnClick = () => {
  generateCaptcha();
  captchaInputBox.value = "";
  captchaKeyUpValidate();
  captchaInputBox.focus();
};

// Validate captcha input
const captchaKeyUpValidate = () => {
  submitButton.classList.toggle("disabled", !captchaInputBox.value);

  if (!captchaInputBox.value) {
    message.classList.remove("active");
    strengthMeter.classList.remove("active");
  } else {
    strengthMeter.classList.add("active");
  }
};

// Submit button click handler
const submitBtnClick = () => {
  // Normalize the captcha text (remove spaces and make case insensitive if needed)
  const normalizedCaptcha = captchaText
    .split("")
    .filter((char) => char !== " ")
    .join("");

  const userInput = captchaInputBox.value;

  message.classList.add("active");

  // Check if the entered captcha text is correct
  if (userInput === normalizedCaptcha) {
    message.textContent = "Verification successful!";
    message.className = "message active success";
    submitButton.classList.add("disabled");
    captchaInputBox.disabled = true;
    refreshButton.disabled = true;
  } else {
    attempts--;
    attemptsCounter.textContent = attempts;

    if (attempts <= 0) {
      message.textContent =
        "No attempts remaining. Please refresh for a new CAPTCHA.";
      message.className = "message active error";
      submitButton.classList.add("disabled");
      captchaInputBox.disabled = true;
      setTimeout(refreshBtnClick, 2000);
    } else {
      message.textContent = `Incorrect! ${attempts} attempt(s) remaining.`;
      message.className = "message active error";
      captchaInputBox.value = "";
      captchaInputBox.focus();
      submitButton.classList.add("disabled");
    }
  }
};

// Set difficulty level
const setDifficulty = (level) => {
  difficulty = level;
  difficultyOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.difficulty === level);
  });
  generateCaptcha();
};

// Event listeners
refreshButton.addEventListener("click", refreshBtnClick);
captchaInputBox.addEventListener("keyup", captchaKeyUpValidate);
captchaInputBox.addEventListener("focus", () =>
  strengthMeter.classList.add("active")
);
captchaInputBox.addEventListener("blur", () => {
  if (!captchaInputBox.value) strengthMeter.classList.remove("active");
});

submitButton.addEventListener("click", submitBtnClick);

difficultyOptions.forEach((option) => {
  option.addEventListener("click", () =>
    setDifficulty(option.dataset.difficulty)
  );
});

// Initialize
generateCaptcha();
setDifficulty("normal");
