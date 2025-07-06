import {apiClient} from '../../../lib/apiClient';

export const fillForm = async (formData) => {
    return await apiClient.post('/form/fill', {formData});
};

export const updateForm = async (formId, formData) => {
    return await apiClient.put(`/form/upd/${formId}`,formData);
}

export const deleteForm = async (formId) => {
    return await apiClient.delete(`/form/${formId}`);
}