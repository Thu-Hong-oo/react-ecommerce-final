import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import COLORS from "../components/Colors";
import { Icon } from "react-native-elements";

export default function Screen06({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Icon name="left" type="antdesign" size={20} color="gray" />
        </TouchableOpacity>
        <Text style={styles.title}>T-Shirt</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <Image
          source={require("../assets/imgs/yellowT-shirt.png")}
          style={styles.mainImage}
        />

        {/* Thumbnails */}
        <View style={styles.thumbnailContainer}>
          <Image source={require("../assets/imgs/greenT-shirt.png")} />
          <Image
            source={require("../assets/imgs/pinkt-shirt.png")}
            style={styles.thumbnail}
          />
          <Image
            source={require("../assets/imgs/greenT-shirt.png")}
            style={styles.thumbnail}
          />
          <Image
            source={require("../assets/imgs/redT-shirt.png")}
            style={styles.thumbnail}
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>$2,99</Text>
            <Text style={styles.promotion}>Buy 1 get 1</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.productName}>Hoodie shirt</Text>
              <Text style={styles.productDescription}>
                Occaecat est deserunt tempor officia
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color={COLORS.yellow} />
              <Text style={styles.rating}>4.5</Text>
            </View>
          </View>
        </View>

        {/* Color Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionTitle}>Color</Text>
          <View style={styles.colorOptions}>
            <View style={[styles.colorCircle, { backgroundColor: "red" }]} />
            <View style={[styles.colorCircle, { backgroundColor: "gray" }]} />
            <View style={[styles.colorCircle, { backgroundColor: "blue" }]} />
          </View>
        </View>

        {/* Size Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionTitle}>Size</Text>
          <View style={styles.sizeOptions}>
            <TouchableOpacity style={styles.sizeButton}>
              <Text>XS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeButton}>
              <Text>S</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sizeButton, styles.selectedSizeButton]}
            >
              <Text style={styles.selectedSizeText}>M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeButton}>
              <Text>L</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeButton}>
              <Text>XL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quantity and Total */}
        <View style={styles.quantityContainer}>
          <Text style={styles.optionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton}>
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>2</Text>
            <TouchableOpacity style={styles.quantityButton}>
              <Text>+</Text>
            </TouchableOpacity>
            <Text style={styles.total}>Total $4,98</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.textRow}>Size guide</Text>
          <Icon name="right" type="antdesign" size={20} color="gray" />
        </View>
        <View style={styles.row}>
          <Text style={styles.textRow}>Reviews (99)</Text>
          <Icon name="right" type="antdesign" size={20} color="gray" />
        </View>
        <View style={styles.row}></View>
        {/* Footer Button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Icon name="cart-outline" type="ionicon" size={20} color="white" />
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
  promotion: {
    marginLeft: 10,
    color: "green",
    backgroundColor: "#F3FCF0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  productName: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 8,
  },
  productDescription: {
    color: "#555",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rating: {
    marginLeft: 5,
    color: "#333",
    fontWeight: "bold",
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  colorOptions: {
    flexDirection: "row",
    marginTop: 8,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  sizeOptions: {
    flexDirection: "row",
    marginTop: 8,
  },
  sizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    marginRight: 8,
  },
  selectedSizeButton: {
    backgroundColor: "orange",
  },
  selectedSizeText: {
    color: "#fff",
  },
  quantityContainer: {
    marginTop: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  total: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "600",
  },
  addToCartButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    marginTop: 15,
  },
  textRow: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
