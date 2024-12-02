import { db } from "../config/firebaseConfig"; // Đảm bảo đường dẫn đúng
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Hàm lấy danh sách sản phẩm
export const getLastedProducts = async () => {
  try {
    const productQuery = query(
      collection(db, "Products"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(productQuery);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm: ", error);
    throw error; // Ném lỗi ra ngoài để xử lý
  }
};

export const getAllProducts = async () => {
    try {
      const productQuery = query(
        collection(db, "Products"),
      );
      const querySnapshot = await getDocs(productQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data; // Trả về danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm: ", error);
      throw error; // Ném lỗi ra ngoài để xử lý
    }
  };