import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import axios from 'axios';
const router = express.Router();

router.delete('/delete-image', async (req, res) => {
  try {
    const { deleteUrl } = req.body;
    console.log(deleteUrl);
    const response = await axios.post(deleteUrl);
    if (response.data.success) {
        return sendSuccessResponse(res, 200, 'Image deleted successfully');
    }
    sendErrorResponse(res, 'Delete failed');
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;