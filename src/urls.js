import { urls } from 'oph-urls-js';

const CALLER_ID = '1.2.246.562.10.00000000001.oma-opintopolku';

export const configureUrls = async () => {
  urls.addCallerId(CALLER_ID);
  await urls.load('/oma-opintopolku/rest/config/frontProperties');
};
