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
        <Descriptions title="Order details" bordered>
          <Descriptions.Item label="Total amount" span={3}>
            {(totalCartAmount || 0).toLocaleString("en-US")} VND
          </Descriptions.Item>
          <Descriptions.Item label="Number of items" span={3}>
            {cartItems && cartItems.length} items
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
                    description={`Quantity: ${item.quantity} Size: ${
                      item.size
                    } - Price: ${(product?.new_price || 0).toLocaleString(
                      "en-US"
                    )} VND  Total: ${(
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
            Back
          </Button>
          <Button type="primary" htmlType="submit">
            Continue
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecipientInfoStep;
