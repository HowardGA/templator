import {parseDurationToSeconds} from '../utils/time.js';

export const JWTConfig = {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

    cookieDomain: process.env.NODE_ENV === 'production' ? 'yourproductiondomain.com' : 'localhost',
    cookieSecure: process.env.NODE_ENV === 'production', 
    cookieSameSite: 'Lax', 
    accessTokenExpiresInSeconds: parseDurationToSeconds('15m'),
    refreshTokenExpiresInSeconds: parseDurationToSeconds('7d'),
}