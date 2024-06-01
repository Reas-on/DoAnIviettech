import React, { useState } from "react";
import OrderInfoStep from "./Steps/OrderInfoStep";
import RecipientInfoStep from "./Steps/RecipientInfoStep";
import PaymentResultStep from "./Result/PaymentResultStep";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  selectCartItems,
  selectTotalCartAmount,
} from "../../Redux/ShopSlice";

const OnlinePayment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector(selectAllProducts);
  const [recipientInfo, setRecipientInfo] = useState({});
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
          totalCartAmount={totalCartAmount}
          cartItems={cartItems}
          allProducts={allProducts}
          recipientInfo={recipientInfo}
          onNext={nextStep}
        />
      )}
      {currentStep === 3 && (
        <PaymentResultStep
          recipientInfo={recipientInfo}
        />
      )}
    </div>
  );
};

export default OnlinePayment;
