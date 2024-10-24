import React from 'react';
import { login } from '../util/APIUtils';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// Typy dla propsów
interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="login-container">
            <h1 className="page-title">Login</h1>
            <div className="login-content">
                <LoginForm onLogin={onLogin} />
            </div>
        </div>
    );
};

const LoginForm: React.FC<LoginProps> = ({ onLogin }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values: { login: string; password: string }) => {
        try {
            const loginRequest = { ...values };
            const response = await login(loginRequest);
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            onLogin();
            navigate('/');
        } catch (error: any) {
            if (error.status === 401) {
                notification.error({
                    message: 'Polling XxxApp',
                    description: 'Your Username or Password is incorrect. Please try again!',
                });
            } else {
                notification.error({
                    message: 'Polling XxxApp',
                    description: error.message || 'Sorry! Something went wrong. Please try again!',
                });
            }
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            className="login-form"
        >
            <Form.Item
                name="login"
                rules={[{ required: true, message: 'Please input your login!' }]}
            >
                <Input
                    prefix={<UserOutlined />}
                    size="large"
                    placeholder="Login"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input
                    prefix={<LockOutlined />}
                    size="large"
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="login-form-button">
                    Login
                </Button>
                Or <Link to="/signup">register now!</Link>
            </Form.Item>
        </Form>
    );
};

export default Login;
