import { Card, Row, Col, Select, Input, Button, Space, Checkbox, Tooltip } from "antd";
import { CloseOutlined, PlusOutlined, MenuOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Option } = Select;

export const QUESTION_TYPES = {
    SINGLE_LINE_STRING: "Single Line Text",
    MULTI_LINE_TEXT: "Multi Line Text",
    NON_NEGATIVE_INTEGER: "Non-Negative Integer",
    CHECKBOX: "Checkbox"
};

const QuestionItem = ({ id, item, index, remove, isRemovable, onChange }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
    };


    return (
        <div ref={setNodeRef} style={style}>
            <Card
                size="small"
                title={`Question ${index + 1}`}
                extra={
                    <Space>
                        {isRemovable && (
                            <Tooltip title="Remove Question">
                                <Button type="text" danger icon={<CloseOutlined />} onClick={remove} />
                            </Tooltip>
                        )}
                        <Tooltip title="Drag to reorder">
                            <Button type="text" icon={<MenuOutlined />} {...attributes} {...listeners} />
                        </Tooltip>
                    </Space>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <label>Title</label>
                        <Input
                            value={item.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            placeholder="Your question title"
                            style={{ marginBottom: '0.8rem' }}
                        />
                    </Col>
                    <Col span={12}>
                        <label>Answer Type</label>
                        <Select
                            value={item.questionType}
                            onChange={(value) => onChange({ questionType: value })}
                            placeholder="Select an answer type"
                            allowClear
                            style={{ width: "100%", marginBottom: '0.8rem' }}
                        >
                            {Object.entries(QUESTION_TYPES).map(([key, label]) => (
                                <Option key={key} value={key}>{label}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <label>Description</label>
                <Input.TextArea
                    rows={2}
                    value={item.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="e.g., Please enter your name as it appears on your ID"
                    style={{ marginBottom: '0.8rem' }}
                />

                {item.questionType === 'CHECKBOX' && (
                    <>
                        <label>Options</label>
                        {(item.options || []).map((opt, idx) => (
                            <Space key={idx} style={{ display: 'flex', marginBottom: 8 }}>
                                <Input
                                    value={opt.label}
                                    onChange={(e) => {
                                        const newOptions = [...item.options];
                                        newOptions[idx].label = e.target.value;
                                        onChange({ options: newOptions });
                                    }}
                                    placeholder="Option Label"
                                />
                                <Button
                                    type="text"
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={() => {
                                        const newOptions = item.options.filter((_, i) => i !== idx);
                                        onChange({ options: newOptions });
                                    }}
                                />
                            </Space>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => onChange({
                                options: [...(item.options || []), { label: '' }]
                            })}
                            icon={<PlusOutlined />}
                            block
                        >
                            Add Option
                        </Button>
                    </>
                )}

                <Checkbox
                    checked={item.required}
                    onChange={(e) => onChange({ required: e.target.checked })}
                >
                    Is this question required?
                </Checkbox>
            </Card>
        </div>
    );
}

export default QuestionItem;