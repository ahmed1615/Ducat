const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const RepayPage = require("../pages/repayPage");
const { handlePageTransition } = require("../pages/utils/pageUtils.js");

let repayPage;
let initialBalance;

Given("user is on the vault page for repay", async function () {
  repayPage = new RepayPage(this.page);
  initialBalance = await repayPage.getCurrentBalance();
  console.log(`Initial balance captured before repay: ${initialBalance}`);
});

When("user initiates a repay", function () {
  repayPage = new RepayPage(this.page);
  repayPage.performRepay();
});

When("user confirms repay", async function () {
  await repayPage.handleConfirmationOfRepay(this.context, handlePageTransition);
});

Then("the repay should be completed", async function () {
  await repayPage.verifyRepayStatus();
});

Then("the balance should be decreased after repay", async function () {
  const balanceDecreased =
    await repayPage.verifyBalanceDecreased(initialBalance);
  expect(balanceDecreased).toBeTruthy();
});
