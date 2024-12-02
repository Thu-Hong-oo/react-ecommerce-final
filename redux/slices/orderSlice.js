import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    selectedItems: [], // Danh sách các sản phẩm đã chọn cho đơn hàng
    totalPrice: 0, // Tổng giá trị đơn hàng
    voucher: null, // Giá trị giảm giá
    finalPrice: 0, // Giá trị cuối cùng sau khi giảm giá
    paymentMethod: null,
  },
  reducers: {
    // Action to remove purchased items
    removePurchasedItems(state, action) {
      const purchasedProductIds = action.payload;
      state.selectedItems = state.selectedItems.filter(
        (item) => !purchasedProductIds.includes(item.id)
      );
    },

    setSelectedItems(state, action) {
      state.selectedItems = action.payload; // Lưu danh sách sản phẩm đã chọn
    },
    setTotalPrice(state, action) {
      state.totalPrice = action.payload; // Cập nhật totalPrice
    },
    setVoucher(state, action) {
      state.voucher = action.payload;
    },
    setFinalPrice(state, action) {
      state.finalPrice = action.payload; // Cập nhật finalPrice
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload; // Cập nhật paymentMethod
    },
    buyNow(state, action) {
      const product = action.payload; // Nhận sản phẩm từ action
      state.selectedItems = [product]; // Đặt sản phẩm đã mua ngay vào selectedItems
      state.totalPrice = product.price; // Cập nhật tổng giá trị đơn hàng
    },
  },
});

// Xuất các action để sử dụng trong các component
export const {
  setSelectedItems,
  setTotalPrice,
  setVoucher,
  setFinalPrice,
  setPaymentMethod,
  removePurchasedItems,
  buyNow, // Xuất action buyNow
} = orderSlice.actions;

// Xuất reducer để sử dụng trong store
export default orderSlice.reducer;
