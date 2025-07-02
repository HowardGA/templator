import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { createForm } from '../services/formService.js';
const router = express.Router();

router.post('/fill', async (req, res) => {
    try{
        const formData = req.body;
        const {newForm} = await createForm(formData);
        sendSuccessResponse(res, 201, 'Successfully filled a form', newForm);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;