import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { resolveSalesforceAccountId, syncSalesforceContact, findSalesforceContactByExternalId } from '../services/salesForceService.js';
import { getUserStats } from '../data/salesforceRepository.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateContactData, validateAccountData } from '../utils/validation.js';

const router = express.Router();

router.post('/crm-sync', authenticateToken,  async (req, res) => {
    try {
        const { accountType, account: accountFormData, contact: contactFormData } = req.body;
        const userID = req.user.id; 
        validateContactData(contactFormData);
        if (accountType === 'company') {
            validateAccountData(accountFormData);
        }
        const salesforceAccountId = await resolveSalesforceAccountId(accountType, accountFormData);
        const userStats = await getUserStats(userID);
        const result = await syncSalesforceContact(userID, userStats, contactFormData, salesforceAccountId);
        const statusCode = result.success ? (result.id ? 201 : 200) : 500; 
        const message = result.id ? 'User CRM profile created successfully' : 'User CRM profile updated successfully';
        sendSuccessResponse(res, statusCode, message, result);
    } catch (error) {
        console.error("Salesforce sync error:", error);
        sendErrorResponse(res, error);
    }
});

router.get('/contact-status', authenticateToken, async (req, res) => {
    try {
        const userID = req.user.id; 
        const existingSalesforceContact = await findSalesforceContactByExternalId(userID);
        sendSuccessResponse(res, 200, 'Salesforce contact status fetched', {
            isContactRegistered: !!existingSalesforceContact,
            salesforceContactId: existingSalesforceContact ? existingSalesforceContact.Id : null,
            contactData: existingSalesforceContact || null 
        });
    } catch (error) {
        console.error("Error fetching Salesforce contact status:", error);
        sendErrorResponse(res, error);
    }
});
export default router;
