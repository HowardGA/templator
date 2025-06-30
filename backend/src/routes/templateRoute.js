import express from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { createFullTemplate, lastestTemplates } from '../services/templateService.js';

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

router.get('/latest', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const templates = await lastestTemplates(limit, (page - 1) * limit);
        sendSuccessResponse(res, 200, 'Newest templates fetched', { templates: templates.data, pagination: templates.pagination});
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;