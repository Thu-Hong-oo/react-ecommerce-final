import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../components/Colors";
import Carousel from "../components/Carousel";
import Category from "../components/Category";
import CartIcon from "../components/CartIcon";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/slices/productSlice";
import { fetchCartItems } from "../redux/slices/cartSlice";
import { getLastedProducts } from "../services/productService";
import {
  loadFavoriteItems,
  saveProductToFavorites,
  deleteProductFromFavorites,
} from "../redux/slices/favoriteSlice";

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartStatus = useSelector((state) => state.cart.status);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const favorites = useSelector((state) => state.favorites.items);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const displayedProducts = showAllProducts ? products : products.slice(0, 6);

  useEffect(() => {
    dispatch(fetchCartItems(user.id));
    dispatch(loadFavoriteItems()); // Lấy danh sách yêu thích khi component được mount

    const fetchProducts = async () => {
      try {
        const productData = await getLastedProducts(); // Gọi hàm từ productService
        setProducts(productData); // Cập nhật danh sách sản phẩm
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm: ", error);
      } finally {
        setLoading(false); // Đặt loading thành false sau khi lấy dữ liệu
      }
    };

    fetchProducts();
  }, [dispatch, user.id]);

  const renderProduct = ({ item }) => {
    const isFavorite = favorites.includes(item.id); // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          dispatch(setSelectedProduct(item));
          navigation.navigate("DetailProduct");
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.mainImage }}
            style={styles.itemImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.heartIconContainer}
            onPress={() => {
              if (isFavorite) {
                dispatch(deleteProductFromFavorites(item.id)); // Xóa khỏi yêu thích
              } else {
                dispatch(saveProductToFavorites(item.id)); // Lưu vào yêu thích
              }
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"} // Sử dụng biểu tượng khác nhau
              size={23}
              color="#FF6B6B" // Màu sắc
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>{item.price}$</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userProfile}>
          <Image source={{ uri: user.avatar }} style={styles.userImage} />
          <View>
            <Text style={styles.userText}>Hi, {user.name}</Text>
            <Text style={styles.userSubText}>Let's go shopping</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Icon name="search" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <CartIcon navigation={navigation} />
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("home")}>
          <Text style={activeTab === "home" ? styles.tabActive : styles.tab}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("category")}>
          <Text
            style={activeTab === "category" ? styles.tabActive : styles.tab}
          >
            Category
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "home" && (
        <>
          {!showAllProducts && <Carousel />}{" "}
          {/* Ẩn Carousel nếu showAllProducts là true */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals 🔥</Text>
            {!showAllProducts && (
              <TouchableOpacity onPress={() => setShowAllProducts(true)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={displayedProducts} // Hiển thị danh sách sản phẩm đã giới hạn
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        </>
      )}

      {activeTab === "category" && <Category navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userText: {
    fontSize: 14,
    fontWeight: "500",
  },
  userSubText: {
    fontSize: 12,
    color: "#6B7280",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-around",
  },
  tab: {
    fontSize: 16,
    color: "#6B7280",
    marginRight: 16,
  },
  tabActive: {
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 16,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
  },
  row: {
    justifyContent: "space-between",
  },
  itemContainer: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 100,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  heartIconContainer: {
    position: "absolute",
    top: 3,
    right: 3,
    borderRadius: 20,
    padding: 2,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
    color: "red",
  },
});
