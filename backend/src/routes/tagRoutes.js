import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { createTagService } from '../services/tagService.js';
import { fetchTags } from '../data/tagRepository.js';
const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const tag = req.body;
        const newTag = await createTagService(tag)
        sendSuccessResponse(res, 201, 'Tag created successfully', newTag);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.get('/all', async(req, res) => {
    try{
        const tags = await fetchTags();
        sendSuccessResponse(res, 200, 'Successfully fetched tags', tags);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;