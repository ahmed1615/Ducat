Feature: Create new vaults with different deposit and borrow combinations
  Background:
      Given I have opened the Xverse extension
    When I create a new wallet with password
    When I connect my wallet in the first time
    Then the error network selection do not match

    #2- open wallet
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol

  #create a wallet, open, full amount for deposit, partial amount for borrow 25%
  Scenario: Create vault with 100% Deposit OTC and 25% Borrow UNIT
    Then I should be able to create a new vault with "100%" of Deposit OTC and "25%" of Borrow UNIT
  
  #create a wallet, open, full amount for deposit, partial amount for borrow 50%
  Scenario: Create vault with 100% Deposit OTC and 50% Borrow UNIT
    Then I should be able to create a new vault with "100%" of Deposit OTC and "50%" of Borrow UNIT

  #create a wallet, open, full amount for deposit, partial amount for borrow 75%
  Scenario: Create vault with 100% Deposit OTC and 75% Borrow UNIT
    Then I should be able to create a new vault with "100%" of Deposit OTC and "75%" of Borrow UNIT

  #create a wallet, open, full amount for deposit, partial amount for borrow 100%
  Scenario: Create vault with 100% Deposit OTC and 100% Borrow UNIT
    Then I should be able to create a new vault with "100%" of Deposit OTC and "100%" of Borrow UNIT
