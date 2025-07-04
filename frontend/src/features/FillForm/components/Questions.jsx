import { Form, Input, InputNumber, Checkbox, Button, Typography } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import { useFillForm } from "../hooks/formHook";
import { useEffect } from "react";
const { Text } = Typography;

const Questions = ({ questions, templateId, mode = 'create', initialAnswers = [] }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { mutate: fillForm, isPending: submittingForm } = useFillForm();

  useEffect(() => {
    if (mode !== 'create' && initialAnswers.length > 0) {
      const initialValues = {};
      initialAnswers.forEach((answer, index) => {
        const key = `q${index + 1}`;
        if (answer.question.questionType === 'CHECKBOX') {
          initialValues[key] = answer.selectedOptions || [];
        } else {
          initialValues[key] = 
            answer.stringValue ?? 
            answer.textValue ?? 
            answer.intValue ?? 
            answer.checkbox ?? '';
        }
      });

      form.setFieldsValue(initialValues);
    }
  }, [initialAnswers, form, mode]);

  const renderInput = (question) => {
    const isDisabled = mode === 'view';
    switch (question.questionType) {
      case "SINGLE_LINE_STRING":
        return <Input placeholder="Short answer" disabled={isDisabled}/>;
      case "MULTI_LINE_TEXT":
        return <Input.TextArea rows={4} placeholder="Long answer" disabled={isDisabled}/>;
      case "NON_NEGATIVE_INTEGER":
        return <InputNumber style={{ width: '100%' }} placeholder="Non negative int" min={0} disabled={isDisabled}/>;
      case "CHECKBOX":
        return (
          <Checkbox.Group
            disabled={isDisabled}
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {question.options.map((option) => (
              <Checkbox key={option.id} value={option.id}>
                {option.optionText}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (values) => {
    if (mode !== 'create') return;
    const answers = Object.entries(values).map(([key, value], index) => {
      const question = questions[index];
      return {
        questionId: question.id,
        questionType: question.questionType,
        value,
      };
    });
    const payload = {
      templateId,
      fillerUserId: user.id,
      answers,
    };
    fillForm(payload)
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 24 }}
    >
      {questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: 24 }}>
          <Text strong>{`${index + 1} - ${q.title}`}</Text>
          {q.description && (
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary">{q.description}</Text>
            </div>
          )}
          <Form.Item
            key={q.id}
            name={`q${index + 1}`}
            valuePropName={q.questionType === "CHECKBOX" ? "checked" : "value"}
            rules={[
              {
                required: q.required,
                message: `Please answer "${q.title}"`,
              },
            ].filter(Boolean)}
          >
            {renderInput(q)}
          </Form.Item>
        </div>
      ))}
      {mode === 'create' && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Form
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default Questions;
