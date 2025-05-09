const { Transaction } = require("mongodb");
const BasePage = require("./BasePage");
const { expect } = require("allure-playwright");

class VaultCreationPage extends BasePage {
  constructor(page) {
    super(page);
    this.nameOfWallet = null;
    this.btcValueBalance = null;
    this.unitValueBalance = null;
    this.transactionNumber = null;

    (this.selectors = {
      nameInput: 'xpath=//input[@name="name"]',
      continueButton: 'xpath=//*[contains(text(), "Continue")]',
      errorMessage: '//div[@class="flex flex-col gap-2 w-full"]/div/span',
      feeErrorMessage: '//div[@class="flex flex-col gap-2 w-full"]/div/span',
      DepositBTC25: 'xpath=(//button[@type="button"])[4]',
      DepositBTC50: 'xpath=(//button[@type="button"])[5]',
      DepositBTC75: 'xpath=(//button[@type="button"])[6]',
      DepositBTC100: 'xpath=(//button[@type="button"])[7]',
      BorrowUNIT25: 'xpath=(//button[@type="button"])[9]',
      BorrowUNIT50: 'xpath=(//button[@type="button"])[10]',
      BorrowUNIT75: 'xpath=(//button[@type="button"])[11]',
      BorrowUNIT100: 'xpath=(//button[@type="button"])[12]',
      BTCValueBalance: 'xpath=(//input[@inputmode="numeric"])[1]',
      UNITValueBalance: 'xpath=(//input[@inputmode="numeric"])[2]',
      previewButton: 'xpath=//*[contains(text(), "Preview")]',
      confirmButton: 'xpath=(//*[contains(text(), "Confirm")])[2]',
      confirmAllButton: 'xpath=//*[contains(text(), "Confirm all")]',
      closeButton: 'xpath=//*[contains(text(), "Close")]',
      successMessage: '//h2[contains(text(), "Vault Successfully Created!")]',
      goToVaultButton: '//button[contains(text(), "Go to Vault")]',
      BTCActualValue:
        'xpath=(//div[@class="flex items-center gap-0.5 lg:gap-2"])[1]/span',
      goToTransactionButtontwo: "xpath=//tbody/tr[2]/td[6]/a[1]",
      amountOfBTCInBlockchain: "xpath=//tbody/tr[3]/td[2]/app-amount[1]",
      receiveButton:
        'xpath=//*[contains(text(),"mutinynet") or contains(text(),"signet")]',
      createVaultButton: 'xpath=//*[contains(text(), "Create Vault")]',
      goToTransactionButton:
        'xpath=//button[contains(text(),"Transaction Tracker")]',
      TransactionLink: 'xpath=//div[@class="flex flex-col gap-4"]/div[1]/a',
      closeButtonXverse: 'xpath=//*[contains(text(),"Close")]',
      newWalletName: "xpath=//h1/p",
      BTCValueInComfirmationPage:
        'xpath=(//div[@class="flex items-center justify-between gap-4 w-full"])[1][1]/p[2]',
      UNITValueInComfirmationPage:
        'xpath=(//div[@class="flex items-center justify-between gap-4 w-full"])[2][1]/p[2]',
    }),
      (this.selectorsOfTable = {
        DateOfLastOperation: "xpath =//tbody/tr[2]/td[1]/span",
        typeOfLastOperation: "xpath =//tbody/tr[2]/td[2]/div/div/span",
        amountOfLastOperation: "xpath =//tbody/tr[2]/td[5]/div/span[1]",
        topOfPage: 'xpath = //h6[contains(text(),"BTC Deposited in Vault")]',
      }),
      (this.selectorofTransaction = {
        transactionNumberTwo: "xpath=//li[3]/a",
        transactionNumberTwoBalance: "//tbody/tr/td[2]",
      });
  }

  async fillVaultName(name) {
    await this.page.fill(this.selectors.nameInput, name);
    this.nameOfWallet = name;
    console.log(`Saved vault name: ${this.nameOfWallet}`);
    await this.page.click(this.selectors.continueButton);
    return this;
  }

