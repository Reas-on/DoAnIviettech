// Redux/admin/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addUser } from './admin/adduser'; 
const initialState = {

  users: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Xử lý action addUser
    builder.addCase(addUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users.push(action.payload); // Thêm người dùng mới vào danh sách
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload; // Lưu thông báo lỗi nếu có
    });
  },
});

export default adminSlice.reducer; 
