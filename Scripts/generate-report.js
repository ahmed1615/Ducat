const cucumberHtmlReporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: path.join(__dirname, '../reports/cucumber_report.json'),
  output: path.join(__dirname, '../reports/cucumber_report.html'),
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    'App Version': '7.2.1',
    'Test Environment': 'Development',
    'Browser': 'API, chrome',
    'Platform': 'Windows, mac and mob',
    'Parallel': 'Scenarios',
    'Executed': 'from local or pipeline'
  }
};

async function cleanupAndGenerateReport() {
  try {
    await cucumberHtmlReporter.generate(options);
    console.log('HTML report generated successfully.');
  } catch (err) {
    console.error('Error during cleanup or report generation:', err);
  }
  process.exit(0);
}

// Call the combined function to generate report and perform cleanup
cleanupAndGenerateReport();
