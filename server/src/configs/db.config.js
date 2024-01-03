const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY,
});

const service = new CloudantV1({
  authenticator: authenticator,
});
service.setServiceUrl(process.env.CLOUDANT_URL);

exports.service = service;
