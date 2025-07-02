import RegisterPage from './features/Auth/pages/RegisterPage';
import LoginPage from './features/Auth/pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './features/Home/pages/HomePage';
import TemplateCreatorPage from './features/Template-Creator/pages/TemplateCreatorPage';
import { Layout, Spin } from 'antd'; 
import { QueryProvider } from './lib/queryClient';
import AppLayout from './components/layout/AppLayout';
import TemplatePreview from './features/Home/components/PreviewTemplate';
import FormTemplate from './features/FillForm/pages/FormTemplate';
import ProtectedRoute from './components/common/ProtectedRoute';

const AppContent = () => {
    const { isLoading, isAuthenticated } = useAuth(); 

    if (isLoading) {
        return (
            <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" />
            </Layout>
        );
    }

    return (
        <Router>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                     <Route path="/" element={<AppLayout />}>
                        <Route index element={<HomePage />}/>
                        <Route path="template-creator" element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <TemplateCreatorPage />
                            </ProtectedRoute>} 
                        />
                        <Route path="template-preview/:id" element={<TemplatePreview />}/>
                        <Route path="teamplete-fill/:id" element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <FormTemplate />
                            </ProtectedRoute>}
                        />
                    </Route>
                </Routes>
        </Router>
    );
};

function App() {

   return (
        <QueryProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
        </QueryProvider>
    );
}

export default App
