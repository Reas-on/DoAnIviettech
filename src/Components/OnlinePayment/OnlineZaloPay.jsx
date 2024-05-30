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
import axios from "axios";

const OnlineZaloPay = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderInfo, setOrderInfo] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({});
  const [recipientInfo, setRecipientInfo] = useState({});
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector(selectAllProducts);

  const postOrderData = useCallback(async (recipientInfo) => {
    try {
      if (!recipientInfo) {
        throw new Error("Recipient information is missing.");
      }

      const orderedProducts = cartItems.map((cartItem) => {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        return {
          name: `[ Size : ${cartItem.size} ] ${product.name}`,
          image: product.image,
          quantity: cartItem.quantity,
          total: product.new_price * cartItem.quantity,
        };
      });

      const formData = {
        receiverName: recipientInfo.fullName,
        deliveryAddress: recipientInfo.address,
        phoneNumber: recipientInfo.phoneNumber,
        email: recipientInfo.email,
        note: recipientInfo.note,
        orderedProducts: orderedProducts,
        PaymentMethodChangeEvent: "ZALOPAY",
        totalBill: totalCartAmount,
        status: "pending",
      };

      const response = await axios.post("http://localhost:4000/orderData", formData);
      console.log("OrderData:", response.data);
      return response.data; 
    } catch (error) {
      console.error("Error posting order data:", error);
      throw error;
    }
  }, [cartItems, allProducts, totalCartAmount]);
  
  useEffect(() => {
    const handleZaloPayCallback = async () => {
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
            await resetCart();
            const savedRecipientInfo = JSON.parse(localStorage.getItem("recipientInfo"));
            setRecipientInfo(savedRecipientInfo);
            const newOrderInfo = await postOrderData(savedRecipientInfo);
            setOrderInfo(newOrderInfo);
          } else {
            message.error("Giao dịch không thành công");
          }
        } catch (error) {
        }
      } else if (status === "-49") {
        message.error("Thanh toán đã bị hủy");
      } else if (status === "-217") {
        message.error("[UserAndSystem] Thanh toán thất bại ");
      }
    };
    handleZaloPayCallback();
  }, []); 

  const resetCart = async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (authToken) {
        await fetch("http://localhost:4000/api/cartreset", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });
        console.log("Cart reset successful");
      } else {
        localStorage.removeItem("cartItems");
        console.error("User data not found in localStorage.");
      }
    } catch (error) {
      console.error("Error resetting cart:", error);
    }
  };

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
          setOrderInfo={setOrderInfo}
        />
      )}
      {currentStep === 3 && (
        <PaymentResultStep 
          transactionInfo={transactionInfo} 
          recipientInfo={recipientInfo} 
          orderInfo={orderInfo} 
        />
      )}
    </div>
  );
};

export default OnlineZaloPay;
