import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification,
} from "firebase/auth"; // Import Firebase Authentication

const VerificationPage = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Lưu email người dùng
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi nếu có

  useEffect(() => {
    // Kiểm tra URL xem có phải là liên kết xác thực từ email không
    const auth = getAuth();
    const currentUrl = window.location.href; // Lấy URL hiện tại trong ứng dụng

    if (isSignInWithEmailLink(auth, currentUrl)) {
      // Nếu liên kết là một liên kết xác thực, lấy email từ URL và xác thực tài khoản
      const emailFromUrl = window.localStorage.getItem("emailForSignIn");

      if (!emailFromUrl) {
        setErrorMessage("Email không hợp lệ.");
        return;
      }

      signInWithEmailLink(auth, emailFromUrl, currentUrl)
        .then(() => {
          // Xác thực thành công, gửi email xác thực
          setEmail(emailFromUrl);
          Alert.alert(
            "Email đã được xác thực!",
            "Tài khoản của bạn đã được xác thực thành công."
          );
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực tài khoản của bạn</Text>

      {email ? (
        <Text style={styles.successText}>
          Email: {email} đã được xác thực thành công!
        </Text>
      ) : (
        <Text style={styles.errorText}>Có lỗi xảy ra: {errorMessage}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Quay lại trang đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  successText: {
    color: "green",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default VerificationPage;
