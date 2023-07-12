"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-01-28T09:15:04.904Z",
    "2019-04-01T10:17:24.185Z",
    "2019-05-27T17:01:17.194Z",
    "2019-07-11T23:36:17.929Z",
    "2023-03-13T21:31:17.178Z",
    "2023-03-15T07:42:02.383Z",
    "2023-03-18T14:11:59.604Z",
    "2023-03-19T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-01-25T14:18:46.235Z",
    "2019-02-05T16:33:06.386Z",
    "2019-03-10T14:43:26.374Z",
    "2019-04-25T18:49:59.371Z",
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-02-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
/////////////////////////////////////////////////

//Dates function
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//currency changer based on country
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//timer

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 10;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
/////////////////////////////////////////////////
// 1. Display Movements....
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // console.log(movs);
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const date = new Date(acc.movementsDates[i]); //for
    const displayDate = formatMovementDate(date, acc.locale);

    //for currency
    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`; //for adding decimal part at mov;
    //calling insertAdjacent
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

/*****************************************/
//.................for need of each account displays and balance, use acc as parameter.................
//Displaying Balance
const calcDisplayBalance = function (acc) {
  //acc - accumulator
  // const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  /////////////////////// OR ///////////////////////
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // labelBalance.textContent = `${acc.balance.toFixed(2)}€`; ----- old way
  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};
// calcDisplayBalance(account1.movements);

/*****************************************/
//.................for need of each account displays and interest, use acc as parameter.................
const calcDisplaySummary = function (acc) {
  // 1.income(IN)
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  // 2.Outcome(OUT)
  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  // labelSumOut.textContent = `${Math.abs(outcome.toFixed(2))}€`;
  labelSumOut.textContent = formatCurr(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  );
  // 3.Intrest(INTEREST)-using map for intesert,   intrest bank provide if holder has 1€
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .filter((int, arr) => {
      return int >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};
// calcDisplaySummary(account1.movements);
/*****************************************/

//Update UI
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};
//displaying Username
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    // return userName;
  });
};
createUsername(accounts);

// console.log(accounts)
/*****************************************/
let currentAccount,timer;

//Faked Logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
//experimenting Locale

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("Login")
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  ); //for checkinf purpose..
  // console.log(currentAccount)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    // Display UI
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }; //adding locale

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur(); // for removing highlighter
    //updateUI
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
  //clear inputField
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  // inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log("transferting");
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //UpateUI

    //add transfer to dates....
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //UpateUI
    // updateUI
    updateUI(currentAccount);

     // Reset timer
     clearInterval(timer);
     timer = startLogOutTimer();
  }
});

//Request Loan---
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //round value use **** floor ****;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    //setTimeout();
    setTimeout(function () {
      currentAccount.movements.push(amount);

      //dates adding loan
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
     // Reset timer
     clearInterval(timer);
     timer = startLogOutTimer();
  }
  inputLoanAmount.value = "";
});

//closing Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    //Deleting account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//Sort
// for implementing movements original order we use sorted = false;
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/*****************************************/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
//   ]);
//   console.log(currencies)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //using Map()
// const eurToUsd = 1.1;
// //used normalm function
// // const movementsUsd = movements.map(function(mov){
// //   return mov * eurToUsd;
// //************************************** */
// //using arrow function
// const movementsUsd1 = movements.map((mov) => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsd1);

//   movements.forEach(function(mov){
//     mov > 0 ? console.log(`you deposited ${mov}`):console.log(`you withdrew ${Math.abs(mov)}`);
//   });

// const checkDogs = function(dogsJulia, dogsKate){
//       const dogsJuliaCorrected = dogsJulia.slice();

//       dogsJuliaCorrected.splice(0,1);
//       dogsJuliaCorrected.splice(-2);
//       console.log(dogsJuliaCorrected)
//       const dogs = [...dogsJuliaCorrected,...dogsKate]
//       console.log(dogs)

//       dogs.forEach(function(dog,i){
//         dog >= 3 ? console.log(`The Dog number ${i+1} is an adult, and is ${dog} years old`) : console.log(`The Dog number ${i+1} is an puppy, and is ${dog} years old`)
//       })
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// filter() Method !important
// const deposites = movements.filter(mov => mov > 0);
// console.log(deposites);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals)

// const balance = movements.reduce((acc, curr, i, arr) => acc + curr);

// console.log(balance);

// const calcHumanAge = function (ages) {
//   const humanAge = ages.map((age) => (age <= 2 ? age * 2 : 16 + age * 4));
//   const adult = humanAge.filter(age => age>=18)
//   console.log(adult)
//   console.log(humanAge)

//   const average = adult.reduce((acc,curr)=>acc+curr,0)/adult.length;
//   // console.log(average)
//   return average;
// };
// // const humanAge = []
// const avg1 = calcHumanAge([5,2,4,1,15,8,3]);
// console.log(avg1)

const calcAverageHumanAge = (ages) =>
  ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
// console.log(humanAge)
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);

// const newUserName = function (accs) {
//   accs.forEach(function (acc) {
//     acc.userName = acc.owner.toLowerCase().split(" ").map(name=>name[0]).join("");
//    console.log(accs)
//   });
// };
// newUserName(accounts);
const titleCase = function (title) {
  const exceptions = ["a", "is", "an", "but", "the", "or", "on", "in", "with"];
  const crctness = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  console.log(crctness);
  return title;
};
console.log(titleCase("This is a nice Title"));

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
console.log(dogSarah);
console.log(
  `Sarah dog is eat too ${
    dogSarah.curFood > dogSarah.recFood ? "much" : "little"
  } `
);

const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recFood)
  .flatMap((dog) => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recFood)
  .flatMap((dog) => dog.owners);
console.log(ownersEatTooLittle);

console.log(`${ownersEatTooMuch.join(" and ")}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(" and ")}'s dogs eat too little!`);
// 5.
console.log(dogs.some((dog) => dog.curFood === dog.recFood));

//SetInterval();
// setInterval(function(){
//   const now = new Date();
//   const day = now.getDay();
//   const minutes = now.getMinutes();
//   console.log(now)
//   // console.log(now)
// },1000)
