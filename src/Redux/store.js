import { configureStore } from "@reduxjs/toolkit";
import shopReducer from "./ShopSlice";
import adminReducer from "./AdminSlice";
const store = configureStore({
  reducer: {
    shop: shopReducer,
    admin: adminReducer,
  },
});

export default store;
