import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (authToken) => {
    try {
      const response = await fetch("https://kiemhieptinhduyen.one/api/profile", {
        method: "GET",
        headers: {
          "auth-token": authToken,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw Error("Error fetching user info:", error);
    }
  }
);