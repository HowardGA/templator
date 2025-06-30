import { useAuth } from "../../../contexts/AuthContext";
import LastestTemplates from "../components/LastestTemplates";
import { Layout, Typography, Space } from "antd";
const { Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
    return (
        <Content style={{
            margin: '0 auto',
            maxWidth: '1400px',
            width: '100%'
        }}>
            <Space
                direction="vertical"
                size="large"
                style={{
                    width: '100%',
                    textAlign: 'left'
                }}
            >
                <Title level={2}>Latest Templates</Title>

                <LastestTemplates />

            </Space>
        </Content>
    )
}
export default HomePage;