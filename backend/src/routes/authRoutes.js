import express from 'express';
import { registerUser, loginUser } from '../services/authService.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        const {newUser, accessToken, refreshToken} = await registerUser(userData);
        setAuthCookies(res, accessToken, refreshToken);
        sendSuccessResponse(res, 201, 'User registered successfully', newUser);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const credentials = req.body;
        const {user, accessToken, refreshToken} = await loginUser(credentials);
        setAuthCookies(res, accessToken, refreshToken);
        sendSuccessResponse(res, 200, "Login successful", user);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.post('/logout', async (req, res) => {
    clearAuthCookies(res);
    sendSuccessResponse(res, 200, 'User logged out successfully');
});

router.get('/me',authenticateToken, async (req, res) => {
    console.log("/me - req.user:", req.user);
    sendSuccessResponse(res, 200, 'User data fetched successfully', req.user);
})

export default router;

