import { apiClient } from "../../../lib/apiClient";

export const registerUser = async (userData) => {
    return apiClient.post('/auth/register', userData);
}

export const loginUser = async (credentials) => {
    return apiClient.post('/auth/login', credentials);
}

export const logoutUser = async () => {
    return apiClient.post('/auth/logout');
}

export const fetchCurrentUser = async () => {
    console.log('useCurrentUser triggered') 
    return apiClient.get('/auth/me');
}