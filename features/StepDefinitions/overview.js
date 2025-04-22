const { Given, When, Then } = require('@cucumber/cucumber');
const OverViewPage = require('../pages/overView');

let overViewPage;

Given('user navigates to Ducat Protocol application', async function() {
  if (!this.browser) {
    throw new Error('Browser not initialized. Make sure the Before hook runs first.');
  }
  const context = this.browser.contexts()[0];
  this.context = context;
  this.page = await context.newPage();
  overViewPage = new OverViewPage(this.page);
  await overViewPage.goto();
});

When('user clicks on Overview tab', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.waitForOverviewToLoad();
});

Then ('total BTC Ducat Valuts is orange', async function() {
    overViewPage = new OverViewPage(this.page);
    await overViewPage.totalBTCIsOrange();
});
When('user clicks on totalUnit tab', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.clickOnTotalUnit();
});
Then ('total UNIT is orange', async function() {
  overViewPage = new OverViewPage(this.page);
  await overViewPage.totalUNITIsOrange();
}
);
When('user clicks on collateralization ratio tab', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.clickOnCollateralizationRatio();
});

Then('collateralization ratio is orange', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.collateralizationRatioIsOrange();
});

When('user clicks on active vaults tab', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.clickOnActiveVaults();
});

Then('active vaults is orange', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.activeVaultsIsOrange();
});
Then('all overview options are visible', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.verifyAllOptionsVisible();
});


Then('time range cycles through different values and percentage updates accordingly', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.cycleAndVerifyTimeRanges();
});
Then('transaction table headers are visible', async function() {
  overViewPage = overViewPage || new OverViewPage(this.page);
  await overViewPage.verifyTransactionTableVisible();
});