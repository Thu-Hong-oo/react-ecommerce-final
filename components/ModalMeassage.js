import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import COLORS from "../components/Colors";

const ModalMessage = ({
  visible,
  message,
  onConfirm,
  onCancel,
  singleButton = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Khởi tạo giá trị Animated

  useEffect(() => {
    if (visible) {
      // Khi modal mở
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300, // Thời gian hiệu ứng mở
        useNativeDriver: true,
      }).start();
    } else {
      // Khi modal đóng
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300, // Thời gian hiệu ứng đóng
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="none" // Đặt animationType thành 'none' vì chúng ta sẽ sử dụng Animated API
      visible={visible}
      onRequestClose={onCancel} // Đóng modal khi nhấn nút quay lại
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {singleButton ? (
              <TouchableOpacity style={styles.button} onPress={onConfirm}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5, // Đổ bóng cho modal
  },
  message: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ModalMessage;