  async completeVaultCreation(depositBtc, borrowUnit) {
    await this.page.waitForTimeout(1000);
    let errorExists = await this.page
      .locator(this.selectors.feeErrorMessage)
      .filter({
        hasText: "The fees to open a vault are higher than your balance",
      })
      .isVisible()
      .catch(() => false);

    if (errorExists) {
      console.log("Fee error message detected. Waiting for it to disappear...");

      const maxWaitTime = 40000;
      const checkInterval = 1000;
      const startTime = Date.now();

      while (Date.now() - startTime < maxWaitTime) {
        errorExists = await this.page
          .locator(this.selectors.feeErrorMessage)
          .filter({
            hasText: "The fees to open a vault are higher than your balance",
          })
          .isVisible()
          .catch(() => false);

        if (!errorExists) {
          console.log(
            "Error message is no longer visible, continuing with workflow",
          );
          break;
        }

        await this.page.waitForTimeout(checkInterval);
      }

      if (errorExists) {
        console.log(
          "Error message remained visible after timeout. Will attempt to continue anyway.",
        );
      }
    }

    if (depositBtc) {
      const parsedDepositPercentage = parseInt(
        String(depositBtc).replace("%", ""),
      );
      let depositSelector;

      switch (parsedDepositPercentage) {
        case 25:
          depositSelector = this.selectors.DepositBTC25;
          break;
        case 50:
          depositSelector = this.selectors.DepositBTC50;
          break;
        case 75:
          depositSelector = this.selectors.DepositBTC75;
          break;
        case 100:
          depositSelector = this.selectors.DepositBTC100;
          break;
        default:
          console.log(
            `Invalid deposit percentage: ${depositBtc}. Defaulting to 25%.`,
          );
          depositSelector = this.selectors.DepositBTC25;
      }

      console.log(`Selecting ${depositBtc} BTC deposit`);
      await this.page.click(depositSelector);
      try {
        await this.page.waitForSelector(this.selectors.BTCValueBalance, {
          timeout: 5000,
        });
        this.btcValueBalance = await this.page.inputValue(
          this.selectors.BTCValueBalance,
        );
        console.log(`Captured BTC deposit value: ${this.btcValueBalance}`);
      } catch (error) {
        console.error("Failed to capture BTC value:", error);
      }
    }
    if (borrowUnit) {
      const parsedBorrowPercentage = parseInt(
        String(borrowUnit).replace("%", ""),
      );
      let borrowSelector;

      switch (parsedBorrowPercentage) {
        case 25:
          borrowSelector = this.selectors.BorrowUNIT25;
          break;
        case 50:
          borrowSelector = this.selectors.BorrowUNIT50;
          break;
        case 75:
          borrowSelector = this.selectors.BorrowUNIT75;
          break;
        case 100:
          borrowSelector = this.selectors.BorrowUNIT100;
          break;
        default:
          console.log(
            `Invalid borrow percentage: ${borrowUnit}. Defaulting to 25%.`,
          );
          borrowSelector = this.selectors.BorrowUNIT25;
      }

      console.log(`Selecting ${borrowUnit} UNIT borrow`);
      await this.page.click(borrowSelector);

      try {
        await this.page.waitForSelector(this.selectors.UNITValueBalance, {
          timeout: 5000,
        });
        const rawUnitValue = await this.page.inputValue(
          this.selectors.UNITValueBalance,
        );
        this.unitValueBalance = rawUnitValue.replace(/,/g, "");
        console.log(`Captured UNIT borrow value: ${this.unitValueBalance}`);
      } catch (error) {
        console.error("Failed to capture UNIT value:", error);
      }
    }
    await this.page.click(this.selectors.previewButton);
    await this.page.waitForTimeout(4000);
    try {
      await this.page.waitForSelector(
        this.selectors.BTCValueInComfirmationPage,
        { timeout: 6000 },
      );
      const btcConfirmationText = await this.page.textContent(
        this.selectors.BTCValueInComfirmationPage,
      );
      const btcNumberMatch = btcConfirmationText.match(/[\d.]+/g);
      const btcConfirmationValue = btcNumberMatch
        ? btcNumberMatch.join("")
        : null;
      const normalizedBtcConfirmation = btcConfirmationValue?.replace(/,/g, "");
      const normalizedBtcBalance = this.btcValueBalance?.replace(/,/g, "");
      console.log(`BTC confirmation value: ${normalizedBtcConfirmation}`);
      console.log(`BTC balance value: ${normalizedBtcBalance}`);

      if (normalizedBtcConfirmation === normalizedBtcBalance) {
        console.log("BTC values match between confirmation page and balance!");
      } else {
        console.warn(
          `BTC value mismatch: Confirmation shows ${normalizedBtcConfirmation}, balance is ${normalizedBtcBalance}`,
        );
      }
    } catch (error) {
      console.error(
        "Failed to validate BTC value on confirmation page:",
        error,
      );
    }
    try {
      await this.page.waitForSelector(
        this.selectors.UNITValueInComfirmationPage,
        { timeout: 5000 },
      );
      const unitConfirmationText = await this.page.textContent(
        this.selectors.UNITValueInComfirmationPage,
      );
      const unitNumberMatch = unitConfirmationText.match(/[\d.]+/g);
      const unitConfirmationValue = unitNumberMatch
        ? unitNumberMatch.join("")
        : null;
      const normalizedUnitConfirmation = unitConfirmationValue?.replace(
        /,/g,
        "",
      );
      const normalizedUnitBalance = this.unitValueBalance?.replace(/,/g, "");

      console.log(`UNIT confirmation value: ${normalizedUnitConfirmation}`);
      console.log(`UNIT balance value: ${normalizedUnitBalance}`);

      if (normalizedUnitConfirmation === normalizedUnitBalance) {
        console.log("UNIT values match between confirmation page and balance!");
      } else {
        console.warn(
          `UNIT value mismatch: Confirmation shows ${normalizedUnitConfirmation}, balance is ${normalizedUnitBalance}`,
        );
      }
    } catch (error) {
      console.error(
        "Failed to validate UNIT value on confirmation page:",
        error,
      );
    }
    await this.page.click(this.selectors.confirmButton);

    return this;
  }

