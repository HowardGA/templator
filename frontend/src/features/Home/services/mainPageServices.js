import { apiClient } from '../../../lib/apiClient';

export const getLatestTemplates = (page = 1, limit = 8) => {
    return apiClient.get('/template/latest', {
        params: { page, limit }
    });
};