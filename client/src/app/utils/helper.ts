import { LOCALSTORAGE_TOKEN_KEY } from './constants';
import { JwtHelperService } from '@auth0/angular-jwt';

export const setToken = (token: string) => {
  localStorage[LOCALSTORAGE_TOKEN_KEY] = token;
};

export const getToken = () => {
  return localStorage[LOCALSTORAGE_TOKEN_KEY];
};

export const parseToken = () => {
  try {
    console.log({ 'getToken()': getToken() });
    const jwtService = new JwtHelperService();
    return jwtService.decodeToken(getToken());
  } catch (error) {
    return null;
  }
};
