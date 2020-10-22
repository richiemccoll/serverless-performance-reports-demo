/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const chromium = require("chrome-aws-lambda");
const lighthouse = require("lighthouse");
const reportGenerator = require("lighthouse/lighthouse-core/report/report-generator");
const lighthouseConfig = require("./lighthouse.config");
const createStorageClient  = require('./storage');

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

async function writeReportToStorage(report) {
  const storageClient = createStorageClient();
  const result = await storageClient.write(report);
  return result;
}

exports.handler = async () => {
  const report = await generateLighthouseReport(url);

  await writeReportToStorage(report);
  return {
    status: 200,
    message: "Report generated!",
  };
};
