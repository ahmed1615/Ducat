Feature: Create new vaults with different deposit and borrow combinations

  Background:
    Given I have opened the Xverse extension
    When I create a new wallet with password
    And I navigate to Ducat Protocol app
    When I connect my wallet in the first time
    Then the error network selection do not match
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol

  Scenario: Create vault with 25% Deposit OTC and 25% Borrow UNIT
    Then I should be able to create a new vault with "25%" of Deposit OTC and "25%" of Borrow UNIT

  Scenario: Create vault with 25% Deposit OTC and 50% Borrow UNIT
    Then I should be able to create a new vault with "25%" of Deposit OTC and "50%" of Borrow UNIT

  Scenario: Create vault with 25% Deposit OTC and 75% Borrow UNIT
    Then I should be able to create a new vault with "25%" of Deposit OTC and "75%" of Borrow UNIT

  Scenario: Create vault with 25% Deposit OTC and 100% Borrow UNIT
    Then I should be able to create a new vault with "25%" of Deposit OTC and "100%" of Borrow UNIT

  Scenario: Create vault with 50% Deposit OTC and 25% Borrow UNIT
    Then I should be able to create a new vault with "50%" of Deposit OTC and "25%" of Borrow UNIT

  Scenario: Create vault with 50% Deposit OTC and 50% Borrow UNIT
    Then I should be able to create a new vault with "50%" of Deposit OTC and "50%" of Borrow UNIT

  Scenario: Create vault with 50% Deposit OTC and 75% Borrow UNIT
    Then I should be able to create a new vault with "50%" of Deposit OTC and "75%" of Borrow UNIT

  Scenario: Create vault with 50% Deposit OTC and 100% Borrow UNIT
    Then I should be able to create a new vault with "50%" of Deposit OTC and "100%" of Borrow UNIT

  Scenario: Create vault with 75% Deposit OTC and 25% Borrow UNIT
    Then I should be able to create a new vault with "75%" of Deposit OTC and "25%" of Borrow UNIT

  Scenario: Create vault with 75% Deposit OTC and 50% Borrow UNIT
    Then I should be able to create a new vault with "75%" of Deposit OTC and "50%" of Borrow UNIT

  Scenario: Create vault with 75% Deposit OTC and 75% Borrow UNIT
    Then I should be able to create a new vault with "75%" of Deposit OTC and "75%" of Borrow UNIT

  Scenario: Create vault with 75% Deposit OTC and 100% Borrow UNIT
    Then I should be able to create a new vault with "75%" of Deposit OTC and "100%" of Borrow UNIT

