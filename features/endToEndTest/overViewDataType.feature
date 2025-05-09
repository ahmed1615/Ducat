 Feature: overView page testing
  Scenario: rangeTime testing and data , type of vaults
    When user navigates to Ducat Protocol application
    When user clicks on Overview tab
    Then total BTC Ducat Valuts is orange
    And time range cycles through different values and percentage updates accordingly
    And transaction table headers are visible
