import {
  Card,
  Space,
  Typography,
  Divider,
  Tag,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { useParams, useLocation } from "react-router-dom";
import Questions from "../components/Questions";

const { Title, Text, Paragraph } = Typography;

const FormTemplate = () => {
  const { id } = useParams();
  const location = useLocation();
  const template = location.state?.templateData;
  const mode = location.state?.mode || 'create';
  const initialAnswers = location.state?.answers || [];

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
      </Card>
      <Questions 
          questions={template.data.questions} 
          templateId={id}
          mode={mode}
          initialAnswers={initialAnswers}
      />
    </div>
  );
};

export default FormTemplate;
