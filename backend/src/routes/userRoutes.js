import express from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { fetchUsersEmailAndName, findById } from '../data/userRepository.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const users = await fetchUsersEmailAndName();
        sendSuccessResponse(res, 200, 'Successfully fetched users', users);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.get('/single/:id', async (req, res) => {
    try {
        const {id} = req.params
        const user = await findById(id);
        sendSuccessResponse(res, 200, 'Successfully fetched user', user);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

export default router;