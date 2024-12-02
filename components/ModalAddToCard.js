import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons"; // Icon library
import COLORS from "./Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/slices/cartSlice";
import { buyNow } from "../redux/slices/orderSlice";

import { useNavigation } from "@react-navigation/native";
export default function CartModal({ visible, onClose, buttonType }) {
  const user = useSelector((state) => state.user.user);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImage, setCurrentImage] = useState(selectedProduct.mainImage); // State for current image
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedOption) {
      const selectedSubImage = selectedProduct.subImages.find(
        (item) => item.name === selectedOption
      );
      if (selectedSubImage) {
        setCurrentImage(selectedSubImage.img);
      } else {
        setCurrentImage(selectedProduct.mainImage);
      }
    } else {
      setCurrentImage(selectedProduct.mainImage); // Nếu không có tùy chọn, sử dụng hình ảnh chính
    }
  }, [selectedOption, selectedProduct]);

  const handleAddToCart = async () => {
    const userId = user.id; // Lấy userId từ Redux store

    // Kiểm tra xem userId có hợp lệ không
    if (!userId) {
      console.error("User  ID is required");
      return; // Dừng lại nếu userId không hợp lệ
    }

    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      option: selectedOption,
      size: selectedSize,
      img: currentImage,
    };

    try {
      // Gọi dispatch với cả userId và item
      await dispatch(addToCart({ userId, item })).unwrap(); // unwrap() để xử lý lỗi
      console.log("Item added to Firestore successfully");
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to add item to Firestore:", error);
    }
  };

  const handleBuyNow = () => {
    const id = selectedProduct.id;
    const product = {
      id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      option: selectedOption,
      size: selectedSize,
      img: currentImage,
    };
    console.log("product", product);
    dispatch(buyNow(product));
    // Navigate to Checkout screen with product data
    navigation.navigate("Checkout");
    onClose();
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Giảm số lượng
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1); // Tăng số lượng
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Modal
        visible={visible}
        statusBarTranslucent={true}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.content}>
          <View style={styles.card}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.imgAndPrice}>
              <Image source={currentImage} style={styles.imgModal} />
              <Text style={styles.priceText}>
                $ {(selectedProduct.price * quantity).toFixed(2)}
              </Text>
            </View>
            {selectedProduct.subImages && (
              <>
                <Text style={styles.colorText}>Options</Text>
                <View style={styles.colorContainer}>
                  {selectedProduct.subImages &&
                    selectedProduct.subImages.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.colorButton,
                          selectedOption === item.name && styles.selectedButton,
                        ]}
                        on
                        onPress={() => {
                          setSelectedOption(item.name);
                          setSelectedSize(null); // Reset size khi chọn option khác
                        }}
                      >
                        <Text style={styles.buttonText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </>
            )}
            {/* Sizes  */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <>
                <Text style={styles.colorText}>Sizes</Text>
                <View style={styles.colorContainer}>
                  {selectedProduct.sizes.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorButton,
                        selectedSize === item && styles.selectedButton,
                      ]}
                      onPress={() => setSelectedSize(item)}
                    >
                      <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.quantityRow}>
              <Text style={styles.colorText}>Quantity</Text>
              <View style={styles.quantityNumber}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleDecreaseQuantity}
                >
                  <AntDesign name="minus" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleIncreaseQuantity}
                >
                  <AntDesign name="plus" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {buttonType === "buyNow" ? (
              <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
                <Text style={styles.textbutton}>Buy Now</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                <Text style={styles.textbutton}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedButton: {
    borderColor: COLORS.red,
    borderWidth: 2,
  },
  colorButton: {
    backgroundColor: "#F3F4F6",
    marginRight: 15,
    width: 75,
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  imgModal: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  imgAndPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    color: COLORS.red,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginBottom: 50,
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  textbutton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityNumber: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
