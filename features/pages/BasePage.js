class BasePage {
  constructor(page) {
    this.page = page;
  }

  async waitForTimeout(ms) {
    return this.page.waitForTimeout(ms);
  }

  async screenshot(name) {
    return this.page.screenshot({ path: `${name}-${Date.now()}.png` });
  }
}

module.exports = BasePage;
