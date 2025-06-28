import {apiClient} from '../../../lib/apiClient';

export const getUserWithEmailAndName = async () => {
    return await apiClient.get('/users/');
}