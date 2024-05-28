import { Descriptions } from "antd";

const MyProfile = ({userInfo}) => {
    console.log(userInfo);
    return (
        <>
            <h2>My Profile</h2>
            <div>
                <Descriptions  bordered>
                    <Descriptions.Item label="ID" span={3}>
                        {userInfo?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Name" span={3}>
                        {userInfo?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={3}>
                        {userInfo?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={3}>
                        {userInfo?.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone" span={3}>
                        {userInfo?.phone}
                    </Descriptions.Item>
                    
                </Descriptions>
            </div>
        </>
    );
};
 
export default MyProfile;