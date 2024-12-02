import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

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
