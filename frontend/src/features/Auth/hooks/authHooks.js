import {useMutation, useQuery} from '@tanstack/react-query';
import { queryClient } from '../../../lib/queryClient.jsx';
import { registerUser, loginUser, fetchCurrentUser, logoutUser } from '../services/authServices';
import { useAntdApi } from '../../../contexts/MessageContext.jsx';


export const useRegister = ({ setUser, setIsAuthenticated }) => {
    const { message: messageApi } = useAntdApi();
    return useMutation({
        mutationFn: async (userData) => {
            const response = await registerUser(userData)
            return response;
        },
        onSuccess: (data) => {
            setUser(data.user);
            setIsAuthenticated(true);
            messageApi.success(data.message || 'Registration successful!');
        },
         onError: (error) => {
            messageApi.error(error.response?.data?.message || 'Registration failed.');
        }
    })
} 

export const useLogin = ({ setUser, setIsAuthenticated }) => {
    const { message: messageApi } = useAntdApi();
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await loginUser(credentials)
            return response;
        },
        onSuccess: (data) => {
            setUser(data.user);
            setIsAuthenticated(true);
            messageApi.success(data.message || 'Logged in successfully!'); 
            queryClient.refetchQueries('currentUser')
        },
        onError: (error) => {
            messageApi.error(error.response?.data?.message || 'Login failed.');
        }
    })
}

export const useLogout = ({ setUser, setIsAuthenticated }) => {
    const { message: messageApi } = useAntdApi();
    return useMutation({
        mutationFn: async () => {
            const response = await logoutUser();
            return response.data;
        },
        onSuccess: () => {
            setUser(null);
            setIsAuthenticated(false);
            queryClient.removeQueries('currentUser');
            queryClient.invalidateQueries(['currentUser']);
            messageApi.success('Logged out successfully!'); 
        },
        onError: (error) => {
            messageApi.error(error.response?.data?.message || 'Logout failed, but session cleared locally.'); 
            setUser(null);
            setIsAuthenticated(false);
            console.error("logout error:", error); 
        }
    })
}

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async() => {
            const response = await fetchCurrentUser();
            console.log("QueryFn response:", response);
            return response;
        },
    })
}
