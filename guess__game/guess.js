"use strict";

//secretnumber
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  //no number
  if (!guess) {
    document.querySelector(".message").textContent = "😵‍💫 No number";
  }

  //the number is equal
  else if (guess === secretNumber) {
    document.querySelector(".message").textContent = "🎉 correct number";
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".guess").style.width = "30rem";
    document.querySelector(".number").textContent = secretNumber;

    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }
  }
  /////////////////////////////////////////////////////////////
  //refactor Too low and Too high
  else if (guess !== secretNumber) {
    if (score > 1) {
      document.querySelector(".message").textContent =
        guess > secretNumber ? "Too High 🥵" : "Too low 🫠";
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      document.querySelector(".score").textContent = 0;
      document.querySelector(".message").textContent = "😭 You lost the game";
    }
  }

  /////////////////////////////////////////////////////////////

  //the number is Too High
  //   else if (guess > secretNumber) {
  //     if (score > 1) {
  //       document.querySelector(".message").textContent = "Too High 🥵";
  //       score--;
  //       document.querySelector(".score").textContent = score;
  //     } else {
  //       document.querySelector(".score").textContent = 0;
  //       document.querySelector(".message").textContent = "😭 You lost the game";
  //     }
  //   }

  //the number is Too Low
  //   else if (guess < secretNumber) {
  //     if (score > 1) {
  //         document.querySelector(".message").textContent = "Too low 🫠";
  //         score--;
  //         document.querySelector(".score").textContent = score;
  //       } else {
  //         document.querySelector(".score").textContent = 0;
  //         document.querySelector(".message").textContent = "😭 You lost the game";
  //       }
  //   }
});

//restart the game --> Again
document.querySelector(".again").addEventListener("click", function () {
  score = 20;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".message").textContent = "Start guessing...";
  document.querySelector(".score").textContent = score;
  document.querySelector(".highscore").textContent = highscore;
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".guess").style.width = "15rem";
  document.querySelector(".number").textContent = secretNumber;
  document.querySelector(".guess").value = "";
});
