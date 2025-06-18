import { Layout } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    
    return (
        <Layout style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoginForm />
        </Layout>
    );
}

export default LoginPage;