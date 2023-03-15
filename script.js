"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Ramesh Kumar Sinha",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 8.7, // %
  pin: 1010,
};

const account2 = {
  owner: "Madhuri Sinha",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 9.0,
  pin: 2020,
};

const account3 = {
  owner: "Anshu Sinha",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 8.2,
  pin: 3030,
};

const account4 = {
  owner: "Sahil Kumar Sinha",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 8.5,
  pin: 4040,
};

const accounts = [account1, account2, account3, account4];

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

////////// displays the movements of amounts //////////

// this function takes the movements array
const displayMovements = function (account, sorted) {
  // dom manipulation where initially the html is set to empty
  containerMovements.innerHTML = "";

  // replicated movements array to preserve the original array after sort
  const movs = sorted
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  // this forEach function loops through the movs array
  movs.forEach(function (mov, i) {
    // stores the type of the amount
    const type = mov > 0 ? "deposit" : "withdrawal";
    // stores the updated html
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">₹ ${mov}</div>
      </div>
    `;
    // dom manipulation to update the inner html
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

////////// ---------- //////////

////////// sets the username for different account owners //////////

const userNames = accounts.map((account) => {
  // splits the name of the owner separated by spaces
  let fullNameArr = account.owner.split(" ");
  // username is initially set to empty
  let userName = "";
  // first letter of the full names are chosen and converted to lowercase
  // and then the initials are appended to form a username
  fullNameArr.forEach(function (name) {
    userName += name[0].toLowerCase();
  });
  // account object hold the new property called userName
  account.userName = userName;
});

////////// ---------- //////////

////////// calculates and displays the current balance //////////

const displayCurrentBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `₹ ${account.balance}`;
};

////////// ---------- //////////

////////// calculates and displays the summary of deposits, withdrawals and interest amount //////////

// calculates the total deposits
const displaySummary = function (account) {
  const totalDeposits = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `₹ ${totalDeposits}`;
  // calculates the total withdrawals
  const totalWithdrawals = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `₹ ${Math.abs(totalWithdrawals)}`;
  // calculates the total interest amount
  const totalInterests = account.movements
    .filter((deposit) => deposit > 0)
    .map((deposit) => deposit * (account.interestRate / 100))
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumInterest.textContent = `₹ ${Math.trunc(totalInterests)}`;
};

////////// ---------- //////////

////////// function to update the UI //////////

const updateUi = function (account) {
  // displayMovements function is called
  displayMovements(account);
  // displayCurrentBalance function is called
  displayCurrentBalance(account);
  // displaySummary function is called
  displaySummary(account);
  // clears the input fields
  inputLoginUsername.value =
    inputLoginPin.value =
    inputTransferTo.value =
    inputTransferAmount.value =
    inputLoanAmount.value =
    inputCloseUsername.value =
    inputClosePin.value =
      "";
};

////////// ---------- //////////

////////// implements login //////////

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // prevents the page from reloading
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // opacity is set to 1
    containerApp.style.opacity = 1;
    // welcome text is changed
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    // blurrs the input fields
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // updates the UI
    updateUi(currentAccount);
  }
});

////////// ---------- //////////

////////// implements transfers //////////

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  // transfer amount
  const transferAmount = Number(inputTransferAmount.value);
  // receiver account details
  const receiverAccount = accounts.find(
    (account) => account.userName === inputTransferTo.value
  );

  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    // deducts transfer amount from the current account
    currentAccount.movements.push(-transferAmount);
    // adds transfer amount to the receiver account
    receiverAccount.movements.push(transferAmount);
    // updates the UI
    updateUi(currentAccount);
  }
});

////////// ---------- //////////

////////// implements loan request //////////

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // loan amount
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov > loanAmount * 0.1)
  ) {
    // adds the loan amount to the current account
    currentAccount.movements.push(loanAmount);
    // updates the UI
    updateUi(currentAccount);
  }
});

////////// ---------- //////////

////////// implements account close //////////

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // finds the index of the account to be closed
    const index = accounts.findIndex(
      (account) => account.userName === currentAccount.userName
    );
    // deletes the account
    accounts.splice(index, 1);

    // hides the UI
    containerApp.style.opacity = 0;

    // welcome text is changed
    labelWelcome.textContent = "Log in to get started";
  }
});

////////// ---------- //////////

////////// implements sorting of account movements //////////

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

////////// ---------- //////////

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

// 170. converting and checking numbers
// console.log(23 === 23.0);
// console.log(0.1 + 0.2 === 0.3);
// console.log(0.1 + 0.2); // 0.30000000000000004 !== 0.3

// // conversion
// console.log(typeof 23);
// console.log(typeof "23");
// console.log(typeof +"23");

// // parsing
// console.log(Number.parseInt("30px"));
// console.log(Number.parseFloat("2.5rem"));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN("20"));

// // check if value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite("20"));

/////

// 171. math and rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.max(1, 2, 3, 4, 5));
// console.log(Math.min(1, 2, 3, 4, 5));

// // finding area of a circle
// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// // random number between 1 and 6 inclusive
// console.log(Math.trunc(Math.random() * 6) + 1);

// // random number between two numbers
// const randomInt = (min, max) => {
//   return Math.trunc(Math.random() * min) + 1 + (max - min);
// };

// console.log(randomInt(5, 10));

// // rounding
// console.log(Math.trunc(23.9));

// console.log(Math.round(24.5));

// console.log(Math.ceil(23.1));

// console.log(Math.floor(23.9));

// // rounding decimals
// console.log(Number((23.454).toFixed(2)));

/////

// 173. numeric separators
// const population = 45_000;
// console.log(population);
