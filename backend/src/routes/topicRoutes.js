import express from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { fetchAllTopics } from '../data/topicRepository.js';

const router = express.Router();

router.get('/', async (req,res) => {
    try{
        const response = await fetchAllTopics();
        sendSuccessResponse(res, 200, 'Successfully fetched topics', response);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;