const BasePage = require("./BasePage");
const dotenv = require("dotenv");

dotenv.config();

class withdrawalPage extends BasePage {
  constructor(page) {
    super(page);

    (this.selectorOfWithdraw = {
      withdrawAction:
        'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[1]/button[2]',
      withdrawal25: 'xpath=(//button[@type="button"])[4]',
      withdrawal50: 'xpath=(//button[@type="button"])[5]',
      withdrawal75: 'xpath=(//button[@type="button"])[6]',
      withdrawal100: 'xpath=(//button[@type="button"])[7]',
      withdraw_button:
        'xpath=(//button[contains(@class, "bg-button-primary") and contains(text(), "Withdraw")])[1]',
      withdrawSubmitted:
        'xpath = //div[contains(text(),"BTC Withdraw Submitted")]',
      withdrawCompleted:
        'xpath = //div[contains(text(),"BTC Withdraw Complete")]',
      balanceElement: "xpath=(//h3)[1]/div",
    }),
      (this.selectorsofXverse = {
        confirmButton:
          'xpath=//*[contains(text(), "Confirm") or contains(text(), "CONFIRM")]',
      });
  }
  async performWithdrawal(percentage) {
    await this.page.locator(this.selectorOfWithdraw.withdrawAction).click();
    await this.page.waitForTimeout(4000);
    let withdrawSelector;

    const parsedPercentage = parseInt(String(percentage).replace("%", ""));

    switch (parsedPercentage) {
      case 25:
        withdrawSelector = this.selectorOfWithdraw.withdrawal25;
        break;
      case 50:
        withdrawSelector = this.selectorOfWithdraw.withdrawal50;
        break;
      case 75:
        withdrawSelector = this.selectorOfWithdraw.withdrawal75;
        break;
      case 100:
        withdrawSelector = this.selectorOfWithdraw.withdrawal100;
        break;
      default:
        console.log(`Invalid percentage: ${percentage}. Defaulting to 25%.`);
        withdrawSelector = this.selectorOfWithdraw.withdrawal25;
    }

    await this.page.locator(withdrawSelector).waitFor({ state: "visible" });
    await this.page.locator(withdrawSelector).click();

    await this.page.locator(this.selectorOfWithdraw.withdraw_button).waitFor({
      state: "visible",
      timeout: 10000,
    });

    const isDisabled = await this.page
      .locator(this.selectorOfWithdraw.withdraw_button)
      .isDisabled();

    if (isDisabled) {
      console.log("Waiting for withdrawal button to be enabled...");
      await this.page.waitForTimeout(2000);
    }

    console.log("Clicking withdraw button...");
    await this.page.locator(this.selectorOfWithdraw.withdraw_button).click();
    console.log("Withdraw button clicked successfully");

    return this;
  }
  async handleConfirmationOfWithdraw(context, handlePageTransition) {
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
          this.selectorsofXverse.confirmButton,
          {
            state: "visible",
            timeout: 30000,
          },
        );
        await confirmationPage.click(this.selectorsofXverse.confirmButton);
        console.log("Successfully clicked Confirm button in new tab");
      } catch (confirmError) {
        console.error(
          "Error finding or clicking Confirm button:",
          confirmError,
        );
      }
    } else {
      console.error("New page was not opened as expected");
    }
    return this;
  }
  async verifyWithdrawalStatus() {
    await this.page
      .locator(this.selectorOfWithdraw.withdrawSubmitted)
      .waitFor({ state: "visible" });
    await this.page
      .locator(this.selectorOfWithdraw.withdrawCompleted)
      .waitFor({ state: "visible", timeout: 60000 });
    return this;
  }
  async getCurrentBalance() {
    await this.page.waitForTimeout(4000);
    const balanceText = await this.page
      .locator(this.selectorOfWithdraw.balanceElement)
      .textContent();
    console.log(`Current balance text: ${balanceText}`);
    const balanceNumber = parseFloat(
      balanceText.replace("$", "").replace(/,/g, ""),
    );
    return balanceNumber;
  }

  async verifyBalanceDecreased(initialBalance) {
    await this.page.waitForTimeout(5000);
    await this.page.reload();
    await this.page.locator(this.selectorOfWithdraw.balanceElement).waitFor({
      state: "visible",
      timeout: 10000,
    });

    const currentBalance = await this.getCurrentBalance();
    console.log(
      `Comparing balances - Initial: $${initialBalance}, Current: $${currentBalance}`,
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
module.exports = withdrawalPage;
