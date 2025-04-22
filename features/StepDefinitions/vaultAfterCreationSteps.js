const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const VaultAfterCreation = require('../pages/valutAfterCreation');
const { handlePageTransition } = require('../pages/utils/pageUtils.js');

let vaultPage;



Given('user is on the vault page', async function() {
    vaultPage = new VaultAfterCreation(this.page);
  });
  When('i need to deposit', function () {
    vaultPage = new VaultAfterCreation(this.page);
    vaultPage.performDeposit();
  });

  When('user confirms deposit', async function() {
    await vaultPage.handleConfirmation(this.context, handlePageTransition);
});
Then('the deposit should be completed', async function() {
    await vaultPage.verifyDepositStatus();
});