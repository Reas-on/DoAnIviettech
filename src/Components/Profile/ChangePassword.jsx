import { Button, Form, Input, message } from "antd";

const ChangePassword = ({ userInfo, handleSave }) => {
    const onFinish = async (values) => {
        if (values.password !== values.confirmNewPassword) {
            message.error("New password and confirm new password do not match");
            return;
        }
        if (values.currentPassword === values.password) {
            message.error(
                "New password cannot be the same as current password"
            );
            return;
        }
        if (userInfo?.password !== values.currentPassword) {
            message.error("Current password is incorrect");
            return;
        }

        // Save the updated password

        handleSave({password: values.password });
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
                    name="password"
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
