import {parseDurationToSeconds} from '../utils/time.js';

export const JWTConfig = {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

    cookieDomain: 'templator-eta.vercel.app',
    cookieSecure: true, 
    cookieSameSite:'None', 
    accessTokenExpiresInSeconds: parseDurationToSeconds('15m'),
    refreshTokenExpiresInSeconds: parseDurationToSeconds('7d'),
}