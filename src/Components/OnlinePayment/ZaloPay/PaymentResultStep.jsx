// src/Components/OnlinePayment/ZaloPay/PaymentResultStep.jsx
import React from "react";

const PaymentResultStep = ({ transactionInfo }) => {
  return (
    <div>
      <h2>Step 3: Kết Quả Thanh Toán</h2>
      <p>
        <strong>Mã giao dịch:</strong> {transactionInfo.transactionId}
      </p>
      <p>
        <strong>Số tiền đã thanh toán:</strong> {transactionInfo.amount}
      </p>
      <p>
        <strong>Thời gian:</strong> {transactionInfo.timestamp}
      </p>
      <p>
        <strong>Thanh toán thành công!</strong>
      </p>
    </div>
  );
};

export default PaymentResultStep;
