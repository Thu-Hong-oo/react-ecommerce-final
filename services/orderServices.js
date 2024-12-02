// services/orderServices.js
import { db } from "../config/firebaseConfig"; // Nhập db từ firebaseConfig
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
} from "firebase/firestore"; // Nhập các hàm cần thiết từ Firestore
import { setVoucher } from "../redux/slices/orderSlice";
export const getInfoFromVoucher = async (voucherCode) => {
  try {
    // Tạo một truy vấn để tìm tài liệu có trường 'code' trùng với voucherCode
    const q = query(
      collection(db, "Voucher"),
      where("code", "==", voucherCode)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Voucher không hợp lệ`);
    }

    // Lấy tài liệu đầu tiên trong kết quả
    const docSnap = querySnapshot.docs[0];
    const voucherData = docSnap.data();

    // Kiểm tra số lượng voucher
    if (voucherData.quantity <= 0) {
      throw new Error("Mã đã hết lượt sử dụng");
    }

    // Chỉ trả về discount mà không cập nhật số lượng
    return voucherData;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (
  userInfo,
  selectedItems,
  totalPrice,
  voucher,
  finalPrice,
  paymentMethod
) => {
  try {
    // Kiểm tra các tham số đầu vào
    if (
      !userInfo ||
      !selectedItems ||
      totalPrice === undefined ||
      finalPrice === undefined ||
      !paymentMethod
    ) {
      throw new Error(
        "Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại."
      );
    }

    // Loại bỏ trường createdAt khỏi từng đối tượng trong selectedItems
    const sanitizedItems = selectedItems.map((item) => {
      const { createdAt, ...sanitizedItem } = item; // Bỏ qua trường createdAt
      return sanitizedItem;
    });

    // Truy vấn để lấy thông tin người dùng từ collection Users
    const userDocRef = doc(db, "Users", userInfo.id); // Giả sử userInfo.id là ID của người dùng trong collection Users
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("Người dùng không tồn tại.");
    }

    const userData = userDoc.data();
    const fullName =
      userData.personal_information?.personal_info?.full_name ||
      "Không xác định"; // Lấy full_name
    const shippingAddress =
      userData.shipping_address?.address_1 || "Không xác định"; // Lấy shipping_address

    // Tạo một tài liệu đơn hàng mới trong Firestore
    const orderRef = collection(db, "Order");

    const orderData = {
      userName: fullName, // Sử dụng fullName đã lấy được
      shippingAddress: shippingAddress, // Thêm địa chỉ giao hàng
      selectedItems: sanitizedItems, // Sử dụng danh sách đã được làm sạch
      totalPrice,
      voucherCode: voucher ? voucher.code : null, // Kiểm tra voucher có tồn tại không
      voucherDiscount:
        voucher && typeof voucher.discount === "number"
          ? `${voucher.discount * 100}%`
          : null, // Kiểm tra discount có hợp lệ không
      finalPrice,
      paymentMethod,
      createdAt: new Date(), // Thời gian tạo đơn hàng
    };

    // Thêm đơn hàng vào collection
    const docRef = await addDoc(orderRef, orderData);

    console.log("Đơn hàng đã được tạo với ID: ", docRef.id);

    // Cập nhật số lượng sản phẩm trong Product database
    for (const item of selectedItems) {
      const productId = item.id;
      const quantity = item.quantity;
      console.log("item", item);
      console.log("quantity", quantity);
      console.log("productId", productId);

      // Truy vấn để tìm sản phẩm theo productId
      const productDocRef = doc(db, "Products", productId);
      const productDoc = await getDoc(productDocRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();
        const newQuantity = productData.quantity - quantity;
        console.log("productData", productId);
        console.log("newQuantity", newQuantity);
        // Cập nhật số lượng sản phẩm trong Product
        await updateDoc(productDocRef, { quantity: newQuantity });
      } else {
        console.log(`Sản phẩm với ID ${productId} không tồn tại.`);
      }
    }

    // Kiểm tra voucher
    if (voucher && voucher.code) {
      // Tạo truy vấn để tìm voucher theo code
      const voucherQuery = query(
        collection(db, "Voucher"),
        where("code", "==", voucher.code)
      );
      const voucherSnapshot = await getDocs(voucherQuery);

      if (!voucherSnapshot.empty) {
        const voucherDoc = voucherSnapshot.docs[0]; // Lấy tài liệu đầu tiên
        const voucherData = voucherDoc.data();

        // Giảm số lượng voucher
        await updateDoc(voucherDoc.ref, {
          quantity: voucherData.quantity - 1,
        });
      } else {
        console.log("Voucher không tồn tại.");
      }
    }
    setVoucher(null);
    return docRef.id; // Trả về ID của đơn hàng vừa tạo
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng: ", error);
    throw new Error("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
  }
};
