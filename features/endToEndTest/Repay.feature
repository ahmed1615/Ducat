Feature: Repay scenarios

  Background:
    Given I have opened the Xverse extension
    When I create a new wallet with password
    And I navigate to Ducat Protocol app
    When I connect my wallet in the first time
    Then the error network selection do not match
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol
    Then I should be able to create a new vault with "50%" of Deposit OTC and "50%" of Borrow UNIT

  Scenario: Make a repay with 25% and check balance
    Given user is on the vault page for repay
    When user initiates a repay "25%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay

  Scenario: Make a repay with 50% and check balance
    Given user is on the vault page for repay
    When user initiates a repay "50%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay

  Scenario: Make a repay with 75% and check balance
    Given user is on the vault page for repay
    When user initiates a repay "75%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay

  Scenario: Make a repay with 100% and check balance
    Given user is on the vault page for repay
    When user initiates a repay "100%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay

  Scenario: create multiple repays sequentially
    Given user is on the vault page for repay
    When user initiates a repay "100%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay
    
    Given user is on the vault page for repay
    When user initiates a repay "25%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay
    
    Given user is on the vault page for repay
    When user initiates a repay "50%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay
    
    Given user is on the vault page for repay
    When user initiates a repay "75%"
    And user confirms repay
    Then the repay should be completed
    And the balance should be decreased after repay