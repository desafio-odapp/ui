import axios from 'axios';
import qs from 'qs';

export const rootURL = process.env.REACT_APP_API_URL;

/**
 * Service para acesso a API
 */
const api = axios.create({
  baseURL: rootURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', skipBlank: true }),
});

export default api;