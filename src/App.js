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

import { useDispatch } from "react-redux";
import { fetchCartItems } from "./Redux/Thunk/fetchCartItems";
import { fetchAllProducts } from "./Redux/Thunk/fetchAllProducts";
import { useEffect } from "react";
import ConfirmOrders from "./layouts/AdminLayout/OrderData/ConfirmOrders";

import PaymentSuccess from "./Pages/PaymentSuccess";
import TestPayment from "./Pages/TestPayment";
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
            <Route path="/payment" element={<Payment/>}/>
            <Route path="/OrderCart" element={<OrderCart />} />
            <Route path="/payment-momo" element={<PaymentSuccess />} />
            <Route path="/testpayment" element={<TestPayment />} />
          </Route>
          {/* Admin */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="/admin/DashBoard" element={<DashBoard />} />
            <Route path="/admin/AddUser" element={<AddUser />} />
            <Route path="/admin/Userdata" element={<UserData />} />
            <Route path="/admin/FindUser" element={<FindUser />} />
            <Route path="/admin/Addproduct" element={<AddProduct />} />
            <Route path="/admin/Listproduct" element={<ListProduct />} />
            <Route
              path="/admin/ListProduct/:id"
              element={<ProductData />}
            />
            <Route path="/admin/AllOrders" element={<OrderData />} />
            <Route path="/admin/AllOrders/:orderId" element={<OrderDetail />} />
            <Route path="/admin/ConfirmOrders" element={<ConfirmOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;