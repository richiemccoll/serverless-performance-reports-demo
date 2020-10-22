const AWS = require("aws-sdk");

AWS.config.update({ region: 'us-west-2' });

class Storage {
  constructor() {
    this.client = new AWS.S3();
    this.bucketName = 'perfreportstorage113155-test';
  }

  get date() {
    const today = new Date();
    const [date] = today.toISOString().split('T');
    return date;
  }

  async write(file) {
    const filename = `report-${this.date}.json`;
    const params = {
      Bucket: this.bucketName,
      Body: file,
      Key: filename,
      ACL:'public-read',
      ContentType: 'application/json'
    };
    const data = await this.client.putObject(params).promise();
    if (!data) {
      throw new Error(`There was a problem uploading: ${filename} to S3`);
    }
    return data;
  }
}

function createStorageClient() {
  const client = new Storage();
  return client;
}

module.exports = createStorageClient;