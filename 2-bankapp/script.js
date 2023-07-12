"use strict";

// BANKIST APP

// Data
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
    "2023-06-10T14:11:59.604Z",
    "2023-06-05T07:42:02.383Z",
    "2023-06-06T10:51:36.790Z",
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

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];

const movements = [200, 120, -400, -300, 110, 431, -779];

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

//lets start to build our Game..
//displaying Username
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //add username to accounts
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    // return userName;
  });
};
createUsername(accounts);

/*********************************************************** */
//calculate dates....
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
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
//currency
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
//1. To display Movements on html
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    //change movements to movs bcoz now movements are stored in movs
    //mov for checking array indexes one by one..
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    //format currency..
    const formatMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatMov}</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// for reference
// displayMovements(account1.movements);

//updates UI
const updateUI = function (acc) {
  displayMovements(acc);

  //displayBalance
  displayBalance(acc);

  //displaySummary
  displaySummary(acc);
};

/*************************************************************/
//Display Balance
// const displayBalance = function (movements) {
const displayBalance = function (acc) {
  // old way 👇
  //   const balance = movements.reduce((acc, mov) => acc + mov, 0);
  //   labelBalance.textContent = ` ${balance} €`;

  //  new way👇
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
 
  // const formatMov = 
  labelBalance.textContent = formatCurr(acc.balance,acc.locale,acc.currency)
};

// for reference
// displayBalance(account1.movements);

/*********************************************************** */

//Display Summary
//to change interestrate so we call acc instead of movements
const displaySummary = function (acc) {
  //incomes
  const incomes = acc.movements //here acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = ` ${incomes} €`;

  //outcomes
  const outcome = acc.movements //here acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = ` ${Math.abs(outcome)} €`;

  //interest --> apidina positive eduthu 1.2/100interest la multiply pandrathu

  //map used for new array
  const interest = acc.movements //here acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100) // map is for create new array //acc.interestRate

    //interest calc only the euro >=1 so👇
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest} €`;
};
// for reference
// displaySummary(account1.movements);

/******************************************************** */

//Challenge array bankist problem
// const checkDogs = function (dogsJulie, dogsKate) {
//   const dogsJulieCorrected = dogsJulie.slice(1).slice(0, -2);

//   console.log(dogsJulieCorrected);
//   const dogs = dogsJulieCorrected.concat(dogsKate);
//   console.log(dogs);

//   dogs.forEach(function (dog, i) {
//     dog >= 3
//      ? console.log( `Dog number ${i + 1} is an adult, and is ${dog} years old`)
//       : console.log(`Dog number ${i + 1} is still puppy, and is ${dog} years old`)
//   });
// };
// checkDogs([3, 5, 2, 12, 27], [4, 1, 15, 8, 3]);

// const dogs = function()
//implementing Login
let currentAccount;

//FAKE Login....
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// //old date format ways👇
// console.log(now);
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);
// abelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

//Login...
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  //find account.....
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value //use value
  );
  console.log(currentAccount);

  //pin check
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //ues value
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(" ")[0]
    } 🥳`;
    containerApp.style.opacity = 100;

    //EXPERIMENT INTERNALZATION API
    const now = new Date();
    //options
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      // weekday: "long",
    };

    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // console.log(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    //displayMovements
    updateUI(currentAccount);
  }
  //  clear input fields
  inputLoginUsername.value = inputLoginPin.value = "";
  //to clear cursor...
  inputLoginPin.blur();
});

/*************************************************************/
//Transfer Amount...
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // conditions to transfer amounts
  //1. amount > 0
  // 2. current account balance >= amount
  // 3. anupa pora account uername and current account username uhm differ ah irukanum
  //4.receiverAcc iruka illa loosu thanama ethachu username type pandromanu check panannum

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    //Doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }

  //   console.log(amount, receiverAcc);
});

//button close
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    // receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
});

//sorted
let sorted = false; //for initial conditions ku
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted); //!sorted na true nu artham
  sorted = !sorted; //again store sorted = false.
});
/*************************************************************/
// createUsername(accounts);
// console.log(accounts);
// // creatUsernames(account1.owner)
// console.log(creatUsernames(account1.owner));
// console.log(account4)

// //challenge #2
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map((age) => (age > 2 ? 2 * age : 16 + age * 4));
// };
// const euroToUsd = 1.1;
// const movementsUsd = movements.map((mov) => mov * euroToUsd);
// // movementsUsd(movements)
// console.log(movementsUsd);

//challenge--4
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
  { weight: 30, curFood: 360, owners: ["Ulysses"] },
];

dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
console.log(dogSarah);

const allDogs = dogs.flatMap((dog) => dog.owners);
console.log(allDogs);


//clock
// setInterval(() => {
//   const now = new Date();
//   const day = now.getDay();
//   const hour= `${now.getHours()}`.padStart(2,0);
//   const min = `${now.getMinutes()}`.padStart(2,0);
//   const month = now.getMonth()+1 //add +1 at end, bcoz its zero base
//   const year = now.getFullYear();
//   const wholeFormat = `${day}, ${hour}:${min}`
//   wholeFormat--;

//   console.log(wholeFormat);
// }, 300);
