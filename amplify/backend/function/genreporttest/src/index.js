/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const lighthouse = require("lighthouse");
const reportGenerator = require("lighthouse/lighthouse-core/report/report-generator");
const lighthouseConfig = require("./lighthouse.config");

const url = "https://richiemccoll.com";

async function generateLighthouseReport(url) {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const { lhr } = await lighthouse(
    url,
    {
      port: new URL(browser.wsEndpoint()).port,
      output: "json",
      logLevel: "info",
    },
    lighthouseConfig
  );
  const report = reportGenerator.generateReport(lhr, "json");
  await browser.close();
  return report;
}

exports.handler = async () => {
  const report = await generateLighthouseReport(url);

  // TODO - Store this report in S3?
  fs.writeFileSync("report.json", report);
  return {
    status: 200,
    message: "Report generated!",
  };
};
