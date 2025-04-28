const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const WithdrawalPage = require("../pages/withdrawalPage");
const { handlePageTransition } = require("../pages/utils/pageUtils.js");

let withdrawalPage;
let initialBalance;

Given("user is on the vault page for withdrawal", async function () {
  withdrawalPage = new WithdrawalPage(this.page);
  initialBalance = await withdrawalPage.getCurrentBalance();
  console.log(`Initial balance captured before withdrawal: $${initialBalance}`);
});

When("user needs to create withdrawal {string}", function (percentage) {
  withdrawalPage = new WithdrawalPage(this.page);
  withdrawalPage.performWithdrawal(percentage);
});

When("user confirms withdrawal", async function () {
  await withdrawalPage.handleConfirmationOfWithdraw(
    this.context,
    handlePageTransition,
  );
});

Then("the withdrawal should be completed", async function () {
  await withdrawalPage.verifyWithdrawalStatus();
});

Then("the balance should be decreased", async function () {
  const balanceDecreased =
    await withdrawalPage.verifyBalanceDecreased(initialBalance);
  expect(balanceDecreased).toBeTruthy();
});
