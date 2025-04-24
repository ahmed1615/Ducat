const BasePage = require("./BasePage");
const dotenv = require("dotenv");

dotenv.config();

class repayPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectorOfRepay = {
      repayAction:
        'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[2]/button[2]',
      repay25: 'xpath=(//button[@type="button"])[4]',
      repay_button:
        'xpath=(//button[contains(@class, "bg-button-primary") and contains(text(), "Repay")])[1]',
      repayInProgress:
        'xpath = //div[contains(text(),"BTC Repay in Progress . . .")]',
      repayCompleted: 'xpath = //div[contains(text(),"BTC Repay Completed")]',
      repayBalanceElement: "xpath=(//h3)[2]/div",
    };
    this.selectorsofXverse = {
      confirmAllButton:
        'xpath=//*[contains(text(), "Confirm all") or contains(text(), "confirm")]',
      closeButton:
        'xpath=//*[contains(text(), "Close") or contains(text(), "Close")]',
    };
  }
  async performRepay() {
    await this.page.locator(this.selectorOfRepay.repayAction).click();
    await this.page.waitForTimeout(5000);
    await this.page
      .locator(this.selectorOfRepay.repay25)
      .waitFor({ state: "visible", timeout: 10000 });
    await this.page.locator(this.selectorOfRepay.repay25).click();
    await this.page.locator(this.selectorOfRepay.repay_button).waitFor({
      state: "visible",
      timeout: 10000,
    });
    const isDisabled = await this.page
      .locator(this.selectorOfRepay.repay_button)
      .isDisabled();
    if (isDisabled) {
      console.log("Waiting for repay button to be enabled...");
      await this.page.waitForTimeout(2000);
    }
    console.log("Clicking repay button...");
    await this.page.locator(this.selectorOfRepay.repay_button).click();
    console.log("repay button clicked successfully");
    return this;
  }
  async handleConfirmationOfRepay(context, handlePageTransition) {
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
        console.log("Successfully clicked close button in new tab");
        await confirmationPage.waitForSelector(
          this.selectorsofXverse.closeButton,
          {
            state: "visible",
            timeout: 30000,
          },
        );
        await confirmationPage.click(this.selectorsofXverse.closeButton);
      } catch (confirmError) {
        console.error("Error finding or close  button:", confirmError);
      }
    } else {
      console.error("New page was not opened as expected");
    }
    return this;
  }
  async verifyRepayStatus() {
    await this.page
      .locator(this.selectorOfRepay.repayInProgress)
      .waitFor({ state: "visible" });
    await this.page
      .locator(this.selectorOfRepay.repayCompleted)
      .waitFor({ state: "visible", timeout: 60000 });
    return this;
  }
  async getCurrentBalance() {
    await this.page.waitForTimeout(1000);
    const balanceText = await this.page
      .locator(this.selectorOfRepay.repayBalanceElement)
      .textContent();
    const elementInfo = await this.page
      .locator(this.selectorOfRepay.repayBalanceElement)
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

  async verifyBalanceDecreased(initialBalance) {
    await this.page.waitForTimeout(6000);
    await this.page.locator(this.selectorOfRepay.repayBalanceElement).waitFor({
      state: "visible",
      timeout: 10000,
    });

    const currentBalance = await this.getCurrentBalance();
    console.log(
      `Comparing balances - Initial: ${initialBalance}, Current: $${currentBalance}`,
    );
    if (currentBalance < initialBalance) {
      const decrease = initialBalance - currentBalance;
      console.log(`Balance decreased by: $${decrease.toFixed(2)}`);
      return true;
    } else {
      console.error(
        `Balance did not decrease. Initial: $${initialBalance}, Current: $${currentBalance}`,
      );
      return false;
    }
  }
}
module.exports = repayPage;
