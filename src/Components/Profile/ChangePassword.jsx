import { Button, Form, Input, message } from "antd";

const ChangePassword = ({ handleSave }) => {
    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmNewPassword) {
            message.error("New password and confirm new password do not match");
            return;
        }
        if (values.currentPassword === values.newPassword) {
            message.error("New password cannot be the same as current password");
            return;
        }

        try {
            const response = await fetch('https://kiemhieptinhduyen.one/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update password');
            }

            message.success('Password updated successfully');
            handleSave();
        } catch (error) {
            message.error(error.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            <h2>Change Password</h2>
            <Form
                className="row mt-5"
                name="change_password"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    className="col-6"
                    label="Current Password"
                    name="currentPassword"
                    rules={[
                        {
                            required: true,
                            message: "Please input your current password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    className="col-6"
                    label="New Password"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: "Please input your new password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    className="col-6"
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your new password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item className="col-12 d-flex justify-content-center">
                    <Button type="primary" htmlType="submit">
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ChangePassword;
