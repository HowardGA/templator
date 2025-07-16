import { salesforceAxios } from '../config/saleforceAxios.js';
import { validateAccountData, createContactPayload } from '../utils/validation.js';

const handleSalesforceResponse = (response) => {
    if (response.data.success === false) {
        throw new Error(`Salesforce API Error: ${JSON.stringify(response.data.errors || response.data)}`);
    }
    return response.data;
};

export const findSalesforceAccountByName = async (accountName) => {
    try {
        const query = `SELECT Id FROM Account WHERE Name = '${accountName.replace(/'/g, "\\'")}' LIMIT 1`; 
        const response = await salesforceAxios.get(`query/?q=${encodeURIComponent(query)}`);
        handleSalesforceResponse(response);
        return response.data.records.length > 0 ? response.data.records[0] : null;
    } catch (error) {
        console.error("Error finding Salesforce Account by name:", error.response?.data || error.message);
        throw new Error("Failed to find Salesforce Account by name.");
    }
};

export const createSalesforceAccount = async (accountData) => {
    try {
        validateAccountData(accountData); 
        const response = await salesforceAxios.post('sobjects/Account/', accountData);
        handleSalesforceResponse(response);
        return response.data; 
    } catch (error) {
        console.error("Error creating Salesforce Account:", error.response?.data || error.message);
        throw new Error("Failed to create Salesforce Account.");
    }
};

export const findSalesforceContactByExternalId = async (externalId) => {
    try {
        const query = `SELECT
            Id,
            FirstName,
            LastName,
            Email,
            Title,
            Phone,
            External_System_ID__c,

            Account.Name,
            Account.Industry,
            AccountId
        FROM Contact
        WHERE External_System_ID__c = '${externalId.replace(/'/g, "\\'")}'`;
        const response = await salesforceAxios.get(`query/?q=${encodeURIComponent(query)}`);
        handleSalesforceResponse(response);
        return response.data.records.length > 0 ? response.data.records[0] : null;
    } catch (error) {
        console.error("Error finding Salesforce Contact by external ID:", error.response?.data || error.message);
        throw new Error("Failed to find Salesforce Contact by external ID.");
    }
};

export const createSalesforceContact = async (contactPayload) => {
    try {
        const response = await salesforceAxios.post('sobjects/Contact/', contactPayload);
        handleSalesforceResponse(response);
        return response.data;
    } catch (error) {
        console.error("Error creating Salesforce Contact:", error.response?.data || error.message);
        throw new Error("Failed to create Salesforce Contact.");
    }
};

export const updateSalesforceContact = async (contactId, contactPayload) => {
    try {
        const response = await salesforceAxios.patch(`sobjects/Contact/${contactId}`, contactPayload);
        if (response.status === 204) {
            return { id: contactId, success: true, errors: [] };
        }
        handleSalesforceResponse(response); 
    } catch (error) {
        console.error("Error updating Salesforce Contact:", error.response?.data || error.message);
        throw new Error("Failed to update Salesforce Contact.");
    }
};

export const resolveSalesforceAccountId = async (accountType, accountFormData) => {
    if (accountType === 'company' && accountFormData && accountFormData.name) {
        const existingAccount = await findSalesforceAccountByName(accountFormData.name);
        if (existingAccount) return existingAccount.Id;
        const newAccountResponse = await createSalesforceAccount({
            Name: accountFormData.name,
            Industry: accountFormData.industry || null
        });
        return newAccountResponse.id;
    } else {
        if (!process.env.GENERIC_ACCOUNT_ID) {
            throw new Error('GENERIC_ACCOUNT_ID environment variable is not set.');
        }
        return process.env.GENERIC_ACCOUNT_ID;
    }
}


export const syncSalesforceContact = async (userID, userStats, contactFormData, salesforceAccountId) => {
    const contactPayload = createContactPayload(userStats, contactFormData, salesforceAccountId, userID);
    const existingSalesforceContact = await findSalesforceContactByExternalId(userID);
    if (existingSalesforceContact) {
        return await updateSalesforceContact(existingSalesforceContact.Id, contactPayload);
    } else {
        return await createSalesforceContact(contactPayload);
    }
}