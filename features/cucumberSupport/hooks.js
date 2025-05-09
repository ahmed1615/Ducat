const { Before, After } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

let browser;
let currentFeature;

async function ensureChromeRunning() {
  console.log("Ensuring Chrome is running with remote debugging...");

  try {
    const { stdout } = await execAsync("lsof -i :9222");
    if (stdout.includes("Google")) {
      console.log("Chrome is already running with remote debugging");
      return true;
    }
  } catch (e) {
    console.log("Chrome not running with debugging, starting it...");
    try {
      await execAsync(
        'open -a "Google Chrome" --args --remote-debugging-port=9222 --disable-features=IsolateOrigins,site-per-process',
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    } catch (startError) {
      console.error("Failed to start Chrome:", startError);
      return false;
    }
  }
  return true;
}

Before({ timeout: 60000 }, async function (scenario) {
  let featurePath;
  if (scenario && scenario.sourceLocation) {
    featurePath = scenario.sourceLocation.uri;
  } else if (scenario && scenario.uri) {
    featurePath = scenario.uri;
  } else if (
    scenario &&
    scenario.gherkinDocument &&
    scenario.gherkinDocument.uri
  ) {
    featurePath = scenario.gherkinDocument.uri;
  } else {
    featurePath = `unknown-feature-${Date.now()}`;
    console.warn("Could not determine feature path from scenario object");
  }

  currentFeature = featurePath;

  try {
    const chromeRunning = await ensureChromeRunning();
    if (!chromeRunning) {
      throw new Error(
        "Failed to ensure Chrome is running with remote debugging",
      );
    }

    if (!browser) {
      console.log("Connecting to Chrome with remote debugging...");
      browser = await chromium.connectOverCDP("http://localhost:9222");
      console.log("Successfully connected to Chrome browser");
    }

    console.log("Closing all existing tabs...");
    const contexts = browser.contexts();
    let lastPage = null;

    let totalPages = 0;
    for (const ctx of contexts) {
      totalPages += ctx.pages().length;
    }
    console.log(
      `Found ${totalPages} existing tabs across ${contexts.length} contexts`,
    );

    for (const ctx of contexts) {
      const pages = ctx.pages();

      for (let i = 0; i < pages.length - (contexts.length === 1 ? 1 : 0); i++) {
        try {
          console.log(`Closing tab ${i + 1}/${pages.length}`);
          await pages[i].close();
        } catch (e) {
          console.log(`Error closing tab ${i + 1}:`, e.message);
        }
      }

      if (pages.length > 0 && contexts.length === 1) {
        lastPage = pages[pages.length - 1];
      }
    }

    const mainContext =
      contexts.length > 0 ? contexts[0] : await browser.newContext();

    let page;
    if (lastPage) {
      console.log("Using the remaining tab");
      page = lastPage;
      await page.goto("about:blank");
    } else {
      console.log("Creating a new tab");
      page = await mainContext.newPage();
    }

    this.browser = browser;
    this.context = mainContext;
    this.page = page;
  } catch (error) {
    console.error("Error setting up browser:", error);
    throw new Error(`Failed to connect to Chrome browser: ${error.message}`);
  }
});

After(async function (scenario) {
  if (this.page) {
    try {
      await this.page.close();
    } catch (e) {
      console.log("Error closing page:", e);
    }
  }
});
