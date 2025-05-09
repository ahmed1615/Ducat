Feature: overView page testing

  Scenario: Overview page testing
    When user navigates to Ducat Protocol application
    When user clicks on Overview tab
    Then total BTC Ducat Valuts is orange
    When user clicks on totalUnit tab
    Then total UNIT is orange
    When user clicks on collateralization ratio tab
    Then collateralization ratio is orange
    When user clicks on active vaults tab
    Then active vaults is orange
    And all overview options are visible
