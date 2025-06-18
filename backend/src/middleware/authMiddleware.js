import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { sendErrorResponse } from "../utils/response.js";
import { findUserByEmail } from "../data/userRepository.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookie.js";

const handleMissingTokens = (res, accessToken, refreshToken) => {
    if (!accessToken && !refreshToken) {
        sendErrorResponse(res, { statusCode: 401, message: 'Authentication required. No tokens provided.' });
        return true;
    }
    return false;
};

const getUserFromDecodedToken = (decodedToken) => ({
    id: decodedToken.id,
    email: decodedToken.email,
    role: decodedToken.role,
    name: decodedToken.name
});

const handleInvalidRefreshToken = (res) => {
    clearAuthCookies(res);
    sendErrorResponse(res, { statusCode: 403, message: 'Session expired. Please log in again.' });
};

const fetchAndValidateUserForRefresh = async (res, email) => {
    try {
        const user = await findUserByEmail(email);
        if (!user || user.isBlocked) {
            clearAuthCookies(res);
            sendErrorResponse(res, { statusCode: 403, message: 'User account inactive or blocked. Please log in again.' });
            return null;
        }
        return user; 
    } catch (error) {
        console.error("Error fetching user for token refresh:", error);
        clearAuthCookies(res);
        sendErrorResponse(res, { statusCode: 500, message: 'Failed to retrieve user for token refresh.' });
        return null;
    }
};

const issueAndSetNewTokens = (res, user) => {
    const tokenPayload = { id: user.id, email: user.email, role: user.role, name: user.firstName + ' ' + user.lastName };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    setAuthCookies(res, newAccessToken, newRefreshToken);
    return tokenPayload; 
};

export const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (handleMissingTokens(res, accessToken, refreshToken)) {
        return;
    }
    const decodedAccess = accessToken ? verifyAccessToken(accessToken) : null;
    if (decodedAccess) {
        req.user = getUserFromDecodedToken(decodedAccess);
        return next();
    }
    if (refreshToken) {
        const decodedRefresh = verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            handleInvalidRefreshToken(res);
            return; 
        }
        const user = await fetchAndValidateUserForRefresh(res, decodedRefresh.email);
        if (!user) {
            return; 
        }
        req.user = issueAndSetNewTokens(res, user);
        return next(); 
    }
    return sendErrorResponse(res, { statusCode: 401, message: 'Authentication required: No valid tokens after all checks.' });
};