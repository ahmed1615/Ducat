const BasePage = require("./BasePage");
const dotenv = require("dotenv");

dotenv.config();

class borrowPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectorsOfvault = {
      borrowAction:
        'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[2]/button[1]',
        borrow25: 'xpath=(//button[@type="button"])[4]',
        borrow50 : 'xpath=(//button[@type="button"])[5]',
        borrow75: 'xpath=(//button[@type="button"])[6]',
        borrow100: 'xpath=(//button[@type="button"])[7]',
        borrowButton: '(//button[contains(@class, "bg-button-primary") and contains(text(), "Borrow")])[2]',
        borrowInProgress:
          'xpath = //div[contains(text(),"BTC Borrow in Progress . . .")]',
        borrowComplete: 'xpath = //div[contains(text(),"BTC Borrow Complete")]',
        balanceElement: "xpath=(//h3)[2]/div",
    },
    this.selectorsofXverse = {
        confirmAllButton:
          'xpath=//*[contains(text(), "Confirm all") or contains(text(), "confirm")]',
        closeButton:
          'xpath=//*[contains(text(), "Close") or contains(text(), "Close")]',
      };
  }

  async performBorrow(percentage) {
    await this.page.locator(this.selectorsOfvault.borrowAction).click();
    await this.page.waitForTimeout(3000);
    let borrowSelector;
    
    const parsedPercentage = parseInt(String(percentage).replace('%', ''));
    
    switch (parsedPercentage) {
      case 25:
        borrowSelector = this.selectorsOfvault.borrow25;
        break;
      case 50:
        borrowSelector = this.selectorsOfvault.borrow50;
        break;
      case 75:
        borrowSelector = this.selectorsOfvault.borrow75;
        break;
      case 100:
        borrowSelector = this.selectorsOfvault.borrow100;
        break;
      default:
        console.log(`Invalid percentage: ${percentage}. Defaulting to 25%.`);
        borrowSelector = this.selectorsOfvault.borrow25;
    }
    
    await this.page.locator(borrowSelector).waitFor({ state: "visible", timeout: 10000 });
    await this.page.locator(borrowSelector).click();
    
    await this.page.locator(this.selectorsOfvault.borrowButton).waitFor({
      state: "visible",
      timeout: 10000,
    });
    
    const isDisabled = await this.page
      .locator(this.selectorsOfvault.borrowButton)
      .isDisabled();
    
    if (isDisabled) {
      console.log("Waiting for borrow button to be enabled...");
      await this.page.waitForTimeout(2000);
    }
    
    console.log("Clicking borrow button...");
    await this.page.locator(this.selectorsOfvault.borrowButton).click();
    console.log("Borrow button clicked successfully");
    
    return this;
  }

  async handleConfirmationOfBorrow(context, handlePageTransition) {
    console.log("Waiting for confirmation page...");
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
        console.log(
          "Confirmation page detected, looking for confirm button...",
        );
        await confirmationPage.waitForSelector(
          this.selectorsofXverse.confirmAllButton,
          {
            state: "visible",
            timeout: 30000,
          },
        );
        await confirmationPage.click(this.selectorsofXverse.confirmAllButton);
        console.log("Successfully clicked confirm button in new tab");
        await confirmationPage.waitForSelector(
          this.selectorsofXverse.closeButton,
          {
            state: "visible",
            timeout: 30000,
          },
        );
        await confirmationPage.click(this.selectorsofXverse.closeButton);
      } catch (confirmError) {
        console.error("Error finding or close button:", confirmError);
      }
    } else {
      console.error("New page was not opened as expected");
    }
    return this;
  }

  async verifyBorrowStatus() {
    await this.page
      .locator(this.selectorsOfvault.borrowInProgress)
      .waitFor({ state: "visible" });
    await this.page
      .locator(this.selectorsOfvault.borrowComplete)
      .waitFor({ state: "visible", timeout: 60000 });
    return this;
  }

  async getCurrentBalance() {
    await this.page.waitForTimeout(1000);
    const balanceText = await this.page
      .locator(this.selectorsOfvault.balanceElement)
      .textContent();
    const elementInfo = await this.page
      .locator(this.selectorsOfvault.balanceElement)
      .evaluate((el) => {
        const attributes = {};
        for (const attr of el.attributes) {
          attributes[attr.name] = attr.value;
        }

        return {
          textContent: el.textContent,
          innerHTML: el.innerHTML,
          attributes,
          className: el.className,
        };
      });

    console.log("Complete element information:", elementInfo);
    console.log(`Current balance text: ${balanceText}`);
    const balanceNumber = parseFloat(balanceText.replace(/,/g, ""));
    return balanceNumber;
  }

  async verifyBalanceIncreased(initialBalance) {
    await this.page.waitForTimeout(4000);
    await this.page.locator(this.selectorsOfvault.balanceElement).waitFor({
      state: "visible",
      timeout: 10000,
    });

    const currentBalance = await this.getCurrentBalance();
    console.log(
      `Comparing balances - Initial: ${initialBalance}, Current: $${currentBalance}`,
    );
    if (currentBalance > initialBalance) {
      const increase = currentBalance - initialBalance;
      console.log(`Balance increased by: $${increase.toFixed(2)}`);
      return true;
    } else {
      console.error(
        `Balance did not increase. Initial: $${initialBalance}, Current: $${currentBalance}`,
      );
      return false;
    }
  }
}

module.exports = borrowPage;