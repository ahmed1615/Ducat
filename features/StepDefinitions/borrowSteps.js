const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const BorrowPage = require("../pages/borrowPage");
const { handlePageTransition } = require("../pages/utils/pageUtils.js");

let borrowPage;
let initialBalance;

Given("user is on the vault page for borrow", async function () {
  borrowPage = new BorrowPage(this.page);
  initialBalance = await borrowPage.getCurrentBalance();
  console.log(`Initial balance captured before borrow: ${initialBalance}`);
});

When("user initiates a borrow {string}", async function (percentage) {
  borrowPage = new BorrowPage(this.page);
  await borrowPage.performBorrow(percentage);
});

When("user confirms borrow", async function () {
  await borrowPage.handleConfirmationOfBorrow(this.context, handlePageTransition);
});

Then("the borrow should be completed", async function () {
  await borrowPage.verifyBorrowStatus();
});

Then("the balance should be increased after borrow", async function () {
  const balanceIncreased = await borrowPage.verifyBalanceIncreased(initialBalance);
  expect(balanceIncreased).toBeTruthy();
});