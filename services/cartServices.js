import { db } from "../config/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDoc,
  addDoc,
} from "firebase/firestore";

// Fetch Cart Items
export const fetchCartItemsFromService = async (userId) => {
  const cartRef = collection(doc(db, "Users", userId), "carts");
  const snapshot = await getDocs(cartRef);

  if (snapshot.empty) {
    console.log("No cart items found!");
    return []; // Nếu không có dữ liệu trong giỏ hàng
  }

  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    console.log("Fetched item:", doc.id, data); // Log để kiểm tra doc.id (ID của document Firestore) và dữ liệu của từng item

    return {
      firestoreId: doc.id, // ID của document trong Firestore (ID ngoài)
      productId: data.id, // ID của sản phẩm trong Firestore
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(), // Chuyển đổi Timestamp thành chuỗi ISO
    };
  });

  console.log("Fetched cart items:", items); // Kiểm tra toàn bộ dữ liệu giỏ hàng đã được lấy

  return items;
};

//add tocart service
export const addToCartInService = async (userId, item) => {
  if (!userId) {
    throw new Error("User  ID is required");
  }
  const cartRef = collection(doc(db, "Users", userId), "carts");

  try {
    // Kiểm tra sản phẩm đã tồn tại với cùng id, size và option hay chưa
    const existingItemQuery = query(
      cartRef,
      where("id", "==", item.id),
      where("size", "==", item.size),
      where("option", "==", item.option)
    );
    const snapshot = await getDocs(existingItemQuery);

    if (!snapshot.empty) {
      // Sản phẩm đã tồn tại -> cập nhật số lượng
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();
      const newQuantity = existingData.quantity + (item.quantity || 1);

      // Cập nhật tài liệu với số lượng mới
      await updateDoc(existingDoc.ref, { quantity: newQuantity });
      return {
        firestoreId: existingDoc.id,
        ...existingData,
        quantity: newQuantity,
      };
    } else {
      // Sản phẩm chưa tồn tại -> thêm mới với ID tự động
      const newItemData = { ...item, quantity: item.quantity || 1 };
      const docRef = await addDoc(cartRef, newItemData);
      return { firestoreId: docRef.id, ...newItemData }; // Trả về ID tự động
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
};

export const removeFromCartInService = async (userId, firestoreId) => {
  if (!firestoreId) {
    throw new Error("firestoreId is required");
  }
  const cartRef = doc(db, "Users", userId, "carts", firestoreId);
  try {
    await deleteDoc(cartRef);
    console.log("Item removed from cart:", firestoreId);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
};

export const updateCartItemQuantityInService = async (
  firestoreId,
  quantity,
  userId // Thêm tham số userId
) => {
  const cartRef = doc(db, "Users", userId, "carts", firestoreId);

  try {
    const docSnapshot = await getDoc(cartRef);
    if (!docSnapshot.exists()) {
      throw new Error(`No document found for firestoreId: ${firestoreId}`);
    }

    // Cập nhật số lượng
    await updateDoc(cartRef, { quantity: quantity });
    return { firestoreId, quantity }; // Trả về firestoreId và quantity đã cập nhật
  } catch (error) {
    console.error("Error updating quantity in Firestore:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
  }
};

// import { db } from "../config/firebaseConfig"; // Đường dẫn đúng
// import {
//   collection,
//   doc,
//   setDoc,
//   getDocs,
//   deleteDoc,
//   updateDoc,
//   query,
//   where,
//   getDoc,
// } from "firebase/firestore";

// // Fetch Cart Items
// export const fetchCartItemsFromService = async (userId) => {
//   const cartRef = collection(doc(db, "Users", userId), "cart");
//   const snapshot = await getDocs(cartRef);
//   return snapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       ...data,
//       createdAt: data.createdAt?.toDate().toISOString(), // Chuyển đổi Timestamp thành chuỗi ISO
//     };
//   });
// };

// export const addToCartInService = async (userId, item) => {
//   if (!userId) {
//     throw new Error("User  ID is required");
//   }
//   const cartRef = collection(doc(db, "Users", userId), "cart");

//   try {
//     // Kiểm tra sản phẩm đã tồn tại hay chưa
//     const existingItemQuery = query(cartRef, where("id", "==", item.id));
//     const snapshot = await getDocs(existingItemQuery);

//     if (!snapshot.empty) {
//       // Sản phẩm đã tồn tại -> cập nhật số lượng
//       const existingDoc = snapshot.docs[0];
//       const existingData = existingDoc.data();
//       const newQuantity = existingData.quantity + (item.quantity || 1);

//       await updateDoc(existingDoc.ref, { quantity: newQuantity });
//       return { id: existingDoc.id, ...existingData, quantity: newQuantity };
//     } else {
//       // Sản phẩm chưa tồn tại -> thêm mới với id là item.id
//       const docRef = doc(cartRef, item.id); // Tạo tham chiếu đến tài liệu với id là item.id
//       await setDoc(docRef, { ...item, quantity: item.quantity || 1 }); // Thêm sản phẩm mới
//       return { id: docRef.id, ...item, quantity: item.quantity || 1 };
//     }
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     throw new Error("Failed to add item to cart");
//   }
// };

// // Remove Item from Cart
// export const removeFromCartInService = async (userId, itemId) => {
//   const cartRef = doc(db, "Users", userId, "cart", itemId);
//   await deleteDoc(cartRef);
// };

// // Update Item Quantity
// export const updateCartItemQuantityInService = async (
//   userId,
//   itemId,
//   quantity
// ) => {
//   const cartRef = doc(db, "Users", userId, "cart", itemId);

//   try {
//     // Kiểm tra sự tồn tại của tài liệu
//     const docSnapshot = await getDoc(cartRef);
//     if (!docSnapshot.exists()) {
//       throw new Error(`No document to update: ${cartRef.path}`);
//     }

//     // Cập nhật nếu tài liệu tồn tại
//     await updateDoc(cartRef, { quantity });
//     return { itemId, quantity };
//   } catch (error) {
//     console.error("Error updating item quantity:", error);
//     throw error; // Truyền lỗi để xử lý ở Redux slice
//   }
// };
