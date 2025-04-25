const BasePage = require("./BasePage");

class VaultCreationPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      nameInput: 'xpath=//input[@name="name"]',
      continueButton: 'xpath=//*[contains(text(), "Continue")]',
      errorMessage: '//div[@class="flex flex-col gap-2 w-full"]/div/span',
      feeErrorMessage: '//div[@class="flex flex-col gap-2 w-full"]/div/span',
      DepositBTC25: 'xpath=(//button[@type="button"])[4]',
      DepositBTC50: 'xpath=(//button[@type="button"])[5]',
      DepositBTC75: 'xpath=(//button[@type="button"])[6]',
      DepositBTC100: 'xpath=(//button[@type="button"])[7]',
      BorrowUNIT25: 'xpath=(//button[@type="button"])[9]',
      BorrowUNIT50: 'xpath=(//button[@type="button"])[10]',
      BorrowUNIT75: 'xpath=(//button[@type="button"])[11]',
      BorrowUNIT100: 'xpath=(//button[@type="button"])[12]',
      previewButton: 'xpath=//*[contains(text(), "Preview")]',
      confirmButton: 'xpath=(//*[contains(text(), "Confirm")])[2]',
      confirmAllButton: 'xpath=//*[contains(text(), "Confirm all")]',
      closeButton: 'xpath=//*[contains(text(), "Close")]',
      successMessage: '//h2[contains(text(), "Vault Successfully Created!")]',
      goToVaultButton: '//button[contains(text(), "Go to Vault")]',
      receiveButton: 'xpath=//*[contains(text(),"mutinynet") or contains(text(),"signet")]',
      createVaultButton: 'xpath=//*[contains(text(), "Create Vault")]',
    };
  }

  async fillVaultName(name) {
    await this.page.fill(this.selectors.nameInput, name);
    await this.page.click(this.selectors.continueButton);
    return this;
  }

  async completeVaultCreation(depositBtc, borrowUnit) {
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
  
    if (depositBtc) {
      const parsedDepositPercentage = parseInt(String(depositBtc).replace('%', ''));
      let depositSelector;
      
      switch (parsedDepositPercentage) {
        case 25:
          depositSelector = this.selectors.DepositBTC25;
          break;
        case 50:
          depositSelector = this.selectors.DepositBTC50;
          break;
        case 75:
          depositSelector = this.selectors.DepositBTC75;
          break;
        case 100:
          depositSelector = this.selectors.DepositBTC100;
          break;
        default:
          console.log(`Invalid deposit percentage: ${depositBtc}. Defaulting to 25%.`);
          depositSelector = this.selectors.DepositBTC25;
      }
      
      console.log(`Selecting ${depositBtc} BTC deposit`);
      await this.page.click(depositSelector);
    }
    if (borrowUnit) {
      const parsedBorrowPercentage = parseInt(String(borrowUnit).replace('%', ''));
      let borrowSelector;
      
      switch (parsedBorrowPercentage) {
        case 25:
          borrowSelector = this.selectors.BorrowUNIT25;
          break;
        case 50:
          borrowSelector = this.selectors.BorrowUNIT50;
          break;
        case 75:
          borrowSelector = this.selectors.BorrowUNIT75;
          break;
        case 100:
          borrowSelector = this.selectors.BorrowUNIT100;
          break;
        default:
          console.log(`Invalid borrow percentage: ${borrowUnit}. Defaulting to 25%.`);
          borrowSelector = this.selectors.BorrowUNIT25;
      }
      
      console.log(`Selecting ${borrowUnit} UNIT borrow`);
      await this.page.click(borrowSelector);
    }
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
