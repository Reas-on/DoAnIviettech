import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Shop from "./Pages/Shop";
// User
import Profile from "./Components/Profile/Profile";
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import OrderCart from "./Components/OrderCart/OrderCart";
import MainLayout from "./layouts/MainLayout";
import PaymentSuccess from "./Pages/PaymentSuccess";
import TestPayment from "./Pages/TestPayment";
import OnlineMomoPayment from "./Components/OnlinePayment/OnlineMoMo";
import OnlineZaloPay from "./Components/OnlinePayment/OnlineZaloPay";
// Admin
import AdminLayout from "./layouts/AdminLayout";
import Payment from "./Pages/TestPayment";
import DashBoard from "./layouts/AdminLayout/DashBoard/DashBoard";
import AddProduct from "./layouts/AdminLayout/AddProduct/AddProduct";
import ListProduct from "./layouts/AdminLayout/ListProduct/ListProduct";
import ProductData from "./layouts/AdminLayout/ProductData/ProductData";
import UserData from "./layouts/AdminLayout/UserData/UserData";
import OrderData from "./layouts/AdminLayout/OrderData/OrderData";
import AddUser from "./layouts/AdminLayout/AddUser/AddUser";
import FindUser from "./layouts/AdminLayout/FindUser/FindUser";
import ConfirmOrders from "./layouts/AdminLayout/OrderData/ConfirmOrders";
import OrderDetail from "./layouts/AdminLayout/OrderDetail/OrderDetail";
import CancelOrders from "./layouts/AdminLayout/OrderData/CancelOrders";
import CompletedOrders from "./layouts/AdminLayout/OrderData/CompletedOrders";
import DeliveringOrders from "./layouts/AdminLayout/OrderData/DeliveringOrders";
import ShippedOrders from "./layouts/AdminLayout/OrderData/ShippedOrders";
import Vouchers from "./layouts/AdminLayout/Vouchers/Vouchers";

import { useDispatch } from "react-redux";
import { fetchCartItems } from "./Redux/Thunk/fetchCartItems";
import { fetchAllProducts } from "./Redux/Thunk/fetchAllProducts";
import { useEffect } from "react";
import CheckOrder from "./Components/CheckOrder/CheckOrder";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCartItems());
  }, [dispatch]);


  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Shop />} />
            <Route
              path="/mens"
              element={<ShopCategory banner={men_banner} category="men" />}
            />
            <Route
              path="/womans"
              element={<ShopCategory banner={women_banner} category="women" />}
            />
            <Route
              path="/kids"
              element={<ShopCategory banner={kid_banner} category="kid" />}
            />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/OrderCart" element={<OrderCart />} />
            <Route path="/CheckOrder" element={<CheckOrder />} />
            <Route path="/payment-momo" element={<PaymentSuccess />} />
            <Route path="/testpayment" element={<TestPayment />} />
            <Route
              path="/online-payment/momo"
              element={<OnlineMomoPayment />}
            />
            <Route path="/online-payment/zalopay" element={<OnlineZaloPay />} />
          </Route>
          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="/admin/DashBoard" element={<DashBoard />} />
            <Route path="/admin/AddUser" element={<AddUser />} />
            <Route path="/admin/Userdata" element={<UserData />} />
            <Route path="/admin/FindUser" element={<FindUser />} />
            <Route path="/admin/Addproduct" element={<AddProduct />} />
            <Route path="/admin/Listproduct" element={<ListProduct />} />
            <Route path="/admin/ListProduct/:id" element={<ProductData />} />
            <Route path="/admin/AllOrders" element={<OrderData />} />
            <Route
              path="/admin/AllOrders/:orderNumber"
              element={<OrderDetail />}
            />
            <Route path="/admin/ConfirmOrders" element={<ConfirmOrders />} />
            <Route path="/admin/CancelOrders" element={<CancelOrders />} />
            <Route
              path="/admin/CompletedOrders"
              element={<CompletedOrders />}
            />
            <Route
              path="/admin/DeliveringOrders"
              element={<DeliveringOrders />}
            />
            <Route path="/admin/ShippedOrders" element={<ShippedOrders />} />
            <Route path="/admin/Vouchers" element={<Vouchers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
