const BasePage = require('./BasePage');
const dotenv = require('dotenv');
const { expect } = require('@playwright/test');
const { de } = require('@faker-js/faker');


dotenv.config();

class valutAfterCreation extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectorsOfvault = {
     withdraw : 'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[1]/button[2]',
     borrow : 'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[2]/button[1]',
     repay : 'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[2]/button[2]',
    };
    this.selectorOfDeposit ={
    depositAction : 'xpath=(//div[@class="flex lg:flex-1 flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:gap-6"])[1]/button[1]',
    deposit25: 'xpath=(//button[@type="button"])[4]',
    deposit_button: 'xpath=(//button[contains(@class, "bg-button-primary") and contains(text(), "Deposit")])[2]',
    depositInProgress : 'xpath = //div[contains(text(),"BTC Deposit in Progress . . .")]',
    depositComplete : 'xpath = //div[contains(text(),"BTC Deposit Complete")]',  
    balanceElement: 'xpath=(//h3)[1]/div' 

    }
    this.selectorsofXverse ={
        confirmButton: 'xpath=//*[contains(text(), "Confirm") or contains(text(), "CONFIRM")]'
    }
}
async getBalanceBeforeDeposit() {
    const balanceText = await this.page.locator(this.selectorOfDeposit.balanceElement).textContent();
    const balanceNumber = parseFloat(balanceText.replace('$', '').replace(/,/g, ''));
    return balanceNumber;
  }

  async performDeposit() {
    await this.page.locator(this.selectorOfDeposit.depositAction).click();
    await this.page.waitForTimeout(5000);
    await this.page.locator(this.selectorOfDeposit.deposit25).waitFor({ state: 'visible' });
    await this.page.locator(this.selectorOfDeposit.deposit25).click();
    await this.page.locator(this.selectorOfDeposit.deposit_button).waitFor({ 
      state: 'visible',
      timeout: 10000 
    });
    const isDisabled = await this.page.locator(this.selectorOfDeposit.deposit_button).isDisabled();
    if (isDisabled) {
      console.log('Waiting for deposit button to be enabled...');
      await this.page.waitForTimeout(2000);
    }
    
    // This click will trigger the confirmation popup/tab
    console.log('Clicking deposit button...');
    await this.page.locator(this.selectorOfDeposit.deposit_button).click();
    console.log('Deposit button clicked successfully');   
    return this;
  }
 

async handleConfirmation(context, handlePageTransition) {
  console.log('Waiting for confirmation page...');
  const confirmationPage = await handlePageTransition(
    context,
    this.page,
    async () => {
      await this.page.waitForTimeout(1000);
    },
    30000
  );
  
  if (confirmationPage) {
    try {
      console.log('Confirmation page detected, looking for confirm button...');
      await confirmationPage.waitForSelector(this.selectorsofXverse.confirmButton, {
        state: 'visible',
        timeout: 30000
      });
      await confirmationPage.click(this.selectorsofXverse.confirmButton);
      console.log('Successfully clicked Confirm button in new tab');
    } catch (confirmError) {
      console.error('Error finding or clicking Confirm button:', confirmError);
    }
  } else {
    console.error('New page was not opened as expected');
  }
  return this;
}

  async verifyDepositStatus() {
    await this.page.locator(this.selectorOfDeposit.depositInProgress).waitFor({ state: 'visible' });
    await this.page.locator(this.selectorOfDeposit.depositComplete).waitFor({ state: 'visible', timeout: 60000 });
    return this;
  }
}
module.exports = valutAfterCreation;