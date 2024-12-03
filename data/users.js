import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Hàm thêm dữ liệu người dùng
async function addUserData(email, password) {
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
          full_name: "ThuHong",
          gender: "Female",
          dob: "1990-01-01",
          phone: "+1234567890",
          email: email,
          username: "ThuHong523",
          is_verified: true,
          last_login: new Date().toISOString(),
        },
      },
      shipping_address: {
        address_1: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip_code: "10001",
          country: "USA",
          phone: "+1234567890",
        },
      },
      search_history: {
        recent_searches: {
          searches: ["laptop", "shoes", "watch"],
        },
      },
      favorites: []       
      ,

    };

    // Lưu dữ liệu người dùng vào Firestore với UID thực
    await setDoc(userRef, userData, { merge: true });
    console.log("User data added successfully");
  } catch (error) {
    console.error("Error adding user data: ", error);
  }
}

// Gọi hàm với email và mật khẩu cụ thể
const email = "thuhong05022003@gmail.com";
const password = "password123"; // Mật khẩu người dùng nhập
addUserData(email, password);
