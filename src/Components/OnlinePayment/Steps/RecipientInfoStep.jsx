import { Form, Button, Descriptions, List, Select } from "antd";
const { Option } = Select;

const RecipientInfoStep = ({ onPrev,onNext, totalCartAmount, cartItems, allProducts }) => {
  const handlePayment = async (values) => {
    onNext();
  };

  const getProductDetails = (productId) => {
    return allProducts.find((product) => product.id === productId);
  };


  return (
    <div>
      <Form
        layout="vertical"
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginTop: "20px",
        }}
        onFinish={handlePayment}
      >
        <Descriptions title="Thông Tin Đơn Hàng" bordered>
          <Descriptions.Item label="Tổng tiền" span={3}>
            {(totalCartAmount || 0).toLocaleString("en-US")} VND
          </Descriptions.Item>
          <Descriptions.Item label="Số Lượng" span={3}>
            {cartItems && cartItems.length} Sản Phẩm
          </Descriptions.Item>
        </Descriptions>
        {cartItems && (
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => {
              const product = getProductDetails(item.productId);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img
                        src={product?.image || ""}
                        alt={product?.name || "Unknown"}
                        style={{ width: 50 }}
                      />
                    }
                    title={product?.name || "Unknown"}
                    description={`Số lượng: ${item.quantity} Size: ${
                      item.size
                    } - Giá: ${(product?.new_price || 0).toLocaleString(
                      "en-US"
                    )} VND  Tổng giá: ${(
                      (product?.new_price || 0) * item.quantity
                    ).toLocaleString("en-US")} VND`}
                  />
                </List.Item>
              );
            }}
          />
        )}
        <Form.Item>
          <Button onClick={onPrev} style={{ marginRight: "10px" }}>
            Quay Lại
          </Button>
          <Button type="primary" htmlType="submit">
            Đặt Hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecipientInfoStep;
