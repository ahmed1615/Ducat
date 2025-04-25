Feature: Create withdrawal scenarios

  Background:
    Given I have opened the Xverse extension
    When I create a new wallet with password
    And I navigate to Ducat Protocol app
    When I connect my wallet in the first time
    Then the error network selection do not match
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol
    Then I should be able to create a new vault with "50%" of Deposit OTC and "50%" of Borrow UNIT

  Scenario: Make a withdrawal with 25% and check balance
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "25%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased

  Scenario: Make a withdrawal with 50% and check balance
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "50%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased

  Scenario: Make a withdrawal with 75% and check balance
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "75%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased

  Scenario: Make a withdrawal with 100% and check balance
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "100%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased

  Scenario: create multiple withdrawals sequentially
    
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "25%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased
    
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "50%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased
    
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "75%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased

    Given user is on the vault page for withdrawal
    When user needs to create withdrawal "100%"
    And user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased
    #here we need to verify the borrow balance