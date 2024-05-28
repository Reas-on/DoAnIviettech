import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo } from "./Thunk/fetchUserInfo";
import { addToCart } from "./Thunk/addToCart"; 
import { removeFromCart } from "./Thunk/removeFromCart";
import { fetchAllProducts } from "./Thunk/fetchAllProducts";
import { fetchCartItems } from "./Thunk/fetchCartItems";
import { loginUser } from "./Thunk/login";
import { signupUser } from "./Thunk/signup";

export const getDefaultCart = () => {
  let cart = {};
  for (let i = 1; i <= 300; i++) {
    cart[i] = 0;
  }
  return cart;
};

const initialState = {
  allProducts: [],
  cartItems: [],
  user: {
    name: '',
    address: '',
    phone: '',
    email: '', 
    isAdmin: false,
  },
  status: 'idle',
  error: null,
  userInfo: null,
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
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { items } = action.payload;
        if (items && items.length > 0) { 
          items.forEach((item) => {
            const { productId } = item; 
            state.cartItems[productId] += 1; 
          });
        }
      })           
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId, size, quantity } = action.payload;
        const itemToRemove = state.cartItems.find(
          (item) => item.productId === productId && item.size === size && item.quantity === quantity
        );
        if (itemToRemove) {
          if (itemToRemove.quantity > 1) {
            itemToRemove.quantity -= 1;
          } else {
            state.cartItems = state.cartItems.filter(
              (item) => !(item.productId === productId && item.size === size && item.quantity === 1)
            );
          }
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
        state.user.email = action.payload.email;
        state.user.isAdmin = action.payload.isAdmin;
        state.isAdmin = action.payload.isAdmin;
        state.userInfo = action.payload;
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
export const selectUserAddress = (state) => state.shop.user.address;
export const selectUserPhone = (state) => state.shop.user.phone;
export const selectUserEmail = (state) => state.shop.user.email;
export const selectIsAdmin = (state) => state.shop.user.isAdmin;
export const selectAllProducts = (state) => state.shop.allProducts;
export const selectCartItems = (state) => state.shop.cartItems;
export const selectIsLoggedIn = (state) => state.shop.isLoggedIn; 
export const selectUserId = (state) => state.shop.user.userId;

export const selectTotalCartItems = (state) => {
  let totalItems = 0;
  const cartItems = state.shop.cartItems;
  if (Array.isArray(cartItems)) {
    cartItems.forEach(item => {
      totalItems += item.quantity;
    });
  } else {
    for (const itemId in cartItems) {
      if (Object.hasOwnProperty.call(cartItems, itemId)) {
        totalItems += cartItems[itemId].quantity;
      }
    }
  }
  return totalItems;
};


export const selectTotalCartAmount = (state) => {
  let totalAmount = 0;
  const productMap = {};
  state.shop.allProducts.forEach((product) => {
    productMap[product.id] = product;
  });
  for (const itemId in state.shop.cartItems) {
    if (state.shop.cartItems.hasOwnProperty(itemId)) {
      const item = state.shop.cartItems[itemId];
      const productId = item.productId;
      const quantity = item.quantity;
      const product = productMap[productId];
      if (quantity > 0 && product && product.new_price) {
        totalAmount += quantity * product.new_price;
      }
    }
  }
  return totalAmount;
};

export default shopSlice.reducer;