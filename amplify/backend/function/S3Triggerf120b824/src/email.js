class Email {
    constructor({ message, subject, recipient, sender }) {
      this.config = {
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: message,
            },
            Text: {
              Charset: "UTF-8",
              Data: message,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: sender,
        Destination: {
          ToAddresses: [recipient],
        },
      };
    }
  }
  
  module.exports = Email;