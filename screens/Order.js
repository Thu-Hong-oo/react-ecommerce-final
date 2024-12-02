import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import COLORS from "../components/Colors";
import { useFocusEffect } from "@react-navigation/native";

export default function Order({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Order"));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Order History</Text>
        </Pressable>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.sellerInfo}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/RKPwRekIaxzZJCb24xHif6YrSMeYDSt9O3NdBlba2q64bfXPB.jpg",
                  }} // Icon của cửa hàng
                  style={styles.mallIcon}
                />
                <Text style={styles.sellerName}>{item.userName}</Text>
              </View>
            </View>
            <View style={styles.orderBody}>
              {item.selectedItems.map((product, index) => (
                <View key={index} style={styles.productInfo}>
                  <Image
                    source={{ uri: product.img }}
                    style={styles.productImage}
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productQuantity}>
                      x{product.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.orderFooter}>
              <View style={styles.footerButtons}>
                <Pressable style={styles.reorderButton}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </Pressable>
                <Pressable
                  style={styles.contactButton}
                  onPress={() =>
                    navigation.navigate("OrderDetail", { orderId: item.id })
                  } // Truyền orderId
                >
                  <Text style={styles.buttonText}>Xem chi tiết</Text>
                </Pressable>
              </View>
              <View style={styles.priceInfo}>
                {item.totalPrice !== item.finalPrice && (
                  <Text style={styles.originalPrice}>${item.totalPrice}</Text>
                )}

                <Text style={styles.finalPrice}>${item.finalPrice}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.orderList}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.primary,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  mallIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  sellerName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
  },
  chatButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  shopButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  orderBody: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productQuantity: {
    color: "#777",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  footerButtons: {
    flexDirection: "row",
  },
  reorderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 10,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#9e9e9e",
    fontSize: 14,
  },
  finalPrice: {
    color: "#ff5722",
    fontSize: 18,
    fontWeight: "bold",
  },
  orderList: {
    paddingBottom: 20,
  },
});
