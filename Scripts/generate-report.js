const cucumberHtmlReporter = require("cucumber-html-reporter");
const fs = require("fs");
const path = require("path");

const jsonFilePath = path.join(__dirname, "../reports/cucumber_report.json");
const htmlFilePath = path.join(__dirname, "../reports/cucumber_report.html");

function logScenarioDurations() {
  const rawData = fs.readFileSync(jsonFilePath, "utf8");
  const cucumberData = JSON.parse(rawData);

  let grandTotalDuration = 0;

  cucumberData.forEach((feature) => {
    feature.elements?.forEach((scenario) => {
      scenario.steps?.forEach((step) => {
        if (step.result?.duration) {
          grandTotalDuration += step.result.duration;
        }
      });
    });
  });

  const totalDurationInSec = (grandTotalDuration / 1e9).toFixed(2);
  console.log(
    `\n🕒 Total Execution Time for Report: ${totalDurationInSec} seconds`,
  );
  return `${totalDurationInSec} seconds`;
}

function ensureValidJsonFile() {
  try {
    const reportsDir = path.dirname(jsonFilePath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log(`Created reports directory at: ${reportsDir}`);
    }

    let needsDefault = false;
    if (!fs.existsSync(jsonFilePath)) {
      console.log("JSON report file does not exist.");
      needsDefault = true;
    } else {
      const content = fs.readFileSync(jsonFilePath, "utf8").trim();
      if (!content || content === "[]") {
        console.log("JSON report file is empty or invalid.");
        needsDefault = true;
      }
    }

    if (needsDefault) {
      const defaultReport = [
        {
          id: "empty-feature",
          uri: "features/empty.feature",
          keyword: "Feature",
          name: "No tests were executed",
          description:
            "No test results were found. Please check your test execution.",
          line: 1,
          elements: [
            {
              id: "empty-feature;empty-scenario",
              keyword: "Scenario",
              name: "No scenario executed",
              description: "",
              line: 2,
              type: "scenario",
              steps: [],
            },
          ],
        },
      ];
      fs.writeFileSync(jsonFilePath, JSON.stringify(defaultReport, null, 2));
      console.log(`Created default JSON report at: ${jsonFilePath}`);
    }
    return true;
  } catch (error) {
    console.error("Error ensuring valid JSON file:", error);
    return false;
  }
}

const options = {
  theme: "bootstrap",
  jsonFile: jsonFilePath,
  output: htmlFilePath,
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    "App Version": "7.2.1",
    "Test Environment": "Development",
    Browser: "chrome",
    Platform: "Ducat",
    Parallel: "Scenarios",
    Executed: "from local",
  },
};

async function cleanupAndGenerateReport() {
  try {
    if (!ensureValidJsonFile()) {
      console.error(
        "Failed to ensure valid JSON file. Report generation aborted.",
      );
      process.exit(1);
    }

    const totalTime = logScenarioDurations();

    // Inject total duration into metadata
    options.metadata["Total Duration"] = totalTime;

    console.log(`Generating HTML report from ${jsonFilePath}`);
    await cucumberHtmlReporter.generate(options);
    console.log(`HTML report generated successfully at: ${htmlFilePath}`);
  } catch (err) {
    console.error("Error during report generation:", err);
    process.exit(1);
  }
  process.exit(0);
}

// Call the function
logScenarioDurations();
cleanupAndGenerateReport();
