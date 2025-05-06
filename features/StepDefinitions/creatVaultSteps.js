const { When, Given, Then } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { generateRandomString } = require("../../TestData/generator.js");
const XverseExtensionPage = require("../pages/ XverseExtensionPage.js");
const DucatProtocolPage = require("../pages/DucatProtocolPage.js");
const VaultCreationPage = require("../pages/VaultCreationPage.js");
const { handlePageTransition } = require("../pages/utils/pageUtils.js");
const { expect } = require("allure-playwright");

Given("I have opened the Xverse extension", async function () {
  console.log("Opening Xverse extension...");
  const context = this.browser.contexts()[0];
  this.context = context;

  this.xversePage = new XverseExtensionPage(await context.newPage());
  await this.xversePage.goto();
});

When("I create a new wallet with password", async function () {
  await this.xversePage.createWallet();
});

When("I navigate to Ducat Protocol app", async function () {
  //here i want to got to app page
  this.ducatPage = new DucatProtocolPage(await this.context.newPage());
  await this.ducatPage.goto();
  // this.page = await this.ducatPage.launchApp(this.context);
  // this.appPage = new DucatProtocolPage(this.page);
  // await this.appPage.waitForLoad();
});

When("I connect my wallet in the first time", async function () {
  this.appPage = new DucatProtocolPage(await this.context.newPage());
  await this.appPage.goto();
  await this.appPage.connectWallet();
  const walletPage = await this.appPage.selectXverseWallet(
    this.context,
    handlePageTransition,
  );
  if (walletPage) {
    await walletPage.click('xpath=//*[contains(text(), "Accept")]');
  } else {
    console.error("Failed to capture the wallet page");
  }
});

Then("the error network selection do not match", async function () {
  const errorMessage = await this.appPage.noWalletConnection();
  expect(errorMessage).toContain(
    "Your wallet address and network selection don",
  );
});

When("I configure the network in Xverse", async function () {
  const xverseConfigPage = new XverseExtensionPage(
    await this.context.newPage(),
  );
  await xverseConfigPage.goto();
  await xverseConfigPage.configureNetwork();
});

When("I reconnect to Ducat Protocol", async function () {
  this.appPage = new DucatProtocolPage(await this.context.newPage());
  await this.appPage.goto();
  await this.appPage.connectWallet();
  const walletPage = await this.appPage.selectXverseWallet(
    this.context,
    handlePageTransition,
  );
  if (walletPage) {
    await walletPage.click('xpath=//*[contains(text(), "Accept")]');
    this.page = this.appPage.page;
  } else {
    console.error("Failed to capture the wallet page");
  }
});

Then(
  "I should be able to create a new vault with {string} of Deposit OTC and {string} of Borrow UNIT",
  async function (depositOTC, borrowUnit) {
    this.page = this.page || this.appPage.page;
    this.vaultPage = new VaultCreationPage(this.page);
    await this.vaultPage.navigateToCreateVault();
    const vaultName = generateRandomString();
    await this.vaultPage.fillVaultName(vaultName);
    await this.page.waitForTimeout(4000);
    await this.vaultPage.completeVaultCreation(depositOTC, borrowUnit);
    await this.vaultPage.handleConfirmation(this.context, handlePageTransition);
    await this.vaultPage.waitForSuccessAndNavigate();
  },
);

Then(
  "I should see the last operation of type {string} with date of today and amount has $",
  async function (operationType) {
    const vaultPage = this.vaultPage || new VaultCreationPage(this.page);
    await this.page.waitForTimeout(2000);
    const operationValid = await vaultPage.assertLastOperation(operationType);
    expect(operationValid).toBeTruthy();
    console.log(
      `Successfully verified last operation of type: ${operationType}`,
    );
  },
);
