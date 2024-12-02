// services/searchHistoryService.js

import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";

// Hàm lưu một tìm kiếm mới vào Firestore
export const saveSearch = async (queryText) => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const timestamp = new Date().getTime();

    try {
      // Tham chiếu đến collection searchHistory của người dùng trong Firestore
      const searchHistoryRef = collection(db, "Users", userId, "searchHistory");
      await addDoc(searchHistoryRef, {
        query: queryText,
        timestamp: timestamp,
      });
      console.log("Search saved successfully");
    } catch (error) {
      console.error("Error saving search:", error);
    }
  } else {
    console.error("User not authenticated");
  }
};

// Hàm lấy 5 tìm kiếm gần nhất từ Firestore
export const fetchRecentSearches = async () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    try {
      // Tham chiếu và truy vấn 5 tìm kiếm gần nhất của người dùng
      const searchHistoryRef = collection(db, "Users", userId, "searchHistory");
      const q = query(searchHistoryRef, orderBy("timestamp", "desc"), limit(5));
      const snapshot = await getDocs(q);

      // Trả về mảng các tìm kiếm gần đây
      return snapshot.docs.map((doc) => doc.data().query);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      return [];
    }
  }
  return [];
};

// Hàm xóa toàn bộ lịch sử tìm kiếm của người dùng
export const clearSearchHistory = async () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    try {
      // Tham chiếu đến collection searchHistory của người dùng
      const searchHistoryRef = collection(db, "Users", userId, "searchHistory");
      const snapshot = await getDocs(searchHistoryRef);

      // Xóa tất cả các tài liệu trong searchHistory
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }
      console.log("Search history cleared successfully");
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  }
};
