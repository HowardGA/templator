import express from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { createFullTemplate } from '../services/templateService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const templateData = req.body;
        const {newTemplate} = createFullTemplate(templateData);
        sendSuccessResponse(res, 201, 'Template created successfully', newTemplate);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;