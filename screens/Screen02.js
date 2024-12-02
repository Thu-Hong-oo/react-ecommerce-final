import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { Icon, Rating, AirbnbRating } from "react-native-elements";
import COLORS from "../components/Colors";
import { useState, useEffect } from "react";
import { app } from "../config/firebaseConfig";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/slices/productSlice";
export default function Screen02({ navigation }) {
  const db = getFirestore(app);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const data = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((product) => product.category === "Electronics"); // Lọc sản phẩm có category là Electronics
    setProducts(data);
  };

  const [cart, setCart] = useState([]);
  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    navigation.navigate("Screen07", { cartItems: [...cart, product] }); // Điều hướng tới Screen07 với dữ liệu giỏ hàng
  };

  const renderListRow = ({ item }) => (
    <TouchableOpacity
      style={{
        borderRadius: 5,
        borderColor: COLORS.gray,
        borderWidth: 1,
        marginBottom: 10,
        paddingVertical: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        dispatch(setSelectedProduct(item));
        navigation.navigate("DetailProduct");
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item.mainImage }}
          style={{ width: 50, height: 50, marginHorizontal: 10 }}
        />

        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            {item.name}
          </Text>
          <Rating imageSize={13} />
        </View>
      </View>
      <View style={{ width: 70 }}>
        <TouchableOpacity onPress={() => addToCart(item)}>
          <Icon name="add-circle-outline" size={24} color="green" />
        </TouchableOpacity>

        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          ${item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.row}>
          <View style={styles.itemLeft}>
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="left" type="antdesign" size={25} color="gray" />
            </Pressable>
            <Text style={styles.alldeals}>Electronics</Text>
          </View>

          <View style={styles.itemRight}>
            <Icon name="cart-outline" type="ionicon" size={20} color="gray" />
            <Image
              source={require("../assets/imgs/avata.png")}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>
      </View>
      <View style={styles.viewSearch}>
        <View style={styles.inputSearch}>
          <Icon name="search" size={20} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="gray"
            style={{ paddingVertical: 3, width: "100%" }}
          ></TextInput>
        </View>
        <Pressable style={styles.buttonList}>
          <Icon name="filter-list" size={20} color="gray" />
        </Pressable>
      </View>
      <View style={styles.body}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 0.5 }}>
            <View style={styles.row}>
              <Text style={styles.title}>Categories</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>See all</Text>
                <Icon
                  name="triangle-right"
                  type="entypo"
                  size={15}
                  color="gray"
                />
              </View>
            </View>
            <View style={styles.btnCategory}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#C3EFB9",
                  borderRadius: 10,
                  padding: 8,
                }}
              >
                <Image source={require("../assets/imgs/mobileHeader.png")} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#BCDAF9",
                  borderRadius: 10,
                  padding: 8,
                }}
              >
                <Image source={require("../assets/imgs/ipadHeader.png")} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#FAE7B6",
                  borderRadius: 10,
                  padding: 8,
                }}
              >
                <Image source={require("../assets/imgs/lapTopHeader.png")} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.filter}>
            <TouchableOpacity style={styles.filterItem}>
              <Text>Best Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text>Best Matched</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text>Popular</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginTop: 20 }}>
            <FlatList data={products} renderItem={renderListRow} />
          </View>
          <TouchableOpacity style={styles.btnSeeAll}>
            <Text style={styles.textSeeAll}>See all</Text>
          </TouchableOpacity>
          <View style={styles.banner}>
            <Image
              source={require("../assets/imgs/bannerFooter.png")}
              style={{ borderRadius: 10, resizeMode: "stretch", width: null }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    marginHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  alldeals: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  viewSearch: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  inputSearch: {
    flexDirection: "row",
    backgroundColor: COLORS.gray,
    alignItems: "center",
    paddingVertical: 5,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonList: {
    marginLeft: 10,
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  body: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 15,
  },
  title: {
    fontWeight: "bold",
  },
  btnCategory: {
    flexDirection: "row",

    marginTop: 10,
    justifyContent: "space-between",
  },
  filter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  btnSeeAll: {
    backgroundColor: COLORS.gray,
    paddingVertical: 7,
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
  textSeeAll: {
    textAlign: "center",
  },
  banner: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "green",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});
