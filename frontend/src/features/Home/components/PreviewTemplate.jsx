import {
  Card,
  Collapse,
  Button,
  Space,
  Typography,
  Divider,
  Tag,
  Avatar,
  Spin,
  Alert,
  List
} from "antd";
import { UserOutlined, FormOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import CommentsSection from "./CommentsSection";
import LikeButton from "./LikeButton";
import { useAuth } from "../../../contexts/AuthContext";
import { useTemplateDetails } from "../hooks/mainPageHooks";
import { useParams, useNavigate } from "react-router-dom";
import { QUESTION_TYPES } from "../../Template-Creator/components/QuestionItem";
import { FiSettings } from "react-icons/fi";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const TemplatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: template,
    isLoading: templateLoading,
    isError,
    error,
  } = useTemplateDetails(id, user? user.id : null);

  if (templateLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error loading template"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }
      console.log(template.data)

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px 16px",
      }}
    >
      <Card
        style={{ width: "100%" }}
        cover={
          template.data.imageUrl ? (
            <img
              src={template.data.imageUrl}
              alt={template.data.title}
              style={{ maxHeight: 300, objectFit: "cover" }}
            />
          ) : null
        }
      >
        <Title level={2}>{template.data.title}</Title>

        <Paragraph>
          <ReactMarkdown>
            {template.data.description || "No description provided."}
          </ReactMarkdown>
        </Paragraph>

        <Space size="small" wrap>
          <Tag color="blue">{template.data.topic?.name}</Tag>
          {template.data.tags?.map(({ tag }) => (
            <Tag color="purple" key={tag.id}>
              {tag.name}
            </Tag>
          ))}
        </Space>

        <Divider />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Space align="center">
            <Avatar
              src={template.data.creator?.avatar}
              icon={<UserOutlined />}
            />
            <Text>
              Created by {template.data.creator?.firstName}{" "}
              {template.data.creator?.lastName}
            </Text>
            <Text type="secondary">
              {new Date(template.data.createdAt).toLocaleDateString()}
            </Text>
          </Space>
          {user &&
          <Space>
            {(template.data.creator?.id === user.id || user.role === 'ADMIN') &&
              <Button variant="solid" color="orange" icon={<FiSettings />} onClick={() => navigate('/template-creator', {state: {templateData: template.data}})}>
              Edit Template
            </Button>}
            <Button type="primary" icon={<FormOutlined />} onClick={() => navigate(`/teamplete-fill/${id}`, { state: { templateData: template}})}>
              Take This Form
            </Button>
            <LikeButton template={template.data} userId={user.id} />
          </Space>}
        </div>
      </Card>

      <Collapse expandIcon style={{ marginTop: 24 }}>
        <Panel
          header={`Questions (${template.data.questions?.length || 0})`}
          key="questions"
        >
          {template.data.questions?.map((q) => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <Text strong>{q.title}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                ({QUESTION_TYPES[q.questionType]})
              </Text>
              <div
                style={{
                  background: "#f5f5f5",
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                <Text type="secondary">{q.description}</Text>
              </div>
              { q.options && q.options.length > 0 && (
                <List
    
                  size="small"
                  dataSource={q.options}
                  renderItem={(item) => <List.Item>{item.optionText}</List.Item>}
                />
              )}
            </div>
          ))}
        </Panel>
      </Collapse>

      <Divider />
      <div style={{ marginTop: 24 }}>
        <CommentsSection templateId={template.data.id} user={user} />
      </div>
    </div>
  );
};

export default TemplatePreview;
