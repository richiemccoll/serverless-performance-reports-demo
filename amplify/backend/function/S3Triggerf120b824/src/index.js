const createNotificationClient = require("./notification");
const Email = require("./email");

const REPORT_URL = "http://google.co.uk";
const DOMAIN = "https://richiemccoll.com";
const EMAIL_SENDER = "richiemccoll92@gmail.com";
const EMAIL_RECIPIENT = "richie.mccoll@hotmail.co.uk";

// eslint-disable-next-line
exports.handler = async function (event, context) {
  console.log("Received S3 event:", JSON.stringify(event, null, 2));
  const [record] = event.Records;
  const payload = record.s3.object.key;
  const email = new Email({
    message: `New performance report for ${DOMAIN} available <a href="${REPORT_URL}?${payload.replace(
      ".json",
      ""
    )}">here</a>`,
    subject: `Lighthouse Performance Report for ${DOMAIN}`,
    recipient: EMAIL_RECIPIENT,
    sender: EMAIL_SENDER,
  });

  const notificationClient = createNotificationClient();
  await notificationClient.send(email.config);
  context.done(null, "Success");
};
