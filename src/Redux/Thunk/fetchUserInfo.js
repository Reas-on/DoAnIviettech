import { createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunk để fetch thông tin người dùng
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (authToken) => {
    try {
      const response = await fetch("http://localhost:4000/api/profile", {
        method: "GET",
        headers: {
          "auth-token": authToken,
        },
      });
      const data = await response.json();
      const userInfoWithAddress = {
        ...data,
        address: {
          province: data.address.province,
          district: data.address.district,
          ward: data.address.ward
        }
      };
      return userInfoWithAddress;
    } catch (error) {
      throw Error("Error fetching user info:", error);
    }
  }
);
