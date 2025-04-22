const BasePage = require('./BasePage');
const dotenv = require('dotenv');

dotenv.config();

class XverseExtensionPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'chrome-extension://idnnbdplmphpflfnlkomgpfbpcgelopg/popup.html';
    
    this.selectors = {
      forgotPasswordLink: 'xpath=//*[contains(text(), "Forgot your password?")]',
      backedUpCheckbox: '#backed-up-seedphrase-checkbox',
      resetButton: 'xpath=//*[contains(text(), "Reset")]',
      createNewWalletButton: 'text="Create a new wallet"',
      acceptButton: 'xpath=//*[contains(text(), "Accept")]',
      backupLaterButton: 'xpath=//*[contains(text(), "Backup later")]',
      passwordInput: 'input[type="password"]',
      confirmPasswordInput: '#confirm-password-input',
      continueButton: 'text="Continue"',
      settingsButton: 'button[data-testid="nav-settings"]',
      networkButton: 'xpath=//*[contains(text(), "Network")]',
      signetButton: 'xpath=//*[contains(text(), "Signet")]',
      btcUrlInput: 'xpath=//input[@data-testid="BTC URL"]',
      saveButton: 'xpath=//*[contains(text(), "Save")]'
    };
  }
  
  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
    return this;
  }
  
  async createWallet() {
    const password = process.env.PASSWORD;
    try {
      const forgetButtonVisible = await this.page.waitForSelector(this.selectors.forgotPasswordLink, {
        state: 'visible',
        timeout: 5000
      }).then(() => true).catch(() => false);
      
      if (forgetButtonVisible) {
        await this.page.click(this.selectors.forgotPasswordLink);
        await this.page.click(this.selectors.backedUpCheckbox);
        await this.page.click(this.selectors.resetButton);
        await this.page.click(this.selectors.createNewWalletButton);
        
        const firstAcceptButtonVisible = await this.page.waitForSelector(this.selectors.acceptButton, { 
            state: 'visible', 
            timeout: 5000  
        }).then(() => true).catch(() => false);
            
        if (firstAcceptButtonVisible) {
          await this.page.click(this.selectors.acceptButton);
        }
      }
       else if(!forgetButtonVisible){
        await this.page.click(this.selectors.createNewWalletButton);
        const SCAcceptButtonVisible = await this.page.waitForSelector(this.selectors.acceptButton, { 
            state: 'visible', 
            timeout: 5000  
        }).then(() => true).catch(() => false);
        if (SCAcceptButtonVisible) {
            await this.page.click(this.selectors.acceptButton);
          }
        await this.page.click(this.selectors.backupLaterButton); 
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.fill(this.selectors.confirmPasswordInput, password);
        await this.page.click(this.selectors.continueButton);
        
        const firstAcceptButtonVisible = await this.page.waitForSelector(this.selectors.acceptButton, { 
            state: 'visible', 
            timeout: 5000  
        }).then(() => true).catch(() => false);
            
        if (firstAcceptButtonVisible) {
          await this.page.click(this.selectors.acceptButton);
        }
      }
      else {
        await this.page.click(this.selectors.createNewWalletButton);
        await this.page.click(this.selectors.acceptButton);
      }
      
      await this.page.click(this.selectors.backupLaterButton); 
      await this.page.fill(this.selectors.passwordInput, password);
      await this.page.fill(this.selectors.confirmPasswordInput, password);
      await this.page.click(this.selectors.continueButton);
      const acceptButtonVisible = await this.page.waitForSelector(this.selectors.acceptButton, { 
        state: 'visible', 
        timeout: 5000  
      }).then(() => true).catch(() => false);
      
      if (acceptButtonVisible) {
        console.log("Accept button found, clicking it");
        await this.page.click(this.selectors.acceptButton);
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.fill(this.selectors.confirmPasswordInput, password);
        await this.page.click(this.selectors.continueButton);
      }
    } catch (error) {
      console.log("Error in wallet creation flow:", error.message);
    }
    return this;
  }
  
  async configureNetwork() {
    await this.page.click(this.selectors.settingsButton);
    await this.page.click(this.selectors.networkButton);
    await this.page.click(this.selectors.signetButton);
    await this.page.waitForSelector(this.selectors.btcUrlInput, { state: 'visible', timeout: 10000 });
    await this.page.fill(this.selectors.btcUrlInput, process.env.BTC_API_URL);
    await this.page.click(this.selectors.saveButton);
    return this;
  }
}

module.exports = XverseExtensionPage;
