import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { db } from "../config/firebaseConfig"; // Nhập db từ firebaseConfig
import { doc, getDoc } from "firebase/firestore"; // Nhập các hàm cần thiết từ Firestore
import Icon from "react-native-vector-icons/FontAwesome";
import COLORS from "../components/Colors";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/slices/productSlice";

const OrderDetails = ({ route, navigation }) => {
  const { orderId } = route.params; // Nhận orderId từ params
  const [orderDetails, setOrderDetails] = useState(null); // State để lưu thông tin đơn hàng
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDocRef = doc(db, "Order", orderId); // Tạo tham chiếu đến đơn hàng
        const orderDoc = await getDoc(orderDocRef); // Lấy tài liệu đơn hàng

        if (orderDoc.exists()) {
          setOrderDetails(orderDoc.data()); // Lưu thông tin đơn hàng vào state
        } else {
          console.log("Đơn hàng không tồn tại");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false); // Đặt loading về false sau khi hoàn thành
      }
    };

    fetchOrderDetails(); // Gọi hàm lấy thông tin đơn hàng
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin đơn hàng.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* User Profile */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://s120-ava-talk.zadn.vn/a/e/9/9/6/120/2fa60c6b153c36f729376182d7c39f51.jpg",
            }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{orderDetails.userName}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.borderTop}>
          {orderDetails.selectedItems.map((product, index) => (
            <View key={index} style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setSelectedProduct(item));
                  navigation.navigate("DetailProduct");
                }}
              >
                <Image source={{ uri: product.img }} style={styles.itemImage} />
              </TouchableOpacity>

              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{product.name}</Text>
                <Text style={styles.itemSubtitle}>
                  Option: {product.option || "N/A"}
                </Text>
                <Text style={styles.itemPrice}>${product.price}</Text>
              </View>
              <Text style={styles.itemQuantity}>x{product.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Order Details */}
        <View style={styles.borderTop}>
          <Text style={styles.sectionTitle}>Mã đơn hàng</Text>
          <View style={styles.row}>
            <Text style={styles.orderCode}>{orderId}</Text>
            <TouchableOpacity>
              <Text style={styles.copyButton}>SAO CHÉP</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Thời gian đặt hàng</Text>
          <Text style={styles.text}>
            {new Date(orderDetails.createdAt.seconds * 1000).toLocaleString()}
          </Text>
          <Text style={styles.subtitle}>Phương thức thanh toán</Text>
          <Text style={styles.text}>{orderDetails.paymentMethod}</Text>
          <Text style={styles.subtitle}>Địa chỉ giao hàng</Text>
          <Text style={styles.text}>
            {orderDetails.shippingAddress.street},{" "}
            {orderDetails.shippingAddress.city},{" "}
            {orderDetails.shippingAddress.state},{" "}
            {orderDetails.shippingAddress.zip_code},{" "}
            {orderDetails.shippingAddress.country}
          </Text>
          <Text style={styles.subtitle}>Số điện thoại</Text>
          <Text style={styles.text}>{orderDetails.shippingAddress.phone}</Text>
          <Text style={styles.subtitle}>Tổng giá trị</Text>
          <Text style={styles.text}>${orderDetails.totalPrice}</Text>
          <Text style={styles.subtitle}>Giá cuối cùng</Text>
          <Text style={styles.text}>${orderDetails.finalPrice}</Text>
          {orderDetails.voucherCode && (
            <View>
              <Text style={styles.subtitle}>Mã giảm giá</Text>
              <Text style={styles.text}>{orderDetails.voucherCode}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.bottomButtonText}>Quay lại trang chính</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  profileContainer: { flexDirection: "row", alignItems: "center", padding: 16 },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  userInfo: { marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  icon: { marginLeft: "auto" },
  borderTop: { borderTopWidth: 1, borderTopColor: "#ddd", paddingVertical: 16 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  itemInfo: { marginLeft: 12, flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
  itemSubtitle: { fontSize: 12, color: "#666" },
  itemPrice: { fontSize: 14, fontWeight: "bold", color: "#333" },
  itemQuantity: { color: "#666" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  orderCode: { fontSize: 14, color: "#333" },
  copyButton: { marginLeft: 8, color: "#14b8a6" },
  subtitle: { marginTop: 8, fontSize: 12, color: "#666" },
  text: { fontSize: 14, color: "#333" },
  bottomButtonContainer: { padding: 16 },
  bottomButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bottomButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default OrderDetails;
