import { Modal, Form, Input, Checkbox, Select, Button, Space } from "antd";
import { useState, useEffect } from "react";
const { Option } = Select;

const SaleForceModal = ({ isModalOpen, onCancel, onSubmit, initialFormData }) => {
    const [form] = Form.useForm();
    const [isCompany, setIsCompany] = useState(false);

    useEffect(() => {
        if (isModalOpen && initialFormData) {
            form.setFieldsValue(initialFormData);
            setIsCompany(!!initialFormData.companyName);
        } else if (!isModalOpen) {
            form.resetFields();
            setIsCompany(false);
        }
    }, [isModalOpen, initialFormData, form]);

    const handleFormFinish = (values) => {
        const accountData = {
            accountType: isCompany ? 'company' : 'generic',
            account: isCompany ? {
                name: values.companyName,
                industry: values.industry || null,
            } : {},
            contact: {
                firstName: values.firstName, 
                lastName: values.lastName,   
                email: values.email, 
                jobTitle: values.jobTitle,
                phoneNumber: values.phoneNumber,
                specificInterests: (values.specificInterests || []).join(';')
            },
        };
        onSubmit(accountData); 
    };

    const handleCompanyCheckboxChange = (e) => {
        setIsCompany(e.target.checked);
        if (!e.target.checked) {
            form.setFieldsValue({ companyName: undefined, industry: undefined });
        }
    };

    const predefinedInterests = [
        { label: 'Interested in Advanced Template Creation / Design', value: 'Interested in Advanced Template Creation / Design' },
        { label: 'Form Analytics & Reporting', value: 'Form Analytics & Reporting' },
        { label: 'Collaboration & Team Features', value: 'Collaboration & Team Features' },
        { label: 'Using Pre-built Templates / Efficiency', value: 'Using Pre-built Templates / Efficiency' },
        { label: 'Updates on New Form Types (e.g., Surveys, Quizzes)', value: 'Updates on New Form Types (e.g., Surveys, Quizzes)' },
    ];

    return (
        <Modal
            title="Sync data with SalesForce"
            open={isModalOpen} 
            onCancel={onCancel}
            footer={null} 
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormFinish}
                initialValues={initialFormData}
            >
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="isCompany" valuePropName="checked">
                    <Checkbox onChange={handleCompanyCheckboxChange}>
                        Is this user associated with a company?
                    </Checkbox>
                </Form.Item>

                {isCompany && (
                    <>
                        <Form.Item label="Company Name" name="companyName" rules={[{ required: isCompany, message: 'Please input company name!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Industry" name="industry">
                            <Input /> 
                        </Form.Item>
                    </>
                )}

                <Form.Item label="Job Title" name="jobTitle">
                    <Input />
                </Form.Item>
                <Form.Item label="Phone Number" name="phoneNumber">
                    <Input />
                </Form.Item>

                <Form.Item label="Specific Interests" name="specificInterests">
                    <Select mode="multiple" placeholder="Select interests">
                        {predefinedInterests.map(interest => (
                            <Option key={interest.value} value={interest.value}>
                                {interest.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Sync Data
                        </Button>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SaleForceModal;