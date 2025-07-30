import { CloudantV1 } from '@ibm-cloud/cloudant';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY || '',
});

const service = new CloudantV1({
  authenticator: authenticator,
});

if (process.env.CLOUDANT_URL) {
  service.setServiceUrl(process.env.CLOUDANT_URL);
}

export { service }; 