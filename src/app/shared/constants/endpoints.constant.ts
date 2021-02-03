import { Endpoint } from '../utils/endpoint.util';

const authenticationPath = '/authentication';

export const endpoints = {
  refreshAccessToken: new Endpoint('v1', `${authenticationPath}/refresh-access-token`),
  logout: new Endpoint('v1', `${authenticationPath}/logout`)
};
