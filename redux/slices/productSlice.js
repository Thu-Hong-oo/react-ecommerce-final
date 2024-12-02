// productSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo slice cho trạng thái sản phẩm
export const productSlice = createSlice({
  name: "product",
  initialState: {
    selectedProduct: null,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

// Export các action và reducer
export const { setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
