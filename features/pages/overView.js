const BasePage = require('./BasePage');
const dotenv = require('dotenv');
const { expect } = require('@playwright/test');

dotenv.config();

class OverViewPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = process.env.DUCAT_URLAPP;
    
    this.selectors = {
      overView: 'xpath=//span[contains(text(),"Overview")]',
      totalBTCDucatValuts :'xpath=//button[contains(@class, "flex-col")][1]',
      totalUNIT : 'xpath=//button[contains(@class, "flex-col")][2]',
      collateraizationRatio :'xpath=//button[contains(@class, "flex-col")][3]',
      activeValuts : 'xpath=//button[contains(@class, "flex-col")][4]',
      listOfOpetions :'xpath=.flex.gap-y-1 li;'
    };

    this.optionSelectors = {
        BTCinValuts : 'xpath=//span[contains(text(),"BTC in Vaults")]',
        unitBrrowwed : 'xpath=//span[contains(text(),"UNIT Borrowed")]',
        collateralRatio: 'xpath=//span[contains(text(),"Collateral Ratio")]',
        activeVaults : 'xpath=//span[contains(text(),"Active Vaults")]',
    };
    this.itemscenter ={
      timeRange: '.uppercase',
      precntageRange :'xpath=//*[@id="BitcoinBanner"]/div[4]/div[2]'
    },
    this.transactiontable = {
      date: 'xpath=//div[contains(text(),"Date")]',
      type: 'xpath=//div[contains(text(),"Type")]',
      amount: 'xpath=//div[contains(text(),"Amount")]',

    }
  }
  
  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  async waitForOverviewToLoad() {
    await this.page.waitForSelector(this.selectors.overView, {
      state: 'visible',
      timeout: 10000
    });
    await this.page.click(this.selectors.overView);
    return this;
  }
  async totalBTCIsOrange() {
    await this.page.waitForSelector(this.selectors.totalBTCDucatValuts, {
        state: 'visible',
        timeout: 10000
      });
      const totalBTCLocator = this.page.locator(this.selectors.totalBTCDucatValuts);
    await expect(totalBTCLocator).toHaveClass(/text-orange-100/);
  }
  async clickOnTotalUnit() {
    await this.page.waitForSelector(this.selectors.totalUNIT, {
      state: 'visible',
      timeout: 10000
    });
    await this.page.click(this.selectors.totalUNIT);
  }
  async totalUNITIsOrange() {
    await this.page.waitForSelector(this.selectors.totalUNIT, {
        state: 'visible',
        timeout: 10000
      });
      const totalUnit = this.page.locator(this.selectors.totalUNIT);
    await expect(totalUnit).toHaveClass(/text-orange-100/);
  }
  async clickOnCollateralizationRatio() {
    await this.page.waitForSelector(this.selectors.collateraizationRatio, {
      state: 'visible',
      timeout: 10000
    });
    await this.page.click(this.selectors.collateraizationRatio);
  }

  async collateralizationRatioIsOrange() {
    await this.page.waitForSelector(this.selectors.collateraizationRatio, {
        state: 'visible',
        timeout: 10000
      });
      const ratioLocator = this.page.locator(this.selectors.collateraizationRatio);
    await expect(ratioLocator).toHaveClass(/text-orange-100/);
  }

  async clickOnActiveVaults() {
    await this.page.waitForSelector(this.selectors.activeValuts, {
      state: 'visible',
      timeout: 10000
    });
    await this.page.click(this.selectors.activeValuts);
  }

  async activeVaultsIsOrange() {
    await this.page.waitForSelector(this.selectors.activeValuts, {
        state: 'visible',
        timeout: 10000
      });
      const vaultsLocator = this.page.locator(this.selectors.activeValuts);
    await expect(vaultsLocator).toHaveClass(/text-orange-100/);
  }
  async verifyAllOptionsVisible() {
    const results = {};
    for (const [key, selector] of Object.entries(this.optionSelectors)) {
      try {
        await this.page.waitForSelector(selector, {
          state: 'visible',
          timeout: 10000
        });
        results[key] = true;
      } catch (error) {
        results[key] = false;
        console.error(`Element ${key} is not visible: ${error.message}`);
      }
    }
    const allVisible = Object.values(results).every(isVisible => isVisible);
    
    if (!allVisible) {
      const missingElements = Object.entries(results)
        .filter(([_, isVisible]) => !isVisible)
        .map(([key]) => key)
        .join(', ');
      throw new Error(`Not all elements are visible. Missing: ${missingElements}`);
    }
    
    return true;
  }

async getPercentageValue() {
  const percentageRangeLocator = this.page.locator(this.itemscenter.precntageRange);
  return await percentageRangeLocator.textContent();
}

async cycleAndVerifyTimeRanges() {
  const timeRangeLocator = this.page.locator(this.itemscenter.timeRange);
  const percentageRangeLocator = this.page.locator(this.itemscenter.precntageRange);

  let currentTimeRange = await timeRangeLocator.textContent();
  let currentPercentage = await percentageRangeLocator.textContent();
  const initialTimeRange = currentTimeRange.trim();
  const initialPercentage = currentPercentage.trim();
  
  console.log(`Starting with time range: ${initialTimeRange}`);
  

  let previousTimeRange = initialTimeRange;
  let previousPercentage = initialPercentage;
  let uniqueTimeRanges = new Set([initialTimeRange]);
  

  for (let i = 0; i < 4; i++) {
    await timeRangeLocator.click();
    await this.page.waitForTimeout(1000); 
    
  
    currentTimeRange = (await timeRangeLocator.textContent()).trim();
    currentPercentage = (await percentageRangeLocator.textContent()).trim();
    
    console.log(`After click ${i+1}, time range: ${currentTimeRange}`);
  
    if (currentTimeRange === previousTimeRange) {
      throw new Error(`Time range did not change after click ${i+1}`);
    }
    
    
    if (currentPercentage === previousPercentage) {
      throw new Error(`Percentage did not change after click ${i+1}`);
    }
    
    
    uniqueTimeRanges.add(currentTimeRange);
    
 
    previousTimeRange = currentTimeRange;
    previousPercentage = currentPercentage;
  }
  

  if (uniqueTimeRanges.size !== 4) {
    throw new Error(`Expected 4 unique time ranges, but found ${uniqueTimeRanges.size}`);
  }
  
  if (currentTimeRange !== initialTimeRange) {
    throw new Error(`Did not return to initial time range after full cycle. Expected ${initialTimeRange}, got ${currentTimeRange}`);
  }
  
  return this;
}
async verifyTransactionTableVisible() {
  const results = {};

  try {

    await this.page.waitForTimeout(1000);

    for (const [key, selector] of Object.entries(this.transactiontable)) {
      try {
        await this.page.waitForSelector(selector, {
          state: 'visible',
          timeout: 10000
        });
        results[key] = true;
      } catch (error) {
        results[key] = false;
        console.error(`Transaction table header "${key}" is not visible: ${error.message}`);
      }
    }
    const allVisible = Object.values(results).every(isVisible => isVisible);
    
    if (!allVisible) {
      const missingHeaders = Object.entries(results)
        .filter(([_, isVisible]) => !isVisible)
        .map(([key]) => key)
        .join(', ');
      throw new Error(`Not all transaction table headers are visible. Missing: ${missingHeaders}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying transaction table:', error);
    throw new Error(`Transaction table verification failed: ${error.message}`);
  }
}
}


module.exports = OverViewPage;