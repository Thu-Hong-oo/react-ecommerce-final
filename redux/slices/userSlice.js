import { createSlice } from "@reduxjs/toolkit";

// Trạng thái ban đầu
const initialState = {
  user: null, // Nếu chưa có người dùng, sẽ là null
  status: "idle",
};

// Slice cho người dùng
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Cập nhật thông tin người dùng
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Gộp thông tin mới vào thông tin hiện tại
      }
    },
    logout: (state) => {
      state.user = null; // Xóa thông tin người dùng
    },
  },
});

export const { setUser, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;
