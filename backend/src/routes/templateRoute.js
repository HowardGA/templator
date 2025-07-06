import express from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { createFullTemplate, lastestTemplates, singleTemplate,
     giveLike, createComment, getComments, getLikes,
      removeLike, updateFullTemplate } from '../services/templateService.js';
import { deleteTemplate, restrictedTemplates, myTemplates } from '../data/templateRepository.js';

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

router.get('/single/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const {currentUserId} = req.query || null;
        const template = await singleTemplate(id,currentUserId);
        sendSuccessResponse(res, 200, 'Template fetched successfully', template);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.post('/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const {currentUserId} = req.body;
    const like = await giveLike(id, currentUserId, res);
    sendSuccessResponse(res, 201, 'Successfully gave a like', like);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.delete('/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: currentUserId } = req.query; 
    await removeLike(id, currentUserId);
    sendSuccessResponse(res, 200, 'Successfully removed like');
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/:id/comments', async (req, res) => {
    try{
        const {id} = req.params;
        const {currentUserId, comment} = req.body;
        const newComment = await createComment(id, currentUserId, comment);
        sendSuccessResponse(res, 201, 'Successfully left a comment', newComment);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.get('/:id/comments', async (req, res) => {
    try{
        const {id} = req.params;   
        const { page = 1, limit = 10 } = req.query;
        const comments = await getComments(id, parseInt(page), parseInt(limit)); 
        sendSuccessResponse(res, 200, 'Successfully fetched comments', comments);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.get('/:id/likes', async (req, res) => {
    try{
        const {id} = req.params;   
        const likes = await getLikes(id); 
        sendSuccessResponse(res, 200, 'Successfully fetched likes', likes);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.put('/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const templateData = req.body;

    const { updatedTemplate } = await updateFullTemplate(templateId, templateData);
    sendSuccessResponse(res, 200, 'Template updated successfully', updatedTemplate);
  } catch (error) {
    console.error("Update failed:", error); 
    sendErrorResponse(res, error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    await deleteTemplate(templateId)
    sendSuccessResponse(res, 200, 'Template deleted successfully');
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/restricted/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const templates = await restrictedTemplates(userId);
    sendSuccessResponse(res, 200, 'Templates fetched successfully', templates); 
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/mine/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId)
    const templates = await myTemplates(userId);
    sendSuccessResponse(res, 200, 'Templates fetched successfully', templates);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});


export default router;