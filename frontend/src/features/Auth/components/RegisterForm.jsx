import { Card, Typography, Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";

const {Title, Text} = Typography;

const RegisterForm = () => {
    const [form] = Form.useForm();
    const { register, isRegistering } = useAuth();

    const onFinish = async (values) => {
        try {
            await register(values); 
            form.resetFields(); 
        } catch (error) {
            console.error("Form level error during registration:", error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please correct the highlighted form errors.');
    };

    return (
        <Card
            style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                width: "100%",
                maxWidth: "450px",
                margin: "0 auto",
            }}
        >
            <Title level={2} style={{ textAlign: "center", marginBottom: "0px" }}>
                Templator
            </Title>
            <Title
                level={4}
                style={{
                    textAlign: "center",
                    color: "#888",
                    marginTop: "5px",
                    marginBottom: "30px",
                }}
            >
                Create your account
            </Title>
            <Form
                form={form}
                name="register"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                scrollToFirstError
            >
                <Form.Item
                    name="firstName"
                    label="Name"
                    rules={[
                        { required: true, message: "Please input your Name!" },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Joe"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                        { required: true, message: "Please input your Last name!" },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Doe"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Please input your Email!" },
                        { type: "email", message: "The input is not a valid E-mail!" },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined className="site-form-item-icon" />}
                        placeholder="email@example.com"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: "Please input your Password!" },
                        { min: 8, message: "Password must be at least 8 characters long." },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="••••••••"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Please confirm your Password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("The two passwords that you entered do not match!")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="••••••••"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        style={{ marginTop: "20px" }}
                        loading={isRegistering}
                    >
                        Register
                    </Button>
                </Form.Item>

                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <Text>Already have an account? </Text>
                    <a href="/login">Login here!</a>
                </div>
            </Form>
        </Card>
    );
};

export default RegisterForm;
