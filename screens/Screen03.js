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
import { Icon, Rating } from "react-native-elements";
import COLORS from "../components/Colors";
import { useState, useEffect } from "react";
import { app } from "../config/firebaseConfig";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { NavigationRouteContext } from "@react-navigation/native";
import { setSelectedProduct } from "../redux/slices/productSlice";

export default function Screen03({ navigation }) {
  const db = getFirestore(app);
  const [allFreshFruit, setAllFreshFruit] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showAllRelevant, setShowAllRelevant] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // Số sản phẩm hiển thị mỗi lần
  const dispatch = useDispatch();
  useEffect(() => {
    getAllFreshFruit();
  }, []);
  const getAllFreshFruit = async () => {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const data = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((product) => product.category === "Fresh fruits");
    setAllFreshFruit(data); // Cập nhật sản phẩm vào state
  };
  console.log(allFreshFruit);

  const filteredFreshFruit = allFreshFruit.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedFreshFruit = showAll
    ? filteredFreshFruit
    : filteredFreshFruit.slice(0, 4);

  const relevantProducts = allFreshFruit.filter(
    (item) =>
      !filteredFreshFruit.some((filtered) => filtered.name === item.name)
  );

  const displayedRelevantProducts = showAllRelevant
    ? relevantProducts
    : relevantProducts.slice(0, 3);

  const renderListCol2 = ({ item }) => (
    <View style={{ height: 180, padding: 10, width: "50%" }}>
      <View
        style={{
          backgroundColor: COLORS.gray,
          width: "100%",
          height: 120,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(setSelectedProduct(item));
            navigation.navigate("DetailProduct");
          }}
        >
          <Image source={item.mainImage} style={{ width: 120, height: 120 }} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
          marginHorizontal: 10,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Icon name="add-circle-outline" size={24} color="gray" />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
          marginHorizontal: 10,
        }}
      >
        <Rating imageSize={13} />
        <Text style={{ fontWeight: "bold" }}>${item.price}</Text>
      </View>
    </View>
  );

  const renderListRow = ({ item }) => (
    <View
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
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={item.mainImage}
          style={{ width: 50, height: 50, marginHorizontal: 10 }}
        />

        <View>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            {item.name}
          </Text>
          <Rating imageSize={13} />
        </View>
      </View>
      <View style={{ marginRight: 10, alignItems: "center" }}>
        <Icon name="add-circle-outline" size={24} color="gray" />
        <Text style={{ fontWeight: "bold" }}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.row}>
          <View style={styles.itemLeft}>
            <Pressable onPress={() => navigation.navigate()}>
              <Icon name="left" type="antdesign" size={20} color="gray" />
            </Pressable>
            <Text style={styles.alldeals}>Fresh Fruit</Text>
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
            value={searchTerm} // Gán giá trị từ state
            onChangeText={(text) => setSearchTerm(text)} // Cập nhật state khi người dùng nhập
          />
        </View>
        <Pressable style={styles.buttonList}>
          <Icon name="filter-list" size={20} color="gray" />
        </Pressable>
      </View>
      <View style={{ flex: 10 }}>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Image
              source={require("../assets/imgs/banner.png")}
              style={{ width: null, resizeMode: "cover" }}
            />
          </View>
          <View style={styles.listCol2}>
            <FlatList
              data={displayedFreshFruit} // Sử dụng danh sách đã được kiểm soát
              renderItem={renderListCol2}
              numColumns={2}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSeeAll}
            onPress={() => setShowAll(true)}
          >
            <Text style={styles.textSeeAll}>See all</Text>
          </TouchableOpacity>

          {searchTerm.length > 0 && (
            <View style={styles.listRow}>
              <View style={styles.row}>
                <Text style={{ fontWeight: "bold" }}>Relevant Products</Text>
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 20,
                  }}
                  onPress={() => setShowAllRelevant((prev) => !prev)} // Chuyển đổi trạng thái
                >
                  <Text style={styles.grayText}>
                    {showAllRelevant ? "Hide" : "See all"}
                  </Text>
                  <Icon name="right" type="antdesign" size={12} color="gray" />
                </Pressable>
              </View>
              <FlatList
                style={{
                  height: 300,
                }}
                data={displayedRelevantProducts} // Chỉ hiển thị số lượng sản phẩm được chỉ định
                renderItem={renderListRow}
                keyExtractor={(item) => item.name} // Giả sử mỗi sản phẩm có tên duy nhất
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grayText: { color: "gray" },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "column",
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
  },
  banner: {
    height: 100,
    width: "100%",
    paddingHorizontal: 15,
  },

  listCol2: {
    marginTop: 40,
    marginHorizontal: 5,
  },
  btnSeeAll: {
    backgroundColor: COLORS.gray,
    paddingVertical: 7,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 25,
  },
  textSeeAll: {
    color: "gray",
    textAlign: "center",
  },

  listRow: {
    marginTop: 10,
    marginHorizontal: 15,
  },
});
