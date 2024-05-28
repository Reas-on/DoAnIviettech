// src/Components/OnlinePayment/OnlineZaloPay.jsx
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { checkZaloPayment, createZaloPayment } from "../../Api/ZaloPayApi"; 
import { selectTotalCartAmount } from "../../Redux/ShopSlice";
import { useSelector } from "react-redux";
import OrderInfoStep from "./ZaloPay/OrderInfoStep";
import RecipientInfoStep from "./ZaloPay/RecipientInfoStep";
import PaymentResultStep from "./ZaloPay/PaymentResultStep";

const OnlineZaloPay = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderInfo, setOrderInfo] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({});
  const totalCartAmount = useSelector(selectTotalCartAmount);

  useEffect(() => {
    const handleZaloPayCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      if (status === "1") {
        try {
          const orderId = params.get("apptransid"); 
          console.log("Order ID:", orderId); 

          const transactionData = await checkZaloPayment(orderId);
          console.log("Transaction data:", transactionData); 

          if (transactionData.return_code === 1) {
            setTransactionInfo({
              transactionId: orderId, 
              amount: transactionData.amount,
              timestamp: new Date(transactionData.server_time).toLocaleString(),
            });
            setCurrentStep(3);
          } else {
            message.error("Giao dịch không thành công");
          }
        } catch (error) {
          console.error("Error fetching transaction information:", error);
          message.error("Có lỗi xảy ra khi lấy thông tin giao dịch!");
        }
      }
      if (status === "-49") {
        message.error("Thanh toán đã bị huỷ");
      }
      if (status === "-217") {
        message.error("[UserAndSystem] Thanh toán thất bại");
      }
    };

    handleZaloPayCallback();
  }, []);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      <h1>OnlineZaloPay</h1>
      {currentStep === 1 && (
        <OrderInfoStep
          totalCartAmount={totalCartAmount}
          onNext={nextStep}
          setOrderInfo={setOrderInfo}
        />
      )}
      {currentStep === 2 && (
        <RecipientInfoStep
          onPrev={prevStep}
          onNext={nextStep}
          createZaloPayment={createZaloPayment}
          orderInfo={orderInfo}
        />
      )}
      {currentStep === 3 && (
        <PaymentResultStep transactionInfo={transactionInfo} />
      )}
    </div>
  );
};

export default OnlineZaloPay;
