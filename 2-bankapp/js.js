'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-02-13T17:01:17.194Z",
    "2023-02-10T23:36:17.929Z",
    "2023-02-15T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [2500, 400, -260, 830, -4210, 2200, 4600, -70],
  interestRate: 1.8,
  pin: 2222,

  movementsDates: [
    "2019-11-03T13:15:33.035Z",
    "2019-11-25T09:48:16.867Z",
    "2019-12-16T06:04:23.907Z",
    "2020-01-12T14:18:46.235Z",
    "2020-02-25T16:33:06.386Z",
    "2020-04-11T14:43:26.374Z",
    "2020-06-15T18:49:59.371Z",
    "2020-07-30T12:01:20.894Z",
  ],
  currency: "BDT",
  locale: "en-US",
};

const account3 = {
  owner: "Mano Alert",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//DATES FORMAt...
const formatMovementDate = function(date){
  const calcPassedDays = (date1, date2)=>Math.round(Math.abs((date2-date1)/(1000*60*60*24)));
  const daysPassed = calcPassedDays(new Date(),date);
  if(daysPassed===0) return'Today';
  if(daysPassed===1) return'Yesterday';
  if(daysPassed <= 7) return`${daysPassed} days ago`;

}
//////////////////////////
// Currency internationalization
const formatCur = function (value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// console.log(formatDates(new Date(), date))


const displayMovements = function(acc, sort=false){

    containerMovements.innerHTML=''
    const movs = sort ? acc.movements.slice().sort((a , b)=> a - b) : acc.movements

    //starting -->  movement.forEach(function(mov, i)){}
    movs.forEach(function(mov, i) {
      const type = mov > 0 ? 'deposit':'withdrawal';
      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date,acc.locale);
      const formatedMov = new Intl.NumberFormat(acc.locale,{
        style: 'currency',
        currency: acc.currency,
      }).format(mov)

      // const now = new Date()
      // const displayDate = formatMovementDate(date);
      // const day = `${date.getDate()}`.padStart(2, 0);
      // const month = `${date.getMonth()+1}`.padStart(2, 0)
      // const year = date.getFullYear();
      // const displayDate = `${day}/${month}/${year}`;

     

      const html =  `<div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatedMov}</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html)
    });
  }
    //currentDisplayBalance
    const currentDisplayBalance = function(acc){
      acc.balance = acc.movements.reduce((acc,mov)=>acc+mov,0)
      // labelBalance.textContent = `${acc.balance}€`
      labelBalance.textContent = formatCur(acc.balance, acc.local, acc.currency);
  }


  //currentDisplaySum
  const CurrentDisplayIn = function(acc){
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc,mov)=>acc+mov,0)
    labelSumIn.textContent = `${incomes}€`


// const CurrentDisplayOut = function(movements){
    const withdrawal = acc.movements.filter(mov => mov < 0).reduce((acc,mov)=>acc+mov,0)
    labelSumOut.textContent = `${Math.abs(withdrawal)}€`

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit*(acc.interestRate/100)).filter((int)=>{
        return int >= 1
    })
    .reduce((int,mov)=>int+mov,0);
    labelSumInterest.textContent = `${Math.round(Math.abs(interest))}€`
}

// displayMovements(account1.movements)
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


const updateUI = function(acc){
    //Display Movements;  
    displayMovements(acc)

    //Display Balance;
    currentDisplayBalance(acc);

    //Display summary;
    CurrentDisplayIn(acc);
}

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
      console.log(acc.username)
  });
};

createUsernames(accounts)

let currentAccount;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


const setTimer = function(){
  let time = 100;
  setInterval(() => {
    labelTimer.textContent = time;
      time--;
  }, 1000) clearInterval();
}

//Expermenting API:


btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  // console.log('LOGIN')
  currentAccount = accounts.find(acc=>acc.username === inputLoginUsername.value)
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('pin')
    labelWelcome.textContent = `welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //create dates
    const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekdays: 'long'

};

// const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);


    
    //Display Movements
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur();
    
    setTimer()
      // CurrentDisplayOut(currentAccount.movements)
     updateUI(currentAccount)
  }

});


btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(acc=> acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value='';

  if(amount > 0 && receiveAcc && currentAccount.balance >=amount&&receiveAcc?.username !== currentAccount.username){


    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount)

    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString())


    updateUI(currentAccount)
  }
});

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  // console.log('delete')
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    console.log(index);
    accounts.splice(index,1)

    //hide UI
    containerApp.style.opacity = 100;
  }

  inputCloseUsername.value = inputClosePin.value = '';
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const loanAmount = inputLoanAmount.value;
  
  if(loanAmount > 0 && currentAccount.movements.some(mov => mov>= loanAmount*0.1)){
    currentAccount.movements.push(loanAmount);

    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';
})


let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


//setIntervalTimer
// setInterval(() => {
//   const now  = new Date();
//   console.log(now)
// }, 1000);






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const allBalance = accounts.flatMap(acc=> acc.movements).reduce((arr,mov)=> arr+mov,0);
console.log(allBalance)

console.log(movements)
console.log(movements.slice());
// movements.sort((a,b)=>{
//    if(a > b) return 2
//    if(a < b) return -2
// })
// console.log(movements)

// movements.sort((a,b)=>a-b)
// console.log(movements)
// movements.sort((a,b)=>b-a)
// console.log(movements)

labelBalance.addEventListener('click',function(){
  const movementsUI = [...document.querySelectorAll('.movements__value')]
  console.log(movementsUI)
})
// console.log(movements.reverse())
// console.log(movements)

//value++ => value=value+1
// dums.deo = duns.deo+ cur

const sums = accounts.flatMap(acc => acc.movements).reduce((sums,cur)=>{
  // cur > 0 ? (sums.deposit += cur) : (sums.withdrawal +=cur);
 
  sums[cur > 0 ? 'deposit' : 'withdrawals']+=cur
  return sums;
},{deposit: 0,withdrawals: 0});


console.log(sums)



const dogs = [
  { weight: 22, 
    curFood: 250, 
    owners: ['Alice', 'Bob'] },

  { weight: 8,
    curFood: 200,
    owners: ['Matilda'] },

  { weight: 13, 
    curFood: 275, 
    owners: ['John', 'Sarah'] },

  { weight: 32, 
    curFood: 340, 
    owners: ['Michael'] },
];


// 1.

 dogs.forEach(dog => (dog.recFood = dog.weight ** 0.75 *28));
console.log(dogs);



// 2.
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog);
console.log(`sarah dog is eating ${sarahDog.curFood > sarahDog.recFood ? 'much' : 'little'}`)

const ownerEatTooMuch = dogs.filter(too=> too.curFood > too.recFood).map(dog => dog.owners).flat()
console.log(ownerEatTooMuch);

const ownerEatTooLittle = dogs.filter(too=> too.curFood < too.recFood).map(dog => dog.owners).flat()
console.log(ownerEatTooLittle)
// ownerEatTooLittle.push(dogLittledogs);
// console.log(ownerEatTooLittle);
console.log(`${ownerEatTooMuch.join(', ')} and eat too much`)
console.log(`${ownerEatTooLittle.join(', ')} and eat too little`)

//5.
console.log((dogs.some(dog => dog.curFood === dog.recFood)))

// console.log(EXACTLY)

const Dates = new Date(4,0,23,45,6,4)
console.log(Dates)