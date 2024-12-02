import { createSlice } from "@reduxjs/toolkit";
import {
  saveFavorite,
  fetchFavorites,
  removeFavorite,
} from "../../services/favoriteService";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [], // Danh sách yêu thích (chỉ chứa ID sản phẩm)
  },
  reducers: {
    setFavoriteItems: (state, action) => {
      state.items = action.payload; // Cập nhật toàn bộ danh sách yêu thích
    },
    addFavoriteItem: (state, action) => {
      const itemExists = state.items.includes(action.payload);
      if (!itemExists) {
        state.items.push(action.payload); // Thêm ID sản phẩm vào danh sách
      }
    },
    removeFavoriteItem: (state, action) => {
      state.items = state.items.filter((item) => item !== action.payload); // Xóa sản phẩm khỏi danh sách
    },
  },
});
// Thunk để lấy danh sách yêu thích từ Firestore
export const loadFavoriteItems = () => async (dispatch) => {
  const favorites = await fetchFavorites(); // Lấy danh sách từ Firestore
  dispatch(setFavoriteItems(favorites)); // Cập nhật Redux
};

export const saveProductToFavorites = (productId) => async (dispatch) => {
  try {
    await saveFavorite(productId); // Lưu sản phẩm vào Firestore
    dispatch(addFavoriteItem(productId)); // Cập nhật Redux
  } catch (error) {
    console.error("Failed to save favorite:", error);
  }
};

export const deleteProductFromFavorites = (productId) => async (dispatch) => {
  try {
    await removeFavorite(productId); // Xóa sản phẩm khỏi Firestore
    dispatch(removeFavoriteItem(productId)); // Cập nhật Redux
  } catch (error) {
    console.error("Failed to delete favorite:", error);
  }
};

export const { setFavoriteItems, addFavoriteItem, removeFavoriteItem } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
