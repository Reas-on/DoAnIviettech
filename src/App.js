import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Shop from "./Pages/Shop";
import Profile from "./Components/Profile/Profile";
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import MainLayout from "./layouts/MainLayout";
// Admin
import AdminLayout from "./layouts/AdminLayout";
import DashBoard from "./Components/DashBoard/DashBoard";
import Payment from "./Pages/Payment";
import AddProduct from "./Components/AddProduct/AddProduct";
import ListProduct from "./Components/ListProduct/ListProduct";
import ProductData from "./Components/ProductData/ProductData";
import UserData from "./Components/UserData/UserData";

import { useDispatch } from "react-redux";
import { fetchCartItems } from "./Redux/Thunk/fetchCartItems";
import { fetchAllProducts } from "./Redux/Thunk/fetchAllProducts";
import { useEffect } from "react";
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
          </Route>
          {/* Admin */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashBoard/>} />
           <Route path='/admin/Addproduct' element={<AddProduct />} />
           <Route path='/admin/Listproduct' element={<ListProduct />} />
           <Route path='/admin/ListProduct/:id' element={<ProductData />} />
           <Route path='/admin/Userdata' element={<UserData />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
