import { Form, Input, InputNumber, Checkbox, Button, Typography } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import { useFillForm, useUpdateForm } from "../hooks/formHook";
import { useEffect } from "react";
const { Text } = Typography;

const Questions = ({ questions, templateId, mode = 'create', initialAnswers = [], initialCheckboxAnswers = [], formId = '' }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { mutate: fillForm, isPending: submittingForm } = useFillForm();
  const { mutate: updateForm, isPending: updatingForm } = useUpdateForm();

    useEffect(() => {
    if (mode !== 'create') {
      const initialValues = {};
      questions.forEach((question, index) => {
        const key = `q${index + 1}`;
        if (question.questionType === 'CHECKBOX') {
          initialValues[key] = initialCheckboxAnswers
            .filter(ao => ao.questionId === question.id)
            .map(ao => ao.optionId);
        } else {
          const answer = initialAnswers.find(a => a.questionId === question.id);
          initialValues[key] = 
            answer?.stringValue ??
            answer?.textValue ??
            answer?.intValue ??
            '';
        }
      });
      form.setFieldsValue(initialValues);
    }
}, [initialAnswers, initialCheckboxAnswers, form, mode, questions]);

  const renderInput = (question) => {
    const isDisabled = mode === 'view';
    switch (question.questionType) {
      case "SINGLE_LINE_STRING":
        return <Input placeholder="Short answer" disabled={isDisabled} />;
      case "MULTI_LINE_TEXT":
        return <Input.TextArea rows={4} placeholder="Long answer" disabled={isDisabled} />;
      case "NON_NEGATIVE_INTEGER":
        return <InputNumber style={{ width: '100%' }} placeholder="Non negative int" min={0} disabled={isDisabled} />;
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

    if (mode === 'create') {
      fillForm(payload);
    } else if (mode === 'updating') {
      console.log('hereUDP')
      updateForm({ formId: formId, updatedAnswers: payload });
    }
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
            valuePropName='value'
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
      {mode === 'updating' && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Edited Form
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default Questions;
