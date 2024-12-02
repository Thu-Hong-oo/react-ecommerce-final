import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCartItemsFromService,
  addToCartInService,
  removeFromCartInService,
  updateCartItemQuantityInService,
} from "../../services/cartServices";
import { createSelector } from "reselect";

// Fetch Cart Items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchCartItemsFromService(userId);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Selector để lấy danh sách sản phẩm từ state
export const selectCartItems = (state) => state.cart.items;

// Tính tổng số lượng sản phẩm theo sự kết hợp của id, size, và option
export const selectTotalQuantityById = createSelector(
  [selectCartItems],
  (cartItems) => {
    const quantitiesById = {};

    cartItems.forEach((item) => {
      const { id, size, option, quantity } = item;

      // Xử lý size và option nếu có
      const sizeName = size || "default"; // Nếu size là null, sử dụng 'default'
      const optionName = option || "default"; // Nếu option là null, sử dụng 'default'

      // Tạo key duy nhất cho sự kết hợp id, size, và option
      const key = `${id}-${sizeName}-${optionName}`;

      // Debugging: In key và số lượng
      console.log("Generated Key:", key);
      console.log("Item Quantity:", quantity);

      // Cộng dồn số lượng cho mỗi sự kết hợp của key
      if (!quantitiesById[key]) {
        quantitiesById[key] = 0; // Nếu chưa có key, khởi tạo số lượng là 0
      }

      quantitiesById[key] = 1;
    });

    return quantitiesById; // Trả về đối tượng có key và tổng số lượng của từng sự kết hợp
  }
);

// Add Item to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, item }, { rejectWithValue }) => {
    try {
      const response = await addToCartInService(userId, item); // Assuming this is your service call
      return response; // Success
    } catch (error) {
      // Reject with custom error message
      return rejectWithValue(error.message || "Failed to add item to cart");
    }
  }
);

// Remove Item from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, firestoreId }, { rejectWithValue }) => {
    try {
      await removeFromCartInService(userId, firestoreId);
      return firestoreId;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ firestoreId, quantity, userId }, { rejectWithValue }) => {
    try {
      const response = await updateCartItemQuantityInService(
        firestoreId,
        quantity,
        userId
      );
      return response; // Giả sử bạn trả về thông tin cập nhật của item hoặc response từ service
    } catch (error) {
      return rejectWithValue(error.message); // Trả về lỗi nếu có
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    totalPrice: 0,
  },
  reducers: {
    calculateTotalPrice(state) {
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        // Tính toán lại tổng giá trị sau khi lấy sản phẩm
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add Item to Cart
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";

        const existingItemIndex = state.items.findIndex(
          (item) =>
            item.firestoreId === action.payload.firestoreId &&
            item.option === action.payload.option // Kiểm tra option
        );

        if (existingItemIndex !== -1) {
          // Nếu sản phẩm đã tồn tại với cùng firestoreId và option, cập nhật số lượng
          state.items[existingItemIndex].quantity += action.payload.quantity; // Cộng dồn số lượng
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          state.items.push(action.payload);
        }

        // Tính toán lại tổng giá trị sau khi thêm sản phẩm
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Item Quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { firestoreId, quantity } = action.payload;

        const itemIndex = state.items.findIndex(
          (item) => item.firestoreId === firestoreId
        );

        if (itemIndex === -1) {
          console.error(`Item with firestoreId ${firestoreId} not found`);
          return;
        }

        state.items[itemIndex].quantity = quantity;

        // Tính toán lại tổng giá trị của giỏ hàng
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Log error for debugging
      });
  },
});

export const { calculateTotalPrice } = cartSlice.actions;

export default cartSlice.reducer;
