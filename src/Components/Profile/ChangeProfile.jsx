import { Button, Divider, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangeProfile = ({ userInfo, setUserInfo, handleSave }) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [provinceNames, setProvinceNames] = useState({});
    const [districtNames, setDistrictNames] = useState({});
    const [wardNames, setWardNames] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const initData = async () => {
            form.setFieldsValue(userInfo);
            let list_provinces = await fetchProvinces();
            let address_data = userInfo.address;
            if (address_data) {
                let addressArray = address_data.split(",");
                let address = addressArray[0];
                let ward = addressArray[1];
                let district = addressArray[2];
                let province = addressArray[3];

                let provinceCode = list_provinces[province];
                let list_districts = await fetchDistricts(provinceCode);
                let districtCode = list_districts[district];
                let list_wards = await fetchWards(districtCode);

                let wardCode = list_wards[ward];
                form.setFieldsValue({
                    address_infor: address,
                    ward: wardCode,
                    district: districtCode,
                    province: provinceCode,
                });
            }
        };

        initData();
    }, []);
    const fetchProvinces = async () => {
        try {
            const response = await fetch(
                "https://vapi.vnappmob.com/api/province/"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch provinces");
            }
            const data = await response.json();
            setProvinces(data.results);
            const names = {};
            const codes = {};
            data.results.forEach((province) => {
                names[province.province_id] = province.province_name;
                codes[province.province_name] = province.province_id;
            });
            setProvinceNames(names);
            return codes;
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(
                `https://vapi.vnappmob.com/api/province/district/${provinceId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch districts");
            }
            const data = await response.json();
            setDistricts(data.results);
            const names = {};
            let codes = {};
            data.results.forEach((district) => {
                names[district.district_id] = district.district_name;
                codes[district.district_name] = district.district_id;
            });
            setDistrictNames(names);
            form.setFieldValue("district", null);
            form.setFieldValue("ward", null);
            return codes;
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        form.setFieldValue("ward", null);
        try {
            const response = await fetch(
                `https://vapi.vnappmob.com/api/province/ward/${districtId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch wards");
            }
            const data = await response.json();
            setWards(data.results);
            const names = {};
            let codes = {};
            data.results.forEach((ward) => {
                names[ward.ward_id] = ward.ward_name;
                codes[ward.ward_name] = ward.ward_id;
            });
            setWardNames(names);
            return codes;
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const onFinish = async () => {
        const formData = form.getFieldsValue();
        formData["address"] = `${formData.address_infor},${
            wardNames[formData.ward]
        },${districtNames[formData.district]},${
            provinceNames[formData.province]
        }`;
        handleSave(formData);
    };
    return (
        <>
            <h2>Change Profile</h2>
            <div>
                <Form
                    form={form}
                    layout="vertical"
                    className="row mt-5"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        className="col-6"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        className="col-6"
                        label="Email"
                    >
                        <Input disabled style={{cursor: 'not-allowed' }}/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        className="col-6"
                        label="Phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your phone",
                            },
                        ]}
                    >
                        <Input value={userInfo?.phone} />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        className="col-6"
                        label="Province"
                        name="province"
                        rules={[
                            {
                                required: true,
                                message: "Please select a province",
                            },
                        ]}
                    >
                        <Select onChange={(value) => fetchDistricts(value)}>
                            {provinces.map((province) => (
                                <Option
                                    key={province.province_id}
                                    value={province.province_id}
                                >
                                    {province.province_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        className="col-6"
                        label="District"
                        name="district"
                        rules={[
                            {
                                required: true,
                                message: "Please select a district",
                            },
                        ]}
                    >
                        <Select onChange={(value) => fetchWards(value)}>
                            {districts.map((district) => (
                                <Option
                                    key={district.district_id}
                                    value={district.district_id}
                                >
                                    {district.district_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        className="col-6"
                        label="Ward"
                        name="ward"
                        rules={[
                            { required: true, message: "Please select a ward" },
                        ]}
                    >
                        <Select>
                            {wards.map((ward) => (
                                <Option key={ward.ward_id} value={ward.ward_id}>
                                    {ward.ward_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="col-6"
                        label="Address"
                        name="address_infor"
                        rules={[
                            {
                                required: true,
                                message: "Please input your address",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item className="d-flex justify-content-center">
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default ChangeProfile;
