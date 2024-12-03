import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Picker, // Picker cho lựa chọn giới tính
} from "react-native";

import COLORS from "../components/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { addUserData } from "../services/userServices"; // Import service để gọi hàm addUserData
import ModalMessage from "../components/ModalMeassage";
const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState(""); // Giới tính
  const [dob, setDob] = useState("05/02/2003"); // Ngày sinh
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const validateEmail = (email) => {
    // Basic email regex pattern
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    // Example phone number regex for 10-digit numbers (adjust as needed)
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };
  const handleSignUp = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !confirmPassword || !fullName || !phone) {
      setErrorMessage("Please fill all required fields.");
      return;
    }
    // Kiểm tra email
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Kiểm tra số điện thoại
    if (!validatePhone(phone)) {
      setErrorMessage("Please enter a valid phone number (10 digits).");
      return;
    }
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Gọi hàm tạo tài khoản và lưu dữ liệu vào Firestore
    const result = await addUserData(
      email,
      password,
      fullName,
      gender,
      dob,
      phone,
      username
    );

    if (result.success) {
      // Nếu tạo tài khoản thành công
      setErrorMessage("");
      setModalMessage("Register successful!"); // Cập nhật thông điệp
      setModalVisible(true); // Hiển thị modal
    } else {
      // Nếu có lỗi
      setErrorMessage(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create an account</Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
          <FontAwesome name="user" style={styles.icon} />
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <FontAwesome name="user-circle" style={styles.icon} />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <FontAwesome name="envelope" style={styles.icon} />
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <FontAwesome name="phone" style={styles.icon} />
        </View>

        {/* Gender Selection */}
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={{
              height: 40,
              width: 300,
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 12,
              borderWidth: 0,
              margin: 0,
            }}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Date of Birth"
            value={dob}
            onChangeText={setDob} // Corrected: Directly update state with the value
            style={styles.input}
          />
          <FontAwesome name="calendar" style={styles.icon} />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <FontAwesome name="lock" style={styles.icon} />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
          <FontAwesome name="lock" style={styles.icon} />
        </View>

        {/* Error message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Register Button */}
        <TouchableOpacity onPress={handleSignUp} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>I Already Have an Account </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
       {/* ModalMessage for login feedback */}
       <ModalMessage
        visible={modalVisible}
        message={modalMessage}
        onConfirm={() => {
          setModalVisible(false); // Đóng modal
          navigation.navigate("SignIn");
        }}
        onCancel={() => setModalVisible(false)}
        singleButton={false} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 10,
    width: "90%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    fontSize: 18,
    color: "#7a7a7a",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  registerButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#7a7a7a",
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  dialogButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  dialogButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default SignUp;
