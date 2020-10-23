
const AWS = require("aws-sdk");

AWS.config.update({ region: 'us-west-2' });

class Notification {
  constructor() {
    this.client = new AWS.SES({ apiVersion: "2010-12-01" });
  }

  async send(data) {
    try {
      const sendEmail = this.client.sendEmail(data).promise();
      const result = await sendEmail;
      return {
        statusCode: 200,
        id: result.MessageId,
      };
    } catch (error) {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: "Sorry, there was an error",
          details: error.stack,
        }),
      };
      return response;
    }
  }
}

function createNotificationClient() {
  const client = new Notification();
  return client;
}

module.exports = createNotificationClient;