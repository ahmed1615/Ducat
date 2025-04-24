Feature: Advanced Vault Management in Ducat Protocol

  Scenario: Deposit funds into an existing vault
    Given I have opened the Xverse extension
    When I create a new wallet with password
    And I navigate to Ducat Protocol app
    When I connect my wallet in the first time
    Then the error network selection do not match
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol
    Then I should be able to create a new vault
    Given user is on the vault page
    When i need to deposit
    And user confirms deposit
    Then the deposit should be completed
    And the balance should be increased

    