import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { authenticateApiAccessToken } from '../middleware/publicAccessAuth.js';
import { generateAccessToken } from '../utils/token.js';
import { getTemplatesForOdooUser } from '../data/odooRepository.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/templates/for-api-user', authenticateApiAccessToken, async (req, res) => {
   try {
        const apiUser = req.apiUser;
        const templates = await getTemplatesForOdooUser(apiUser.id);
        console.log('Templates fetched for ODOO API user:', templates);
        sendSuccessResponse(res, 200, 'Succesfully fetched templates for ODOO API user', templates);
   } catch (error) {
        sendErrorResponse(res, error);
   }
});


router.get('/user/access-token', authenticateToken, (req, res) => {
    try{ 
    const tokenPayload = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
    };
    const accessToken = generateAccessToken(tokenPayload);
    console.log(accessToken)
    sendSuccessResponse(res, 200, 'Successfully generated ODOO token', accessToken);
} catch (error) {
    console.error('Error generating Odoo token:', error);
    sendErrorResponse(res, error);
}
});

export default router;
