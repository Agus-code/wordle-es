const $grid = document.getElementById("grid");
const $messagge = document.getElementById("messagge");

const GAME_WORD = words[Math.floor(Math.random() * words.length)];

let html_grid = "";
let actual_row = 1;
let finished = false;

for (let i = 0; i < 6; i++) {
  for (let k = 0; k < 5; k++) {
    let box = `
    <div class="letter_box" id="r-${i + 1}_c-${k + 1}">
    </div>
  `;
    html_grid += box;
  }
}

$grid.innerHTML = html_grid;

let games = [];

const checkWord = (txt) => {
  if (!txt) return { err: "Ingrese las letras necesarias" };
  if (!/^[a-zA-ZÑñ]+$/.test(txt)) return { err: "Solo letras" };
  if (txt.length !== 5) return { err: "No hay suficientes letras" };
  if (!words.includes(txt.toLowerCase()))
    return { err: "La palabra no esta en la lista" };
  if (games.includes(txt)) return { err: "Palabra ya utilizada" };
  return { success: "Yes" };
};

const paintKeyword = (letter, color) => {
  const keyword = document.querySelector(
    `[aria-label="${letter.toUpperCase()}"]`
  );

  const classes = keyword.classList;

  if (classes.contains("yellow") && color == "green")
    classes.replace("yellow", "green");
  if (classes.contains("green") || classes.contains("darkGray")) return;

  keyword.classList.add(color);
};

const checkWin = (txt) => {
  const GAME_WORD_SPLIT = GAME_WORD.split("");
  const GUESSED_WORD_SPLIT = txt.toLowerCase().split("");

  let data = {};

  let letters_word = GAME_WORD_SPLIT;

  //validate green
  GAME_WORD_SPLIT.forEach((letter, i) => {
    data[i] = letter === GUESSED_WORD_SPLIT[i] ? "green" : null;
    if (letter === GUESSED_WORD_SPLIT[i]) {
      letters_word[i] = " ";
      paintKeyword(GUESSED_WORD_SPLIT[i], "green");
    }
  });

  if (GAME_WORD === txt.toLowerCase()) finished = true;

  //validate yellow
  let values = Object.values(data);
  values.forEach((value, i) => {
    if (!value) {
      if (letters_word.includes(GUESSED_WORD_SPLIT[i])) {
        data[i] = "yellow";
        const indexLetter = letters_word.indexOf(GUESSED_WORD_SPLIT[i]);
        letters_word[indexLetter] = " ";
        paintKeyword(GUESSED_WORD_SPLIT[i], "yellow");
      } else {
        paintKeyword(GUESSED_WORD_SPLIT[i], "darkGray");
      }
    }
  });

  return data;
};

const addColors = (data) => {
  const colors = Object.values(data);
  colors.forEach((color, i) => {
    const letter_box = document.getElementById(`r-${actual_row}_c-${i + 1}`);
    letter_box.classList.add(color);
  });
};

let TEXT_USER = "";

document.getElementById("keyboard").addEventListener("click", (e) => {
  if (finished) return;
  const value = e.target.ariaLabel;
  if (!value) return;
  if (value === "delete") TEXT_USER = TEXT_USER.slice(0, -1);

  if (TEXT_USER.length === GAME_WORD.length) return;
  if (value !== "enter" && value !== "delete") TEXT_USER += value;

  let letters = TEXT_USER.split("");
  while (letters.length !== 5) {
    letters.push(" ");
  }

  letters.forEach((letter, i) => {
    const box_letter = document.getElementById(`r-${actual_row}_c-${i + 1}`);
    box_letter.textContent = letter;
  });
});

const showMessagge = (txt, time) => {
  $messagge.innerText = txt;
  if (!time) return;
  setTimeout(() => {
    $messagge.innerText = "";
  }, time);
};

//send word
document.getElementById("enter").addEventListener("click", (e) => {
  if (finished) return;

  const { err, success } = checkWord(TEXT_USER);
  if (err) showMessagge(err, 1500);
  if (success) {
    const colors = checkWin(TEXT_USER);
    addColors(colors);
    actual_row++;
    TEXT_USER = "";
    if (finished) showMessagge(`Adivinaste`, null);
    return;
  }
  if (actual_row == 7) {
    finished = true;
    showMessagge(`La palabra era "${GAME_WORD}"`, null);
  }
});
