// services/favoriteService.js

import { db, auth } from "../config/firebaseConfig";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Hàm lưu một sản phẩm vào danh sách yêu thích
export const saveFavorite = async (productId) => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    try {
      // Tham chiếu đến tài liệu của người dùng trong Firestore
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, {
        favorites: arrayUnion(productId), // Thêm ID sản phẩm vào mảng carts
      });
      console.log("Favorite saved successfully");
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  } else {
    console.error("User  not authenticated");
  }
};

// Hàm lấy danh sách yêu thích của người dùng
export const fetchFavorites = async () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    try {
      // Tham chiếu đến tài liệu của người dùng
      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || []; 
        return favorites;
      } else {
        console.log("User  document does not exist");
        return [];
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  }
  return [];
};

// Hàm xóa một sản phẩm khỏi danh sách yêu thích
export const removeFavorite = async (productId) => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    try {
      // Tham chiếu đến tài liệu của người dùng trong Firestore
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, {
        favorites: arrayRemove(productId), // Xóa ID sản phẩm khỏi mảng
      });
      console.log("Favorite removed successfully");
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  } else {
    console.error("User  not authenticated");
  }
};
