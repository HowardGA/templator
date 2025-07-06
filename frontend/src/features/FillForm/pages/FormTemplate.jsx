import {
  Card,
  Space,
  Typography,
  Divider,
  Tag,
  Avatar,
  Spin
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { useParams, useLocation } from "react-router-dom";
import Questions from "../components/Questions";
import { useGetSingleForm } from "../../Profile/hooks/userHooks";

const { Title, Text, Paragraph } = Typography;

const FormTemplate = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedTemplateData = location.state?.templateData || null;
  const mode = location.state?.mode || "create";
  const shouldFetchForm = !passedTemplateData;
  const {data: formDetails, isLoading: formDetailsLoading, isError} = useGetSingleForm(id, {enabled: shouldFetchForm});
  const templateData = passedTemplateData?.data || formDetails?.data?.template || null;
  const initialAnswers = formDetails?.data?.answers || [];

  if (formDetailsLoading && shouldFetchForm) return <Spin />;
  if (isError && shouldFetchForm)
    return <Alert message="Error loading form" type="error" showIcon />;
  console.log(formDetails)
  if (!templateData) {
    return (
      <Alert
        message="Template data is missing"
        type="error"
        showIcon
      />
    );
  }

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
          templateData.imageUrl ? (
            <img
              src={templateData.imageUrl}
              alt={templateData.title}
              style={{ maxHeight: 300, objectFit: "cover" }}
            />
          ) : null
        }
      >
        <Title level={2}>{templateData.title}</Title>

        <Paragraph>
          <ReactMarkdown>
            {templateData.description || "No description provided."}
          </ReactMarkdown>
        </Paragraph>

        <Space size="small" wrap>
          <Tag color="blue">{templateData.topic?.name}</Tag>
          {(templateData.tags || []).map(({ tag }) => (
            <Tag color="purple" key={tag.id}>
              {tag.name}
            </Tag>
          ))}
        </Space>

        <Divider />

          <Space align="center">
            <Avatar
              src={templateData.creator?.avatar}
              icon={<UserOutlined />}
            />
            <Text>
              Created by {templateData.creator?.firstName}{" "}
              {templateData.creator?.lastName}
            </Text>
            <Text type="secondary">
              {new Date(templateData.createdAt).toLocaleDateString()}
            </Text>
          </Space>
      </Card>
      <Questions 
          questions={templateData.questions || []} 
          templateId={templateData.id}
          mode={mode}
          initialAnswers={initialAnswers}
          initialCheckboxAnswers={formDetails?.data?.answerOptions || []}
          formId={formDetails?.data?.id || ''}
      />
    </div>
  );
};

export default FormTemplate;
