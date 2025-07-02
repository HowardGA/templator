import {apiClient} from '../../../lib/apiClient';

export const fillForm = async (formData) => {
    return await apiClient.post('/form/fill', {formData});
};