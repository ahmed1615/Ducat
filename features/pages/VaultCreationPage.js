const BasePage = require("./BasePage");

class VaultCreationPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      nameInput: 'xpath=//input[@name="name"]',
      continueButton: 'xpath=//*[contains(text(), "Continue")]',
      errorMessage: '//div[@class="flex flex-col gap-2 w-full"]/div/span',
      feeErrorMessage: '//div[@class="flex flex-col gap-2 w-full"]/div/span',
      nextButton: 'xpath=(//button[@type="button"])[5]',
      finalButton: 'xpath=(//button[@type="button"])[10]',
      previewButton: 'xpath=//*[contains(text(), "Preview")]',
      confirmButton: 'xpath=(//*[contains(text(), "Confirm")])[2]',
      confirmAllButton: 'xpath=//*[contains(text(), "Confirm all")]',
      closeButton: 'xpath=//*[contains(text(), "Close")]',
      successMessage: '//h2[contains(text(), "Vault Successfully Created!")]',
      goToVaultButton: '//button[contains(text(), "Go to Vault")]',
      receiveButton: 'xpath=//*[contains(text(),"mutinynet")]',
      createVaultButton: 'xpath=//*[contains(text(), "Create Vault")]',
    };
  }

  async fillVaultName(name) {
    await this.page.fill(this.selectors.nameInput, name);
    await this.page.click(this.selectors.continueButton);
    return this;
  }

  async completeVaultCreation() {
    let errorExists = await this.page
      .locator(this.selectors.feeErrorMessage)
      .filter({
        hasText: "The fees to open a vault are higher than your balance",
      })
      .isVisible()
      .catch(() => false);

    if (errorExists) {
      console.log("Fee error message detected. Waiting for it to disappear...");

      const maxWaitTime = 30000;
      const checkInterval = 1000;
      const startTime = Date.now();

      while (Date.now() - startTime < maxWaitTime) {
        errorExists = await this.page
          .locator(this.selectors.feeErrorMessage)
          .filter({
            hasText: "The fees to open a vault are higher than your balance",
          })
          .isVisible()
          .catch(() => false);

        if (!errorExists) {
          console.log(
            "Error message is no longer visible, continuing with workflow",
          );
          break;
        }

        await this.page.waitForTimeout(checkInterval);
      }

      if (errorExists) {
        console.log(
          "Error message remained visible after timeout. Will attempt to continue anyway.",
        );
      }
    }
    await this.page.click(this.selectors.nextButton);
    await this.page.click(this.selectors.finalButton);
    await this.page.click(this.selectors.previewButton);
    await this.page.waitForTimeout(1000);
    await this.page.click(this.selectors.confirmButton);
    return this;
  }

  async handleConfirmation(context, handlePageTransition) {
    const confirmationPage = await handlePageTransition(
      context,
      this.page,
      async () => {
        await this.page.waitForTimeout(1000);
      },
      30000,
    );

    if (confirmationPage) {
      try {
        await confirmationPage.waitForSelector(
          this.selectors.confirmAllButton,
          {
            state: "visible",
            timeout: 15000,
          },
        );
        await confirmationPage.click(this.selectors.confirmAllButton);
        await confirmationPage.click(this.selectors.closeButton);
        console.log("Successfully clicked Confirm all button");
      } catch (confirmError) {
        console.error(
          "Error finding or clicking Confirm all button:",
          confirmError,
        );
      }
    }
    return this;
  }

  async waitForSuccessAndNavigate() {
    try {
      await this.page.waitForSelector(this.selectors.successMessage, {
        state: "visible",
        timeout: 60000,
      });
      await this.page.waitForSelector(this.selectors.goToVaultButton, {
        state: "visible",
        timeout: 50000,
      });
      await this.page.click(this.selectors.goToVaultButton);
      console.log('Clicked "Go to Vault" button');

      await this.page.waitForLoadState("networkidle");
      return true;
    } catch (error) {
      console.error(
        "Error waiting for success message or clicking Go to Vault button:",
        error,
      );
      return false;
    }
  }
  async navigateToCreateVault() {
    await this.page.waitForSelector(this.selectors.receiveButton, {
      state: "visible",
      timeout: 60000,
    });
    await this.page.click(this.selectors.receiveButton);
    await this.page.waitForTimeout(8000);
    await this.page.click(this.selectors.createVaultButton);
    return this;
  }
}

module.exports = VaultCreationPage;
