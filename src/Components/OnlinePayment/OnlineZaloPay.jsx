import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { checkZaloPayment, createZaloPayment } from "../../Api/ZaloPayApi";
import { useSelector } from "react-redux";
import {
  selectTotalCartAmount,
  selectCartItems,
  selectAllProducts,
} from "../../Redux/ShopSlice";
import OrderInfoStep from "./Steps/OrderInfoStep";
import RecipientInfoStep from "./Steps/RecipientInfoStepZalo";
import PaymentResultStep from "./Result/PaymentResultZaloPay";

const OnlineZaloPay = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionInfo, setTransactionInfo] = useState({});
  const [recipientInfo, setRecipientInfo] = useState({});
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector(selectAllProducts);

  const handleZaloPayCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "1") {
      try {
        const orderId = params.get("apptransid");
        const transactionData = await checkZaloPayment(orderId);
        if (transactionData.return_code === 1) {
          setTransactionInfo({
            transactionId: orderId,
            amount: transactionData.amount,
            timestamp: new Date(transactionData.server_time).toLocaleString(),
          });
          setCurrentStep(3);
        } else {
          message.error("Transaction failed.");
        }
      } catch (error) {
        console.error("Error in handleZaloPayCallback:", error);
      }
    } else if (status === "-49") {
      message.error("Payment canceled");
    } else if (status === "-217") {
      message.error("[UserAndSystem] Transaction failed.");
    }
  }, []);

  useEffect(() => {
    handleZaloPayCallback();
  }, [handleZaloPayCallback]);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div>
      {currentStep === 1 && (
        <OrderInfoStep onNext={nextStep} setRecipientInfo={setRecipientInfo} />
      )}
      {currentStep === 2 && (
        <RecipientInfoStep
          onPrev={prevStep}
          createZaloPayment={createZaloPayment}
          totalCartAmount={totalCartAmount}
          cartItems={cartItems}
          allProducts={allProducts}
          recipientInfo={recipientInfo}
        />
      )}
      {currentStep === 3 && (
        <PaymentResultStep
          transactionInfo={transactionInfo}
          recipientInfo={recipientInfo}
        />
      )}
    </div>
  );
};

export default OnlineZaloPay;
