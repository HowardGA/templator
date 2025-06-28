import { Card, Row, Col, Select, Input, Form, Button, Space, Checkbox, Tooltip } from "antd";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const QUESTION_TYPES = {
    SINGLE_LINE_STRING: "Single Line Text",
    MULTI_LINE_TEXT: "Multi Line Text",
    NON_NEGATIVE_INTEGER: "Non-Negative Integer",
    CHECKBOX: "Checkbox"
};

const QuestionItem = ({ field, remove, formInstance, questionIndex, isRemovable }) => {
    const currentQuestionType = Form.useWatch(['items', field.name, 'questionType'], formInstance);

    return (
        <Card
            size="small"
            title={`Question ${questionIndex + 1}`} 
            key={field.key} 
            extra={
                isRemovable ? ( 
                    <Tooltip title="Remove Question">
                        <Button
                            type="text"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => remove(field.name)}
                        />
                    </Tooltip>
                ) : null
            }
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name={[field.name, 'title']}
                        label="Question Title"
                        rules={[{ required: true, message: 'Please enter question title' }]}
                    >
                        <Input placeholder="Your question title" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name={[field.name, 'questionType']}
                        label="Answer Type"
                        rules={[{ required: true, message: 'Please select an answer type' }]}
                    >
                        <Select
                            placeholder="Select an answer type"
                            allowClear
                        >
                            {Object.entries(QUESTION_TYPES).map(([key, value]) => (
                                <Option key={key} value={key}>{value}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name={[field.name, 'description']}
                label="Question Description"
                rules={[{ required: true, message: 'Please enter question description' }]}
            >
                <Input.TextArea rows={2} placeholder="e.g., Please enter your name as it appears on your ID" />
            </Form.Item>

            {(currentQuestionType === 'CHECKBOX') && (
                <Form.Item label="Options for Checkbox">
                    <Form.List name={[field.name, 'options']}>
                        {(subFields, subOpt) => (
                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                                {subFields.map(subField => (
                                    <Space key={subField.key} align="baseline">
                                        <Form.Item
                                            noStyle
                                            name={[subField.name, 'label']}
                                            rules={[{ required: true, message: 'Option label is required' }]}
                                        >
                                            <Input placeholder="Option Label" style={{ width: 'calc(100% - 30px)' }} />
                                        </Form.Item>
                                        <Tooltip title="Remove Option">
                                            <Button
                                                type="text"
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => subOpt.remove(subField.name)}
                                            />
                                        </Tooltip>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => subOpt.add()} block icon={<PlusOutlined />}>
                                    Add Option
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Form.Item>
            )}
            
            <Form.Item
                name={[field.name, 'isRequired']}
                valuePropName="checked"
            >
                <Checkbox>Is this question required?</Checkbox>
            </Form.Item>
        </Card>
    );
}

export default QuestionItem;