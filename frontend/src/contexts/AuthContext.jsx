import { createContext, useContext, useState, useEffect } from 'react';
import { useCurrentUser, useRegister, useLogin, useLogout } from '../features/Auth/hooks/authHooks';
import {Spin} from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { data, isSuccess, isError, isLoading: isCurrentUserLoading, refetch: refetchCurrentUser } = useCurrentUser();

    useEffect(() => {
        if (isSuccess && data?.data) {
            console.log("SUCCESS (useEffect):", data);
            setUser(data.data);
            setIsAuthenticated(true);
            setIsLoading(false);
        } else if (isError) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
        }
        }, [isSuccess, isError, data]);


    const registerMutation = useRegister({ setUser, setIsAuthenticated }); 
    const loginMutation = useLogin({ setUser, setIsAuthenticated });
    const logoutMutation = useLogout({ setUser, setIsAuthenticated });

    const authContextValue = {
        user,
        isAuthenticated,
        isLoading,
        register: registerMutation.mutate,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isRegistering: registerMutation.isLoading,
        isLoggingIn: loginMutation.isLoading,
        isLoggingOut: logoutMutation.isLoading,
        refetchCurrentUser
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {isLoading ? (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};