  async handleConfirmation(context, handlePageTransition) {
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
        await confirmationPage.waitForSelector(
          this.selectors.confirmAllButton,
          {
            state: "visible",
            timeout: 15000,
          },
        );
        await confirmationPage.click(this.selectors.confirmAllButton);
        await confirmationPage.click(this.selectors.closeButtonXverse);
        console.log("Successfully clicked Confirm all button");
      } catch (confirmError) {
        console.error(
          "Error finding or clicking Confirm all button:",
          confirmError,
        );
      }
      try {
        await this.page.waitForSelector(this.selectors.goToTransactionButton, {
          state: "visible",
          timeout: 90000,
        });
        await this.page.click(this.selectors.goToTransactionButton);
        console.log("Clicked on Transaction Tracker button");

        await this.page.waitForSelector(this.selectors.TransactionLink, {
          state: "visible",
          timeout: 10000,
        });

        const [transactionPage] = await Promise.all([
          context.waitForEvent("page"),
          this.page.click(this.selectors.TransactionLink),
        ]);

        await transactionPage.waitForLoadState("networkidle");
        const url = transactionPage.url();
        const txMatch = url.match(/\/tx\/([a-f0-9]+)$/i);
        if (txMatch && txMatch[1]) {
          this.transactionNumber = txMatch[1];
          console.log(`Extracted transaction hash: ${this.transactionNumber}`);

          await transactionPage.waitForTimeout(6000);
          await transactionPage.goto(
            `https://ord-mutinynet.ducatprotocol.com/tx/${this.transactionNumber}`,
          );
          await transactionPage.waitForLoadState("networkidle");

          try {
            await transactionPage.waitForTimeout(5000);
            await transactionPage.click(
              this.selectorofTransaction.transactionNumberTwo,
            );
            await transactionPage.waitForTimeout(3000);

            const maxRetries = 10;
            let retryCount = 0;
            let isElementVisible = false;

            while (retryCount < maxRetries && !isElementVisible) {
              isElementVisible = await transactionPage
                .locator(this.selectorofTransaction.transactionNumberTwoBalance)
                .isVisible()
                .catch(() => false);

              if (isElementVisible) {
                console.log("Transaction balance element is now visible");
                break;
              }

              console.log(
                `Attempt ${retryCount + 1}/${maxRetries}: Element not visible yet, refreshing page...`,
              );
              await transactionPage.reload();
              await transactionPage.waitForTimeout(3000);
              retryCount++;
            }

            if (!isElementVisible) {
              console.warn(
                `Element not visible after ${maxRetries} refresh attempts`,
              );
            }

            await transactionPage.waitForSelector(
              this.selectorofTransaction.transactionNumberTwoBalance,
              {
                state: "visible",
                timeout: 10000,
              },
            );

            const amountText = await transactionPage.textContent(
              this.selectorofTransaction.transactionNumberTwoBalance,
            );
            const amountMatch = amountText.match(/(\d+\.\d+)/);
            if (amountMatch && amountMatch[1]) {
              const transactionAmount = amountMatch[1];
              console.log(`Transaction amount: ${transactionAmount}`);

              const normalizedTransactionAmount = transactionAmount.replace(
                /,/g,
                "",
              );
              const normalizedUnitBalance = this.unitValueBalance.replace(
                /,/g,
                "",
              );

              if (normalizedTransactionAmount === normalizedUnitBalance) {
                console.log("Transaction amount matches UNIT value balance!");
              } else {
                console.warn(
                  `Transaction amount (${transactionAmount}) does not match UNIT value balance (${this.unitValueBalance})`,
                );
              }
            }
          } catch (error) {
            console.error("Error accessing transaction details:", error);
          }

          await transactionPage.close();
        }
      } catch (error) {
        console.error("Error in transaction tracking flow:", error);
      }
      try {
        await this.page.click(this.selectors.closeButton);
      } catch (error) {
        console.log("Close button not found or already clicked");
      }
    }
    return this;
  }

  async waitForSuccessAndNavigate() {
    try {
      await this.page.waitForSelector(this.selectors.successMessage, {
        state: "visible",
        timeout: 60000,
      });
      await this.page.waitForSelector(this.selectors.goToVaultButton, {
        state: "visible",
        timeout: 50000,
      });
      await this.page.click(this.selectors.goToVaultButton);
      console.log('Clicked "Go to Vault" button');

      await this.page.waitForLoadState("networkidle");

      try {
        await this.page.waitForTimeout(4000);
        await this.page.waitForSelector(this.selectors.BTCActualValue, {
          state: "visible",
          timeout: 10000,
        });
        const uiBtcValue = await this.page.textContent(
          this.selectors.BTCActualValue,
        );
        const normalizedUiBtcValue = uiBtcValue.replace(/,/g, "").trim();
        console.log(`Captured UI BTC value: ${normalizedUiBtcValue}`);

        await this.page
          .locator(this.selectors.goToTransactionButtontwo)
          .scrollIntoViewIfNeeded();
        await this.page.waitForSelector(
          this.selectors.goToTransactionButtontwo,
          {
            state: "visible",
            timeout: 10000,
          },
        );

        const [blockchainPage] = await Promise.all([
          this.page.context().waitForEvent("page"),
          this.page.click(this.selectors.goToTransactionButtontwo),
        ]);

        await blockchainPage.waitForLoadState("networkidle");
        console.log("Blockchain transaction page opened");
        await blockchainPage.waitForSelector(
          this.selectors.amountOfBTCInBlockchain,
          {
            state: "visible",
            timeout: 15000,
          },
        );
        await blockchainPage
          .locator(this.selectors.amountOfBTCInBlockchain)
          .scrollIntoViewIfNeeded();
        const blockchainBtcValue = await blockchainPage.textContent(
          this.selectors.amountOfBTCInBlockchain,
        );
        const normalizedBlockchainBtcValue = blockchainBtcValue
          .replace(/,/g, "")
          .trim();
        console.log(
          `Captured blockchain BTC value: ${normalizedBlockchainBtcValue}`,
        );
        const extractNumber = (str) => {
          const noSpaces = str.replace(/\s+/g, "");
          const matches = noSpaces.match(/(\d+\.\d+)/);
          return matches ? parseFloat(matches[1]) : null;
        };

        const uiNumericValue = extractNumber(normalizedUiBtcValue);
        const blockchainNumericValue = extractNumber(
          normalizedBlockchainBtcValue,
        );

        console.log(`Numeric UI value: ${uiNumericValue}`);
        console.log(`Numeric blockchain value: ${blockchainNumericValue}`);

        if (uiNumericValue !== null && blockchainNumericValue !== null) {
          const epsilon = 0.00000001;
          const valuesMatch =
            Math.abs(uiNumericValue - blockchainNumericValue) < epsilon;

          if (valuesMatch) {
            console.log("BTC values match between UI and blockchain!");
          } else {
            console.warn(
              `BTC value mismatch: UI shows ${uiNumericValue}, blockchain shows ${blockchainNumericValue}`,
            );
            expect(valuesMatch).toBe(
              true,
              `BTC values do not match: UI (${uiNumericValue}) vs blockchain (${blockchainNumericValue})`,
            );
          }
        } else {
          console.warn(
            `Could not extract numeric values for comparison: UI (${normalizedUiBtcValue}) vs blockchain (${normalizedBlockchainBtcValue})`,
          );
          expect(true).toBe(
            false,
            "Could not extract numeric values for comparison",
          );
        }

        await blockchainPage.close();
        console.log("Closed blockchain page and returned to main tab");
      } catch (btcCompareError) {
        console.error("Error while comparing BTC values:", btcCompareError);
      }

      return true;
    } catch (error) {
      console.error(
        "Error waiting for success message or clicking Go to Vault button:",
        error,
      );
      return false;
    }
  }
  async navigateToCreateVault() {
    await this.page.waitForSelector(this.selectors.receiveButton, {
      state: "visible",
      timeout: 60000,
    });
    await this.page.click(this.selectors.receiveButton);
    await this.page.waitForTimeout(4000);
    await this.page.click(this.selectors.createVaultButton);
    return this;
  }
  async assertLastOperation(operationType) {
    try {
      try {
        const displayedWalletName = await this.page.textContent(
          this.selectors.newWalletName,
        );
        if (this.nameOfWallet && displayedWalletName) {
          console.log(
            `Validating wallet name: expected "${this.nameOfWallet}", displayed "${displayedWalletName}"`,
          );
          if (displayedWalletName.includes(this.nameOfWallet)) {
            console.log("Wallet name validation successful!");
          } else {
            console.warn(
              `Wallet name mismatch: expected "${this.nameOfWallet}", got "${displayedWalletName}"`,
            );
          }
        }
      } catch (nameError) {
        console.error("Failed to validate wallet name:", nameError);
      }
      const dateElement = await this.page.locator(
        this.selectorsOfTable.DateOfLastOperation,
      );
      await dateElement.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      console.log("Scrolled to DateOfLastOperation element");
    } catch (error) {
      console.error("Failed to scroll to DateOfLastOperation:", error);
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    }
    const displayedOperationType = await this.page.textContent(
      this.selectorsOfTable.typeOfLastOperation,
    );
    const displayedDate = await this.page.textContent(
      this.selectorsOfTable.DateOfLastOperation,
    );
    const displayedAmount = await this.page.textContent(
      this.selectorsOfTable.amountOfLastOperation,
    );
    let expectedTypeText;
    switch (operationType.toLowerCase()) {
      case "borrow":
        expectedTypeText = "borrow UNIT";
        break;
      case "withdrawal":
        expectedTypeText = "withdraw BTC";
        break;
      case "deposit":
        expectedTypeText = "deposit BTC";
        break;
      case "repay":
        expectedTypeText = "repay UNIT" || "Repay UNIT";
        break;
      default:
        expectedTypeText = operationType;
    }
    if (!displayedOperationType.includes(expectedTypeText)) {
      throw new Error(
        `Operation type mismatch: expected "${expectedTypeText}", got "${displayedOperationType}"`,
      );
    }
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("en-US", { month: "short" });
    const year = today.getFullYear();
    const expectedDateFormat = `${day} ${month} ${year}`;

    console.log(
      `Checking date: expected format "${expectedDateFormat}", got "${displayedDate}"`,
    );
    if (!displayedDate.includes(expectedDateFormat)) {
      throw new Error(
        `Date format mismatch: expected to include "${expectedDateFormat}", got "${displayedDate}"`,
      );
    }
    console.log(
      `Checking amount: expected to include "$", got "${displayedAmount}"`,
    );
    if (!displayedAmount.includes("$")) {
      throw new Error(
        `Amount format mismatch: expected to include "$", got "${displayedAmount}"`,
      );
    }
    try {
      const topElement = await this.page.locator(
        this.selectorsOfTable.topOfPage,
      );
      await topElement.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      console.log("Scrolled back to the top of the page");
    } catch (error) {
      console.error("Failed to scroll to top of page:", error);
      await this.page.evaluate(() => {
        window.scrollTo(0, 0);
      });
    }

    return true;
  }
}

module.exports = VaultCreationPage;
