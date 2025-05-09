Feature: Borrow scenarios

  Background:
      Given I have opened the Xverse extension
    When I create a new wallet with password
    When I connect my wallet in the first time
    Then the error network selection do not match

    #2- open wallet
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol

    # #3- deposit here we can change the percentage between [0, 25, 50, 75, 100]
     Then I should be able to create a new vault with "50%" of Deposit OTC and "50%" of Borrow UNIT
     
  Scenario: Make a borrow with 25% and check balance
    Given user is on the vault page for borrow
    When user initiates a borrow "25%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow

  Scenario: Make a borrow with 50% and check balance
    Given user is on the vault page for borrow
    When user initiates a borrow "50%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow

  Scenario: Make a borrow with 75% and check balance
    Given user is on the vault page for borrow
    When user initiates a borrow "75%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow

  Scenario: Make a borrow with 100% and check balance
    Given user is on the vault page for borrow
    When user initiates a borrow "100%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow

  Scenario: create multiple borrows sequentially
    Given user is on the vault page for borrow
    When user initiates a borrow "100%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow
    
    Given user is on the vault page for borrow
    When user initiates a borrow "25%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow
    
    Given user is on the vault page for borrow
    When user initiates a borrow "50%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow
    
    Given user is on the vault page for borrow
    When user initiates a borrow "75%"
    And user confirms borrow
    Then the borrow should be completed
    And the balance should be increased after borrow