import React, { useState } from 'react';
import { Button, message, Steps, } from 'antd';
import PaymentForm from '../Components/PaymentForm/PaymentForm';
// import CartItems from '../Components/CartItems/CartItems';
import HandleOrder from '../Components/HandleOrder/HandleOrder'
const { Step } = Steps;

const steps = [
  {
    title: 'Order Information',
    content: <HandleOrder/>,
  },
  {
    title: 'Recipient Information',
    content: <PaymentForm />,
  },
  {
    title: 'Order Confirmation',
    content: 'Last-content',
  },
];

// const FirstForm = () => {
//   const onFinish = (values) => {
//     console.log('Received values:', values);
//   };

//   return (
//     <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
//       <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
//         <Input />
//       </Form.Item>

//       <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
//         <Input.Password />
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

const Payment = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    marginTop: 16,
  };

  const stepsStyle = {
    marginTop: 50,
    maxWidth: '80%', 
    margin: '0 auto', 
  };
  

  return (
    <>
      <div style={stepsStyle}>
        <Steps current={current} size="default">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default Payment;
