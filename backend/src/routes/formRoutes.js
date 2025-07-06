import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { createForm } from '../services/formService.js';
import { myForms, singleForm, updateForm, deleteForm } from '../data/formRepository.js';
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

router.get('/mine/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const forms = await myForms(userId);
        sendSuccessResponse(res, 200, 'Successfully fetched filled forms', forms)
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.get('/single/:id', async (req, res) => {
    try{
        const formId = req.params.id;
        const form = await singleForm(formId);
        sendSuccessResponse(res, 200, 'Successfully fetched form', form);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.put('/upd/:id', async (req, res) => {
    try{
        const formId = req.params.id;
        const formData = req.body;
        const updForm = await updateForm(formId, formData);
        sendSuccessResponse(res, 201, 'Successfully updated a form', updForm);
    } catch (error) {
        sendErrorResponse(res, error);
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const formId = req.params.id;
    const deletedForm = await deleteForm(formId);
    sendSuccessResponse(res, 200, 'Form deleted successfully', deletedForm);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;