# create a wallet
# open
# deposit
# withdraw
# borrow
# repay
# full repay
# deposit
# withdraw
# borrow
# full borrow
# full repay
# full withdraw

# 12m41.069s
Feature: Create new vaults with different deposit, borrow, withdrawal and repay

  Scenario:  Full wallet flow case number one

  #1- create wallet
   Given I have opened the Xverse extension
    When I create a new wallet with password
    When I connect my wallet in the first time
    Then the error network selection do not match

    #2- open wallet
    And I configure the network in Xverse
    And I reconnect to Ducat Protocol

    # #3- deposit here we can change the percentage between [0, 25, 50, 75, 100]
     Then I should be able to create a new vault with "25%" of Deposit OTC and "100%" of Borrow UNIT

    #  #4-withdrawal
    # Given user is on the vault page for withdrawal
    # When user needs to create withdrawal "25%"
    # And user confirms withdrawal
    # Then the withdrawal should be completed
    # And the balance should be decreased
    # Then I should see the last operation of type "withdrawal" with date of today and amount has $

    # #5-borrow
    # Given user is on the vault page for borrow
    # When user initiates a borrow "25%"
    # And user confirms borrow
    # Then the borrow should be completed
    # And the balance should be increased after borrow
    # Then I should see the last operation of type "borrow" with date of today and amount has $

    # #6-repay
    # Given user is on the vault page for repay
    # When user initiates a repay "25%"
    # And user confirms repay
    # Then the repay should be completed
    # And the balance should be decreased after repay

    # #7-full repay
    # Given user is on the vault page for repay
    # When user initiates a repay "100%"
    # And user confirms repay
    # Then the repay should be completed
    # And the balance should be decreased after repay
    # Then I should see the last operation of type "repay" with date of today and amount has $

    # #8-deposit
    #  Given user is on the vault page
    # When i need to deposit "50%"
    # And user confirms deposit
    # Then the deposit should be completed
    # And the balance should be increased
    # Then I should see the last operation of type "deposit" with date of today and amount has $

    # #9-WITHDRAWL AGAIN 
    # Given user is on the vault page for withdrawal
    # When user needs to create withdrawal "50%"
    # And user confirms withdrawal
    # Then the withdrawal should be completed
    # And the balance should be decreased
    # Then I should see the last operation of type "withdrawal" with date of today and amount has $

    # #10-borrow AGAIN
    # Given user is on the vault page for borrow
    # When user initiates a borrow "50%"
    # And user confirms borrow
    # Then the borrow should be completed
    # And the balance should be increased after borrow
    # Then I should see the last operation of type "borrow" with date of today and amount has $

    # #11-full borrow
    # Given user is on the vault page for borrow
    # When user initiates a borrow "100%"
    # And user confirms borrow
    # Then the borrow should be completed
    # And the balance should be increased after borrow
    # Then I should see the last operation of type "borrow" with date of today and amount has $

    # #12-full repay  Given user is on the vault page for repay
    # When user initiates a repay "100%"
    # And user confirms repay
    # Then the repay should be completed
    # And the balance should be decreased after repay
    # Then I should see the last operation of type "repay" with date of today and amount has $

    # #13-full withdraw
    # Given user is on the vault page for withdrawal
    # When user needs to create withdrawal "100%"
    # And user confirms withdrawal
    # Then the withdrawal should be completed
    # And the balance should be decreased
    # Then I should see the last operation of type "withdrawal" with date of today and amount has $
