import { apiClient } from '../../../lib/apiClient';

export const getLatestTemplates = async (page = 1, limit = 8) => {
    return await apiClient.get('/template/latest', {
        params: { page, limit }
    });
};

export const getTemplateDetails = async (templateId, userId) => {
    return await apiClient.get(`/template/single/${templateId}`,  {
    params: { currentUserId: userId } 
  });
};

export const addLike = async (templateId, userId) => {
  return apiClient.post(`/template/${templateId}/likes`, {currentUserId: userId});
};

export const removeLike = async (templateId, userId) => {
  return await apiClient.delete(`/template/${templateId}/likes?userId=${userId}`);
};

export const getTemplateLikes = async (templateId, page = 1, limit = 20) => {
  return await apiClient.get(`/template/${templateId}/likes`, {
    params: { page, limit }
  });
};

export const getTemplateComments = async (templateId, page = 1, limit = 10) => {
  return await apiClient.get(`/template/${templateId}/comments`, {
    params: { page, limit }
  });
};

export const addComment = async (templateId, content, currentUserId) => {
  return await apiClient.post(`/template/${templateId}/comments`, { comment:content, currentUserId });
};