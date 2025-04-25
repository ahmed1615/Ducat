Feature: Create deposit scenarios

  Background:
    Given I have opened the Xverse extension
    When I create a new wallet with password
    And I navigate to Ducat Protocol app
    When I connect my wallet in the first time
    Then the error network selection do not match
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol
    Then I should be able to create a new vault with "50%" of Deposit OTC and "50%" of Borrow UNIT

  Scenario: Make a deposit with 25% and check balance
    Given user is on the vault page
    When i need to deposit "25%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased

  Scenario: Make a deposit with 50% and check balance
    Given user is on the vault page
    When i need to deposit "50%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased

  Scenario: Make a deposit with 75% and check balance
    Given user is on the vault page
    When i need to deposit "75%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased

  Scenario: Make a deposit with 100% and check balance
    Given user is on the vault page
    When i need to deposit "100%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased

  Scenario: create multiple deposits sequentially
    Given user is on the vault page
    When i need to deposit "100%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased
    
    Given user is on the vault page
    When i need to deposit "25%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased
    
    Given user is on the vault page
    When i need to deposit "50%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased
    
    Given user is on the vault page
    When i need to deposit "75%"
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased