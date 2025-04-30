const { setDefaultTimeout } = require("@cucumber/cucumber");

setDefaultTimeout(1500000);

const { setWorldConstructor } = require("@cucumber/cucumber");
const { chromium } = require("playwright");

class gonfic {
  async openBrowser() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async closeBrowser() {
    await this.browser.close();
  }
}

setWorldConstructor(gonfic);

module.exports = {
  default: {
    require: [
      "features/StepDefinitions/**/*.js",
      "features/cucumberSupport/hooks.js",
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
    format: ["@cucumber/pretty-formatter", "json:reports/cucumber_report.json"],
    paths: ["features/**/*.feature"],
    publishQuiet: true,
  },
};
