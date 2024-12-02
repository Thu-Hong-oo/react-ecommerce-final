import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import COLORS from "../components/Colors";
import { auth } from "../config/firebaseConfig";
import { useDispatch } from "react-redux"; // Import useDispatch
import { setUser } from "../redux/slices/userSlice"; // Import action setUser
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import ModalMessage from "../components/ModalMeassage";
import { fetchUserData } from "../services/userServices";
const SignIn = ({ navigation }) => {
  const dispatch = useDispatch(); // Khởi tạo dispatch
  const [email, setEmail] = useState("thuhong05022003@gmail.com");
  const [password, setPassword] = useState("password123");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setModalMessage("Login successful!"); // Cập nhật thông điệp
      setModalVisible(true); // Hiển thị modal

      // Lấy thông tin người dùng từ Firestore
      const userId = userCredential.user.uid;
      const userData = await fetchUserData(userId);

      if (userData) {
        // Dispatch action để lưu thông tin người dùng vào Redux
        dispatch(
          setUser({
            id: userId,
            name: userData.personal_information.personal_info.full_name,
            avatar: userData.personal_information.personal_info.avatar || null,
            email: userData.personal_information.personal_info.email,
            userData,
          })
        );
      }

      navigation.navigate("Home"); // Chuyển sang trang Home
    } catch (error) {
      setModalMessage("Incorrect password. Please try again."); // Cập nhật thông điệp lỗi
      setModalVisible(true); // Hiển thị modal
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (Platform.OS === "web") {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Lấy thông tin từ Firestore
        const userData = await fetchUserData(user.uid);
        dispatch(
          setUser({
            name: userData.personal_information.personal_info.full_name,
            avatar: userData.personal_information.personal_info.avatar || null,
            email: userData.personal_information.personal_info.email,
          })
        );
        alert("Login successful!");
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Google Login Error:", error); // Log lỗi
      alert(error.message);
    }
  };

  // Xử lý kết quả sau khi redirect trên web
  useEffect(() => {
    if (Platform.OS === "web") {
      getRedirectResult(auth)
        .then((result) => {
          if (result) {
            const user = result.user;
            dispatch(
              setUser({
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
              })
            );

            setModalMessage("Login successful!"); // Cập nhật thông điệp
            setModalVisible(true); // Hiển thị modal
            // Đặt singleButton thành true để chỉ hiển thị nút OK

            navigation.navigate("Home");
          }
        })
        .catch((error) => {
          console.error("Redirect Error:", error);
          alert(error.message);
        });
    }
  }, [navigation, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>

        {/* Input for Username/Email */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#7a7a7a"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input for Password */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" style={styles.icon} />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor="#7a7a7a"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={() => alert("Forgot Password")}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>- OR Continue with -</Text>

        {/* Google Login Button */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={styles.socialIconContainer}
          >
            <Image
              source={{
                uri: "https://i.imgur.com/OOTtYLq.png",
              }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Create An Account </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* ModalMessage for login feedback */}
      <ModalMessage
        visible={modalVisible}
        message={modalMessage}
        onConfirm={() => {
          setModalVisible(false); // Đóng modal
          setEmail(""); // Đặt lại email
          setPassword(""); // Đặt lại mật khẩu
        }}
        onCancel={() => setModalVisible(false)}
        singleButton={modalMessage === "Login successful!"} // Chỉ hiển thị nút OK khi đăng nhập thành công
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    width: 300,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
    color: "#7a7a7a",
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#7a7a7a",
    marginVertical: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialIconContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 100,
    padding: 5,
    marginHorizontal: 10,
    width: 50,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#7a7a7a",
  },
  signUpLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export default SignIn;
