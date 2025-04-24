const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const VaultAfterCreation = require("../pages/valutAfterCreation");
const { handlePageTransition } = require("../pages/utils/pageUtils.js");

let vaultPage;
let initialBalance;

Given("user is on the vault page", async function () {
  vaultPage = new VaultAfterCreation(this.page);
  initialBalance = await vaultPage.getCurrentBalance();
  console.log(`Initial balance captured: $${initialBalance}`);
});
When("i need to deposit", function () {
  vaultPage = new VaultAfterCreation(this.page);
  vaultPage.performDeposit();
});

When("user confirms deposit", async function () {
  await vaultPage.handleConfirmation(this.context, handlePageTransition);
});

Then("the deposit should be completed", async function () {
  await vaultPage.verifyDepositStatus();
});

Then("the balance should be increased", async function () {
  const balanceIncreased =
    await vaultPage.verifyBalanceIncreased(initialBalance);
  expect(balanceIncreased).toBeTruthy();
});
