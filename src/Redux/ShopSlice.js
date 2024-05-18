import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo } from "./Thunk/fetchUserInfo";
import { addToCart } from "./Thunk/addToCart"; 
import { removeFromCart } from "./Thunk/removeFromCart";
import { fetchAllProducts } from "./Thunk/fetchAllProducts";
import { fetchCartItems } from "./Thunk/fetchCartItems";
import { loginUser } from "./Thunk/login";
import { signupUser } from "./Thunk/signup";

const getDefaultCart = () => {
  let cart = {};
  for (let i = 1; i <= 300; i++) {
    cart[i] = 0;
  }
  return cart;
};

const initialState = {
  allProducts: [],
  cartItems: getDefaultCart(),
  user: {
    name: '',
    address: '',
    phone: '',
    isAdmin: false,
  },
  status: 'idle',
  error: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems[action.payload] += 1;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const itemId = action.payload;
        if (state.cartItems[itemId] > 0) {
          state.cartItems[itemId] -= 1;
        }
      })
      .addCase(loginUser.fulfilled, (state) => { 
        state.status = "succeeded";
        state.isLoggedIn = true; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload; 
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.name;
        state.user.address = action.payload.address;
        state.user.phone = action.payload.phone;
        state.user.isAdmin = action.payload.isAdmin;
        state.isAdmin = action.payload.isAdmin; 
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addMatcher(
        (action) =>
          action.type === addToCart.rejected.type ||
          action.type === removeFromCart.rejected.type,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const selectUserName = (state) => state.shop.user.name;
export const selectIsAdmin = (state) => state.shop.user.isAdmin;
export const selectAllProducts = (state) => state.shop.allProducts;
export const selectCartItems = (state) => state.shop.cartItems;
export const selectIsLoggedIn = (state) => state.shop.isLoggedIn; 

export const selectTotalCartItems = (state) => {
  let totalItems = 0;
  for (const item in state.shop.cartItems) {
    if (state.shop.cartItems[item] > 0) {
      totalItems += state.shop.cartItems[item];
    }
  }
  return totalItems;
};

export const selectTotalCartAmount = (state) => {
  let totalAmount = 0;
  for (const item in state.shop.cartItems) {
    if (state.shop.cartItems[item] > 0) {
      let itemInfo = state.shop.allProducts.find(
        (product) => product.id === Number(item)
      );
      if (itemInfo?.new_price) {
        totalAmount += state.shop.cartItems[item] * itemInfo.new_price;
      }
    }
  }
  return totalAmount;
};

export default shopSlice.reducer;
