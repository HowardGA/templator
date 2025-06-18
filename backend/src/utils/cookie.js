import { JWTConfig } from '../config/jwt.js';

export const cookieCreator = (type, token, res) => {
    const expiresInSeconds = type === 'accessToken' ? JWTConfig.accessTokenExpiresInSeconds : JWTConfig.refreshTokenExpiresInSeconds;
    res.cookie(type, token, {
        httpOnly: true,
        secure: JWTConfig.cookieSecure,
        sameSite: JWTConfig.cookieSameSite,
        expires: new Date(Date.now() + expiresInSeconds * 1000), 
        domain: JWTConfig.cookieDomain
    });
};

export const cookieClearer = (type, res) => {
    res.clearCookie(type, {
        httpOnly: true,
        secure: JWTConfig.cookieSecure,
        sameSite: JWTConfig.cookieSameSite,
        domain: JWTConfig.cookieDomain
    });
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    cookieCreator('accessToken', accessToken, res);
    cookieCreator('refreshToken', refreshToken, res);
};

export const clearAuthCookies = (res) => {
    cookieClearer('accessToken', res);
    cookieClearer('refreshToken', res);
};