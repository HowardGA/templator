import { Menu, Layout, Typography, Button, Dropdown, Space, Input } from 'antd';
import { FaHome, FaWpforms, FaPlusSquare, FaUser } from "react-icons/fa";
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom'; 

const { Header } = Layout;
const { Title } = Typography;

const getMenuItems = (isAuthenticated) => [
    {
        key: 'home',
        label: <Link to="/">Home</Link>,
        icon: <FaHome />
    },
    isAuthenticated && {
        key: 'my-templates',
        label: <Link to="/my-templates">My Templates</Link>,
        icon: <FaWpforms />
    },
    isAuthenticated && {
        key: 'create-template',
        label: <Link to="/create-template">Create Template</Link>,
        icon: <FaPlusSquare />
    },
    isAuthenticated && {
        key: 'profile',
        label: <Link to="/profile">Profile</Link>,
        icon: <FaUser />
    }
].filter(Boolean); 

const AppHeader = () => {
    const { isAuthenticated, user, logout } = useAuth(); 

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
    };

    return (
        <Header style={headerStyle}>
                <Title level={3} style={{ color: 'white', margin: 0, marginRight: '20px' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Templator
                    </Link>
                </Title>
                <Menu
                    theme='dark'
                    mode='horizontal'
                    style={{ flex: 1, minWidth: 0 }}
                    items={getMenuItems(isAuthenticated)} 
                />


            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Input
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    style={{ width: 200, marginRight: '20px' }}
                />
                {isAuthenticated ? (
                    <Button
                        type='primary'
                        danger
                        onClick={logout}
                    >
                        Logout
                    </Button>
                ) : (
                    <>
                        <Button type='default'>
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button type='primary'>
                            <Link to="/register">Register</Link>
                        </Button>
                    </>
                )}
            </div>
        </Header>
    );
}

export default AppHeader;