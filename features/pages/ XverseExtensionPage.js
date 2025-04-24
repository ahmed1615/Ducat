const BasePage = require("./BasePage");
const dotenv = require("dotenv");

dotenv.config();

class XverseExtensionPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = "chrome-extension://idnnbdplmphpflfnlkomgpfbpcgelopg/popup.html";

    this.selectors = {
      autcheck: 'xpath=//label=[@role="checkbox"]',
      forgotPasswordLink:
        'xpath=//*[contains(text(), "Forgot your password?")]',
      backedUpCheckbox: "#backed-up-seedphrase-checkbox",
      resetButton: 'xpath=//*[contains(text(), "Reset")]',
      createNewWalletButton:
        'xpath=//*[contains(text(), "Create a new wallet")]',
      acceptButton: 'xpath=//*[contains(text(), "Accept")]',
      acceptRaro: "sc-ikkxIA hhLeUO.primary",
      backupLaterButton: 'xpath=//*[contains(text(), "Backup later")]',
      passwordInput: 'input[type="password"]',
      confirmPasswordInput: "#confirm-password-input",
      continueButton: 'text="Continue"',
      settingsButton: 'button[data-testid="nav-settings"]',
      networkButton: 'xpath=//*[contains(text(), "Network")]',
      signetButton: 'xpath=//*[contains(text(), "Signet")]',
      btcUrlInput: 'xpath=//input[@data-testid="BTC URL"]',
      saveButton: 'xpath=//*[contains(text(), "Save")]',
      sendButton: 'xpath=(//button[@class="sc-cXPBUD cLHChp"])[1]',
      receiveButton: 'xpath=(//button[@class="sc-cXPBUD cLHChp"])[2]',
      threeDotsHeaderoption:
        'xpath=//button[@aria-label="Open Header Options"]',
      lockButton: 'xpath=//*[contains(text(), "Lock")]',
      CloseThisTab: 'xpath=//*[contains(text(), "Close this tab"]',
    };
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  async createWallet() {
    const password = process.env.PASSWORD;
    try {
      // Initial page state detection
      console.log("Starting wallet creation flow");

      const forgetButtonVisible = await this.page
        .waitForSelector(this.selectors.forgotPasswordLink, {
          state: "visible",
          timeout: 5000,
        })
        .then(() => true)
        .catch(() => false);

      const threeDotsVisible = await this.page
        .waitForSelector(this.selectors.threeDotsHeaderoption, {
          state: "visible",
          timeout: 5000,
        })
        .then(() => true)
        .catch(() => false);

      if (threeDotsVisible) {
        console.log("Three dots menu visible - handling existing wallet flow");
        await this.page.click(this.selectors.threeDotsHeaderoption);

        const lockbuttonisvisible = await this.page
          .waitForSelector(this.selectors.lockButton, {
            state: "visible",
            timeout: 9000,
          })
          .then(() => true)
          .catch(() => false);

        if (lockbuttonisvisible) {
          console.log("Lock button is visible, clicking it");
          await this.page.hover(this.selectors.lockButton);
          await this.page.click(this.selectors.lockButton);
          await this.page.click(this.selectors.forgotPasswordLink);
          await this.page.click(this.selectors.backedUpCheckbox);

          console.log(
            "About to click reset button - preparing for page context change",
          );
          await this.page.click(this.selectors.resetButton);
          await this.page.waitForTimeout(10000);

          try {
            console.log("Re-establishing connection after reset");
            await this.goto();
            await this.page.waitForLoadState("networkidle", { timeout: 20000 });
            console.log("Successfully reconnected to extension after reset");

            const createWalletButtonVisible = await this.page
              .waitForSelector(this.selectors.createNewWalletButton, {
                state: "visible",
                timeout: 15000,
              })
              .then(() => true)
              .catch(() => false);

            if (createWalletButtonVisible) {
              console.log("Create wallet button found after reset");
              await this.page.click(this.selectors.createNewWalletButton);

              await this.page
                .waitForLoadState("networkidle", { timeout: 10000 })
                .catch(() => {
                  console.log("Network idle wait timed out, continuing anyway");
                });
              await this.page.waitForTimeout(3000);

              console.log("Looking for accept button across available tabs");
              let acceptButtonFound = false;

              const acceptButtonVisible = await this.page
                .waitForSelector(this.selectors.acceptButton, {
                  state: "visible",
                  timeout: 5000,
                })
                .then(() => true)
                .catch(() => false);

              if (acceptButtonVisible) {
                console.log("Accept button found in current tab");
                acceptButtonFound = true;
                await this.page.click(this.selectors.acceptButton);
              } else {
                console.log(
                  "Accept button not found in current tab, checking other contexts",
                );

                try {
                  const context = this.page.context();
                  const pages = context.pages();
                  console.log(`Found ${pages.length} pages in current context`);

                  for (let i = 0; i < pages.length; i++) {
                    const currentPage = pages[i];
                    if (currentPage !== this.page) {
                      console.log(`Checking page ${i + 1} for accept button`);

                      const buttonInOtherPage = await currentPage
                        .waitForSelector(this.selectors.acceptButton, {
                          state: "visible",
                          timeout: 3000,
                        })
                        .then(() => true)
                        .catch(() => false);

                      if (buttonInOtherPage) {
                        console.log(`Accept button found in page ${i + 1}`);
                        await currentPage.click(this.selectors.acceptButton);
                        this.page = currentPage;
                        acceptButtonFound = true;
                        break;
                      }
                    }
                  }
                } catch (tabError) {
                  console.log(
                    "Error while checking other tabs:",
                    tabError.message,
                  );
                }
              }

              if (acceptButtonFound) {
                console.log("Accept button was found and clicked");

                const backupLaterVisible = await this.page
                  .waitForSelector(this.selectors.backupLaterButton, {
                    state: "visible",
                    timeout: 10000,
                  })
                  .then(() => true)
                  .catch(() => false);

                if (backupLaterVisible) {
                  console.log("Backup later button found");
                  await this.page.click(this.selectors.backupLaterButton);
                  console.log("Filling password fields");
                  await this.page.fill(this.selectors.passwordInput, password);
                  await this.page.fill(
                    this.selectors.confirmPasswordInput,
                    password,
                  );
                  await this.page.click(this.selectors.continueButton);
                } else {
                  console.log("Backup later button not found");
                }
              } else {
                console.log(
                  "Accept button not found after clicking create wallet",
                );
              }
            } else {
              console.log("Create wallet button not found after reset");
            }
          } catch (navigationError) {
            console.log("Error after reset:", navigationError.message);
          }
        } else {
          console.log("Lock button not visible in three dots menu");
        }
      } else if (forgetButtonVisible && !threeDotsVisible) {
        console.log("Forget button visible - handling locked wallet flow");
        await this.page.click(this.selectors.forgotPasswordLink);
        await this.page.click(this.selectors.backedUpCheckbox);

        console.log(
          "About to click reset button - preparing for page context change",
        );
        await this.page.click(this.selectors.resetButton);
        await this.page.waitForTimeout(10000);

        try {
          console.log("Re-establishing connection after reset");
          await this.goto();
          await this.page.waitForLoadState("networkidle", { timeout: 20000 });
          console.log("Successfully reconnected to extension after reset");
          const createWalletButtonVisible = await this.page
            .waitForSelector(this.selectors.createNewWalletButton, {
              state: "visible",
              timeout: 15000,
            })
            .then(() => true)
            .catch(() => false);

          if (createWalletButtonVisible) {
            console.log("Create wallet button found after reset");
            await this.page.click(this.selectors.createNewWalletButton);
            await this.page
              .waitForLoadState("networkidle", { timeout: 10000 })
              .catch(() => {
                console.log("Network idle wait timed out, continuing anyway");
              });
            await this.page.waitForTimeout(3000);
            const acceptButtonVisible = await this.page
              .waitForSelector(this.selectors.acceptButton, {
                state: "visible",
                timeout: 10000,
              })
              .then(() => true)
              .catch(() => false);

            if (acceptButtonVisible) {
              console.log("Accept button found after reset");
              await this.page.click(this.selectors.acceptButton);
              const backupLaterVisible = await this.page
                .waitForSelector(this.selectors.backupLaterButton, {
                  state: "visible",
                  timeout: 10000,
                })
                .then(() => true)
                .catch(() => false);

              if (backupLaterVisible) {
                console.log("Backup later button found");
                await this.page.click(this.selectors.backupLaterButton);
                console.log("Filling password fields");
                await this.page.fill(this.selectors.passwordInput, password);
                await this.page.fill(
                  this.selectors.confirmPasswordInput,
                  password,
                );
                await this.page.click(this.selectors.continueButton);
              }
            }
          }
        } catch (navigationError) {
          console.log("Error after reset:", navigationError.message);
        }
      } else if (!forgetButtonVisible && !threeDotsVisible) {
        console.log("Fresh install flow - creating new wallet");
        try {
          await this.page.click(this.selectors.createNewWalletButton);

          // Wait for UI to stabilize
          await this.page
            .waitForLoadState("networkidle", { timeout: 10000 })
            .catch(() => {
              console.log("Network idle wait timed out, continuing anyway");
            });
          await this.page.waitForTimeout(3000);

          // Check for accept button
          const acceptButtonVisible = await this.page
            .waitForSelector(this.selectors.acceptButton, {
              state: "visible",
              timeout: 10000,
            })
            .then(() => true)
            .catch(() => false);

          if (acceptButtonVisible) {
            console.log("Accept button found");
            await this.page.click(this.selectors.acceptButton);
          }

          // Look for backup later button
          const backupLaterVisible = await this.page
            .waitForSelector(this.selectors.backupLaterButton, {
              state: "visible",
              timeout: 10000,
            })
            .then(() => true)
            .catch(() => false);

          if (backupLaterVisible) {
            console.log("Backup later button found");
            await this.page.click(this.selectors.backupLaterButton);

            // Fill in password fields
            console.log("Filling password fields");
            await this.page.fill(this.selectors.passwordInput, password);
            await this.page.fill(this.selectors.confirmPasswordInput, password);
            await this.page.click(this.selectors.continueButton);
          }
        } catch (error) {
          console.log("Error in fresh install flow:", error.message);
          await this.goto(); // Try to recover
        }
      }
      try {
        const finalAcceptButtonVisible = await this.page
          .waitForSelector(this.selectors.acceptButton, {
            state: "visible",
            timeout: 5000,
          })
          .then(() => true)
          .catch(() => false);

        if (finalAcceptButtonVisible) {
          console.log("Final accept button found, clicking it");
          await this.page.click(this.selectors.acceptButton);
        }
      } catch (error) {
        console.log("No final accept button found");
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
    await this.page.waitForSelector(this.selectors.btcUrlInput, {
      state: "visible",
      timeout: 10000,
    });
    await this.page.fill(this.selectors.btcUrlInput, process.env.BTC_API_URL);
    await this.page.click(this.selectors.saveButton);
    return this;
  }
}

module.exports = XverseExtensionPage;
