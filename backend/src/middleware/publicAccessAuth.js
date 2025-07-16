import { verifyAccessToken } from '../utils/token.js';

export const authenticateApiAccessToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.apiUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
    };
    next();
};
