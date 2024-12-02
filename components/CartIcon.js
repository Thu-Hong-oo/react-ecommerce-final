import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Badge } from "react-native-elements";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectTotalQuantityById } from "../redux/slices/cartSlice";
import COLORS from "../components/Colors";

export default function CartIcon() {
  const navigation = useNavigation(); // Sử dụng useNavigation hook
  const totalQuantityById = useSelector(selectTotalQuantityById);

  // Tính tổng số lượng tất cả sản phẩm trong giỏ hàng
  const totalItemsInCart = Object.values(totalQuantityById || {}).reduce(
    (acc, quantity) => acc + quantity,
    0
  );

  return (
    <View style={styles.iconContainer}>
      {totalItemsInCart > 0 && (
        <Badge
          value={totalItemsInCart > 99 ? "99+" : totalItemsInCart} // Hiển thị "99+" nếu số lượng lớn hơn 99
          status="error"
          containerStyle={styles.badgeContainer}
        />
      )}
      <TouchableOpacity
        style={styles.iconSpacing}
        onPress={() => navigation.navigate("Cart")} // Điều hướng đến màn hình Cart
      >
        <AntDesign name="shoppingcart" size={27} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
  },
  badgeContainer: {
    zIndex: 1,
    position: "absolute",
    right: -10,
    top: -5,
  },
  iconSpacing: {
    marginLeft: 15,
  },
});
