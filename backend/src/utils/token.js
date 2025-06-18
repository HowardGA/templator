import jwt from 'jsonwebtoken';
import { JWTConfig } from '../config/jwt.js';

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWTConfig.jwtAccessSecret, { expiresIn: JWTConfig.accessTokenExpiresInSeconds });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWTConfig.jwtRefreshSecret, { expiresIn: JWTConfig.refreshTokenExpiresInSeconds });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWTConfig.jwtAccessSecret);
    } catch (error) {
        return null; 
    }
};

export const verifyRefreshToken = (token) => { 
    try {
        return jwt.verify(token, JWTConfig.jwtRefreshSecret);
    } catch (error) {
        return null; 
    }
};






