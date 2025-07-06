import {apiClient} from '../../../lib/apiClient';

export const getUserWithEmailAndName = async () => {
    return await apiClient.get('/users/');
}

export const sharedWithMe = async (userId) => {
    return await apiClient.get(`/template/restricted/${userId}`);
}

export const myTemplates = async (userId) => {
    console.log(userId)
    return await apiClient.get(`/template/mine/${userId}`);
}

export const myForms = async (userId) => {
        console.log(userId)

    return await apiClient.get(`/form/mine/${userId}`);
}