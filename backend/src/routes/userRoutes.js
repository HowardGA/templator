import express from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { fetchUsersEmailAndName } from '../data/userRepository.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const users = await fetchUsersEmailAndName();
        sendSuccessResponse(res, 200, 'Successfully fetched users', users);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;