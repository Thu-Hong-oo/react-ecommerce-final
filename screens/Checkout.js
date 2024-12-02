// screens/Checkout.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import COLORS from "../components/Colors";
import { useSelector, useDispatch } from "react-redux";
import { getInfoFromVoucher } from "../services/orderServices";
import {
  setVoucher,
  setFinalPrice,
  setTotalPrice,
} from "../redux/slices/orderSlice";

const Checkout = ({ navigation }) => {
  const selectedItems = useSelector((state) => state.order.selectedItems);
  const totalPrice = useSelector((state) => state.order.totalPrice);
  const finalPrice = useSelector((state) => state.order.finalPrice);
  const dispatch = useDispatch();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucherInfo] = useState(null);
  const [message, setMessage] = useState("");

  // Tính tổng giá trị đơn hàng
  useEffect(() => {
    const total =
      Array.isArray(selectedItems) && selectedItems.length > 0
        ? selectedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          )
        : 0;

    dispatch(setTotalPrice(total)); // Cập nhật totalPrice trong Redux
    dispatch(setFinalPrice(total)); // Cập nhật finalPrice trong Redux
  }, [selectedItems, dispatch]);

  const handleGetInfoFromVoucher = async () => {
    try {
      const voucherInfo = await getInfoFromVoucher(voucherCode);
      setVoucherInfo(voucherInfo); // Lưu voucherInfo vào state cục bộ

      const discountAmount = totalPrice * voucherInfo.discount; // Tính toán số tiền giảm giá
      setMessage(`Giảm được: $${discountAmount.toFixed(2)}`);

      // Cập nhật Redux
      dispatch(setVoucher(voucherInfo)); // Lưu voucher vào Redux
      dispatch(setFinalPrice(totalPrice - discountAmount)); // Cập nhật giá trị cuối cùng
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleNext = () => {
    if (!voucherCode) {
      dispatch(setVoucher(null));
    }
    navigation.navigate("PaymentMethod");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" type="antdesign" size={20} color="gray" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Cart Items */}
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.cartItems}>
          {selectedItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={item.img} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text
                  style={styles.itemName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <View style={styles.itemPriceContainer}>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Voucher and Total */}
        <Text style={styles.voucherLabel}>Voucher</Text>
        <View style={styles.voucherContainer}>
          <TextInput
            placeholder="Enter voucher code"
            placeholderTextColor="gray"
            style={styles.voucherInput}
            value={voucherCode}
            onChangeText={setVoucherCode}
          />
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleGetInfoFromVoucher}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị thông báo */}
        {message ? <Text style={styles.message}>{message}</Text> : null}

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <View style={styles.totalPrice}>
            <Text style={styles.totalAmount}>
              Tổng tiền: ${totalPrice.toFixed(2)}
            </Text>
            <Text style={styles.totalFinal}>
              Số tiền cuối cùng: ${finalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <FontAwesome name="arrow-right" size={15} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  cartItems: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    resizeMode: "contain",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemQuantity: {
    marginLeft: 5,
    color: "gray",
  },
  voucherLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  voucherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    alignItems: "flex-end",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  totalFinal: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.orange,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
  message: {
    color: "crimson",
    fontWeight: "500",
    paddingBottom: 10,
  },
});

export default Checkout;
