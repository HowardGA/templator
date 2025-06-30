import { Layout, Spin } from 'antd';
import AppHeader from './Header';
import { useAuth } from '../../contexts/AuthContext'; 
import { Outlet } from 'react-router-dom';

const { Content, Footer } = Layout;
const AppLayout = () => {
    const { isLoading } = useAuth(); 

    if (isLoading) {
        return (
            <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" />
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    <Outlet />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                Templator ©{new Date().getFullYear()} Created by Howard Garcia
            </Footer>
        </Layout>
    );
};

export default AppLayout;