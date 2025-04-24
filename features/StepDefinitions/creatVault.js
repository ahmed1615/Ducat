const { When, Before, After, Given, Then } = require("@cucumber/cucumber");
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
  this.ducatPage = new DucatProtocolPage(await this.context.newPage());
  await this.ducatPage.goto();
  this.page = await this.ducatPage.launchApp(this.context);
  this.appPage = new DucatProtocolPage(this.page);
  await this.appPage.waitForLoad();
});

When("I connect my wallet in the first time", async function () {
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
  // Navigate to Ducat Protocol again
  const ducatPage2 = new DucatProtocolPage(await this.context.newPage());
  await ducatPage2.goto();
  this.page = await ducatPage2.launchApp(this.context);

  // Connect wallet again
  const appPage2 = new DucatProtocolPage(this.page);
  await appPage2.waitForLoad();
  await appPage2.connectWallet();

  const walletPage2 = await appPage2.selectXverseWallet(
    this.context,
    handlePageTransition,
  );
  if (walletPage2) {
    await walletPage2.click('xpath=//*[contains(text(), "Accept")]');
  } else {
    console.error("Failed to capture the wallet page");
  }
});

Then("I should be able to create a new vault", async function () {
  const vaultPage = new VaultCreationPage(this.page);
  await vaultPage.navigateToCreateVault();
  await vaultPage.fillVaultName(generateRandomString());
  await this.page.waitForTimeout(8000);
  await vaultPage.completeVaultCreation();
  await vaultPage.handleConfirmation(this.context, handlePageTransition);
  await vaultPage.waitForSuccessAndNavigate();
});

When(
  "I open Xverse extension and navigate to Ducat Protocol app",
  async function () {
    try {
      console.log("Opening Xverse extension and creating wallet...");

      const context = this.browser.contexts()[0];

      // Initialize and use the Xverse Extension page
      const xversePage = new XverseExtensionPage(await context.newPage());
      await xversePage.goto();
      await xversePage.createWallet();

      console.log("Starting test with existing Chrome and Xverse...");

      // Navigate to Ducat Protocol
      const ducatPage = new DucatProtocolPage(await context.newPage());
      await ducatPage.goto();
      this.page = await ducatPage.launchApp(context);

      // Initialize app interactions with the new page
      const appPage = new DucatProtocolPage(this.page);
      await appPage.waitForLoad();
      await appPage.connectWallet();

      // Handle wallet selection
      const walletPage = await appPage.selectXverseWallet(
        context,
        handlePageTransition,
      );
      if (walletPage) {
        await walletPage.click('xpath=//*[contains(text(), "Accept")]');
      } else {
        console.error("Failed to capture the wallet page");
      }

      const xverseConfigPage = new XverseExtensionPage(await context.newPage());
      await xverseConfigPage.goto();
      await xverseConfigPage.configureNetwork();

      // Navigate to Ducat Protocol again
      const ducatPage2 = new DucatProtocolPage(await context.newPage());
      await ducatPage2.goto();
      this.page = await ducatPage2.launchApp(context);

      // Connect wallet again
      const appPage2 = new DucatProtocolPage(this.page);
      await appPage2.waitForLoad();
      await appPage2.connectWallet();

      const walletPage2 = await appPage2.selectXverseWallet(
        context,
        handlePageTransition,
      );
      if (walletPage2) {
        await walletPage2.click('xpath=//*[contains(text(), "Accept")]');
      } else {
        console.error("Failed to capture the wallet page");
      }

      const vaultPage = new VaultCreationPage(this.page);
      await vaultPage.navigateToCreateVault();
      await vaultPage.fillVaultName(generateRandomString());
      await this.page.waitForTimeout(8000);
      await vaultPage.completeVaultCreation();
      await vaultPage.handleConfirmation(context, handlePageTransition);
      await vaultPage.waitForSuccessAndNavigate();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
);
