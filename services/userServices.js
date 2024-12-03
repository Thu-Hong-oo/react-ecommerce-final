import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";

// Hàm lấy dữ liệu người dùng từ Firestore
export async function fetchUserData(userId) {
  try {
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error.message);
    return null;
  }
}
// Hàm cập nhật dữ liệu người dùng
export async function updateUserData(userId, updatedData) {
  try {
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, updatedData); // Cập nhật dữ liệu
    console.log("User data updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating user data: ", error.message);
    return false;
  }
}

// Hàm thêm dữ liệu người dùng
export async function addUserData(
  email,
  password,
  fullName,
  gender,
  dob,
  phone,
  username
) {
  try {
    // Tạo người dùng với Firebase Authentication và lưu mật khẩu
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user; // Đối tượng người dùng Firebase Authentication
    const userId = user.uid; // Sử dụng UID của Firebase làm userId cho Firestore

    // Định nghĩa tham chiếu đến tài liệu người dùng trong Firestore
    const userRef = doc(db, "Users", userId);

    // Cấu trúc dữ liệu người dùng
    const userData = {
      personal_information: {
        personal_info: {
          full_name: fullName || "No Name", // Tên người dùng
          gender: gender || "Not specified", // Giới tính
          dob: dob || "Not specified", // Ngày sinh
          phone: phone || "Not specified", // Số điện thoại
          email: email, // Email người dùng
          username: username || "User" + Math.floor(Math.random() * 1000), // Tên người dùng (mặc định nếu không có)
          is_verified: false, // Tình trạng xác minh tài khoản (có thể cập nhật sau khi xác thực email)
          last_login: new Date().toISOString(), // Thời gian đăng nhập gần nhất
        },
      },
      shipping_address: {
        address_1: {
          street: "Not specified", // Địa chỉ mặc định (có thể cập nhật sau)
          city: "Not specified",
          state: "Not specified",
          zip_code: "Not specified",
          country: "Not specified",
          phone: phone || "Not specified", // Có thể dùng số điện thoại của người dùng
        },
      },
      search_history: {
        recent_searches: {
          searches: [], // Khởi tạo mảng tìm kiếm gần đây trống
        },
      },
      favorites: [], // Mảng yêu thích trống
    };

    // Lưu dữ liệu người dùng vào Firestore với UID thực
    await setDoc(userRef, userData, { merge: true });
    // Trả về thông báo thành công
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error adding user data: ", error);
    return { success: false, message: "Error creating user: " + error.message };
  }
}
