Feature: create the first Withdrawal

  Scenario: withdrawal from the vault
    Given I have opened the Xverse extension
    When I create a new wallet with password
    And I navigate to Ducat Protocol app
    When I connect my wallet in the first time
    Then the error network selection do not match
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol
    Then I should be able to create a new vault
    Given user is on the vault page for withdrawal
    When user needs to create withdrawal
    When user confirms withdrawal
    Then the withdrawal should be completed
    And the balance should be decreased
