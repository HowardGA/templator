import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import axios from 'axios';
const router = express.Router();

router.delete('/delete-image', async (req, res) => {
  try {
    const { deleteUrl } = req.body;
    const response = await axios.delete(deleteUrl);
    if (response.data.success) {
        return sendSuccessResponse(res, 200, 'Image deleted successfully');
    }
    sendErrorResponse(res, 'Delete failed');
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;