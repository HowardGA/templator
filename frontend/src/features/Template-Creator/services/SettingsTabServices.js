import {apiClient} from '../../../lib/apiClient';
import { useAntdApi } from '../../../contexts/MessageContext';

export const getTopics = () => {
    return apiClient.get('/topics/');
}

export const getTags = () => {
    return apiClient.get('/tags/all');
}

export const createTag = () => {
    return apiClient.post('/tags/');
}

export const createTemplate = (templateData) => {
    return apiClient.post('/template/', templateData);
}

export const updateTemplate = (templateData, templateId) => {
    return apiClient.put(`/template/${templateId}`, templateData);
}

export const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgBB_KEY}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
        console.log('Full ImgBB response:', data); 

    if (!data.success) {
      throw new Error(data.error?.message || 'Image upload failed');
    }

    return {
      url: data.data.url, 
      deleteUrl: data.data.delete_url,
    };
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
};

export const deleteImageFromImgBB = async (deleteUrl) => {
  const response = apiClient.delete('/image/delete-image',{
      data: { deleteUrl } 
    });
  return response.data;
};


export const deleteTemplate = async (templateId) => {
  return await apiClient.delete(`/template/${templateId}`);
}