import { createAsyncThunk } from "@reduxjs/toolkit";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch("https://kiemhieptinhduyen.one/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        throw new Error(data.errors || "Signup failed");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
