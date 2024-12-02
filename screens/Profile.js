import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import COLORS from "../components/Colors";
import { updateUser, logout } from "../redux/slices/userSlice";
import { updateUserData } from "../services/userServices";
import ModalMessage from "../components/ModalMeassage";

export default function Profile({ navigation }) {
  const user = useSelector((state) => state.user.user); // Lấy thông tin người dùng từ Redux
  const dispatch = useDispatch();
  console.log(user);
  const [fullName, setFullName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const userData = user.userData;
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (userData) {
      // Lấy số điện thoại
      const personalPhone =
        userData?.personal_information?.personal_info?.phone || "N/A";
      const shippingPhone =
        userData?.shipping_address?.address_1?.phone || "N/A";

      // Lấy địa chỉ
      const shippingAddress = userData?.shipping_address?.address_1;
      const fullAddress = shippingAddress
        ? `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country}, ${shippingAddress.zip_code}`
        : "Address not available";

      // Cập nhật state
      setPhone(`${personalPhone} `);
      setAddress(fullAddress);
    }
  }, [userData]);
  const handleSaveChanges = async () => {
    if (!fullName || !address || !phone) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const updatedUser = {
      name: fullName,
      email: address,
      phone,
    };
    const handleLogout = () => {
      Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            dispatch(logout()); // Xóa thông tin người dùng trong Redux
            navigation.replace("Login"); // Điều hướng về màn hình đăng nhập
          },
        },
      ]);
    };
    try {
      await updateUserData(user.id, updatedUser); // Cập nhật dữ liệu trên Firestore
      dispatch(updateUser(updatedUser)); // Cập nhật Redux
      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
      console.error("Error updating user:", error);
    }
  };

  const handleLogout = () => {
    setModalVisible(true); // Hiển thị modal xác nhận logout
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={20} color="#555" />
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <Text></Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : {
                    uri: "https://www.pinterest.com/pin/ghim-trn-ly-nh-nh-cre--984881012238091336/",
                  }
            }
            style={styles.userImage}
          />
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={18} color="#9CA3AF" style={styles.icon} />
            <TextInput
              value={fullName}
              style={styles.input}
              onChangeText={setFullName} // Cập nhật state khi người dùng nhập
            />
          </View>
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="map-marker"
              size={18}
              color="#9CA3AF"
              style={styles.icon}
            />
            <TextInput
              value={address}
              style={styles.input}
              onChangeText={setAddress}
            />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Icon name="phone" size={18} color="#9CA3AF" style={styles.icon} />
            <TextInput
              value={phone}
              style={styles.input}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.saveButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ModalMessage
        visible={modalVisible}
        message={"Are you sure you want to log out?"}
        onConfirm={() => {
          dispatch(logout()); // Xóa thông tin người dùng trong Redux
          navigation.replace("Login"); // Điều hướng về màn hình đăng nhập
          setModalVisible(false); // Đóng modal sau khi logout
        }}
        onCancel={() => {
          setModalVisible(false); // Đóng modal nếu người dùng hủy
        }}
        singleButton={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    padding: 15,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
