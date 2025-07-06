import { Card, Tag, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Text, Title, Paragraph } = Typography;

const TemplateCard = ({ template }) => {
    const navigate = useNavigate();
    return (
        <Card
            hoverable
            style={{ width: '100%', height: '100%' }}
            onClick={() => navigate(`/template-preview/${template.id}`)}
            cover={
                template.imageUrl ? (
                    <img
                        alt={template.title}
                        src={template.imageUrl}
                        style={{ height: 160, objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        height: 160,
                        background: '#f0f2f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text type="secondary">No Image</Text>
                    </div>
                )
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Title level={5} ellipsis={{ rows: 1 }}>{template.title}</Title>
                <Paragraph
                    ellipsis={{ rows: 2 }}
                    type="secondary"
                    style={{ flexGrow: 1 }}
                >
                    {template.description || 'No description provided'}
                </Paragraph>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ marginBottom: 8 }}>
                        {template.tags.map(tag => (
                            <Tag key={tag.tag.id}>{tag.tag.name}</Tag>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Text type="secondary">{`${template.creator?.firstName} ${template.creator?.lastName}` || 'Anonymous'}</Text>
                        <div style={{ marginLeft: 'auto' }}>
                            <Text type="secondary">{template.responseCount || 0} responses</Text>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TemplateCard;