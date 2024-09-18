let isTextAreaVisible = false;

// Function to create falling characters
function createMatrix() {
  const matrix = document.getElementById("matrix");
  const chars =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  const numCols = Math.floor(window.innerWidth / 20);
  const numRows = Math.floor(window.innerHeight / 20);

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      const span = document.createElement("span");
      span.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
      span.style.left = `${i * 20}px`;
      span.style.top = `${j * 20}px`;
      matrix.appendChild(span);

      const speed = Math.random() * 5 + 1;
      const animate = () => {
        let top = parseFloat(span.style.top);
        if (top > window.innerHeight) {
          top = -20;
        }
        span.style.top = `${top + speed}px`;
        requestAnimationFrame(animate);
      };
      animate();
    }
  }
}

let words = JSON.parse(localStorage.getItem("words") || []).map((item) => ({
    label: item.label,
    translation: item.translation,
  }));

let wordIndex = 0;

let word = nextWord();
let currentInput = "";

document.getElementById("label").textContent = word ? word.label : "";

// createMatrix();

// Handle input change
function handleChange() {
  const input = document.getElementById("matrixInput");
  currentInput = input.value;
  if (word && word.translation === currentInput) {
    fadeOutText();
    setTimeout(() => {
      word = nextWord();
      document.getElementById("label").textContent = word.label;
    }, 3000);
  } else if (word && word.translation.startsWith(currentInput)) {
    input.style.color = "#0a0";
  } else {
    input.style.color = "#a00";
  }
}

function nextWord() {
  setTimeout(() => {
    document.getElementById("matrixInput").value = "";
  }, 3000); // Czas trwania animacji (w ms)

  return words[wordIndex++ % words.length];
}

function fadeOutText() {
  const input = document.getElementById("matrixInput");
  const label = document.getElementById("label");

  const elements = [input, label];

  elements.forEach((el) => el.classList.add("fade-out-text"));

  setTimeout(() => {
    input.value = ""; // Czyści pole tekstowe, ale pole zostaje
    elements.forEach((el) => el.classList.remove("fade-out-text"));
  }, 3000); // Dopasuj czas do długości animacji
}

// Handle Enter key press
function handleKeyDown(event) {
  if (event.key === "Enter") {
    acceptAnswer();
  }

  if (event.key === "Escape") {
    turnOnTextAreaVisibility();
  }
}

function acceptAnswer() {
  if (word.translation !== currentInput) {
    shake();
    return;
  }

  nextWord();
  word = words[wordIndex++ % words.length];
}

function shake() {
  // Dodaj klasę shake
  let element = document.getElementById("matrixInput");
  element.classList.add("shake");

  // Usuń klasę shake po zakończeniu animacji
  setTimeout(() => {
    element.classList.remove("shake");
  }, 500); // Czas trwania animacji (w ms)
}

function turnOnTextAreaVisibility() {
  console.log("dsf");
  if (isTextAreaVisible) {
    const value = document.getElementById("wordsInput").value;
    console.log("value", value);
    const x = JSON.parse(value);
    console.log("x", x);
    words = x.map((item) => ({
      label: item.label,
      translation: item.translation,
    }));
    localStorage["words"] = JSON.stringify(words);
    document.body.removeChild(document.getElementById("words"));
    isTextAreaVisible = false;
    return;
  }
  isTextAreaVisible = true;
  const div = document.createElement("div");
  div.id = "words";

  const textarea = document.createElement("textarea");
  textarea.type = "text";
  textarea.id = "wordsInput";
  textarea.onkeydown = (event) => {
    if (event.key === "Escape") {
      const value = document.getElementById("wordsInput").value;
      console.log("value", value);
      const x = JSON.parse(value);
      console.log("x", x);
      words = x.map((item) => ({
        label: item.label,
        translation: item.translation,
      }));
      localStorage['words'] = JSON.stringify(words);
      document.body.removeChild(div);
      isTextAreaVisible = false;
    }
  };
  textarea.value = JSON.stringify(words, null, 4);

  div.appendChild(textarea);

  document.body.appendChild(div);
}

function toggleVisibility() {
  const input = document.getElementById("wordsInput");
  if (input) {
    document.removeChild(input);
  } else {
  }

  body.appendChild(wordsInput);

  const element = document.getElementById("wordsInput");
  if (element.style.display === "none") {
    element.style.display = "block"; // Show the element
    element.style.zIndex = 10;
  } else {
    element.style.display = "none"; // Hide the element
    element.style.zIndex = -1;
  }
}
