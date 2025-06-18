import {Layout} from 'antd';
import RegisterForm from '../components/RegisterForm';
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const RegisterPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <RegisterForm />
        </Layout>
    );
}

export default RegisterPage;