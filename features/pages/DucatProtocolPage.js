const BasePage = require("./BasePage");
const dotenv = require("dotenv");

dotenv.config();

class DucatProtocolPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = process.env.DUCAT_URL;

    this.selectors = {
      cookieAcceptButton: "input#__framer-cookie-component-button-accept",
      launchAppButton: 'xpath=(//*[contains(text(), "Launch App")])[1]',
      connectWalletButton: 'span:has-text("Connect Wallet")',
      walletOptionsContainer: "div.flex.flex-col.gap-4.lg\\:gap-8.text-white",
      xverseWalletOption:
        'xpath=//div[@class="flex flex-col gap-4 lg:gap-8 text-white"]/div[1]',
      noMatchWallet: "xpath=(//p)[1]",
    };
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForTimeout(3000);

    try {
      await this.page.waitForSelector(this.selectors.cookieAcceptButton, {
        state: "visible",
        timeout: 1000,
      });
      await this.page.click(this.selectors.cookieAcceptButton);
    } catch {}
    return this;
  }

  async launchApp(context) {
    await this.page.waitForSelector(this.selectors.launchAppButton, {
      state: "visible",
      timeout: 1000,
    });

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      this.page.click(this.selectors.launchAppButton),
    ]);

    await this.page.close();
    return newPage;
  }

  async waitForLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  async connectWallet() {
    await this.page.waitForSelector(this.selectors.connectWalletButton, {
      state: "visible",
      timeout: 30000,
    });
    await this.page.click(this.selectors.connectWalletButton);

    await this.page.waitForSelector(this.selectors.walletOptionsContainer, {
      state: "visible",
      timeout: 10000,
    });
    return this;
  }

  async selectXverseWallet(context, handlePageTransition) {
    return await handlePageTransition(
      context,
      this.page,
      async () => await this.page.click(this.selectors.xverseWalletOption),
      30000,
    );
  }
  async noWalletConnection() {
    return await this.page.locator(this.selectors.noMatchWallet).textContent();
  }
}

module.exports = DucatProtocolPage;
