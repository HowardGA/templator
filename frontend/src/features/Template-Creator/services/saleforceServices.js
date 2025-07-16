import { apiClient } from "../../../lib/apiClient"

export const syncData = async (userData) => {
    return apiClient.post('/salesforce/crm-sync', userData);
}

export const getUserData = async (userId) => {
    return apiClient.get(`/users/single/${userId}`);
}

export const getSalesforceContactStatus = async () => {
    return apiClient.get('/salesforce/contact-status'); 
};