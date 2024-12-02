import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { Icon, CheckBox } from "react-native-elements";
import COLORS from "../components/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";
import ModalMessage from "../components/ModalMeassage";
import { setSelectedItems, setTotalPrice } from "../redux/slices/orderSlice";

const CartRender = ({
  item,
  handleUpdateQuantity,
  handleRemoveItem,
  handleCheckboxChange,
  isChecked,
  onQuantityChange, // Thêm prop để truyền hàm cập nhật số lượng
}) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [modalVisible, setModalVisible] = useState(false);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleUpdateQuantity(item.firestoreId, newQuantity);
    onQuantityChange(item.firestoreId, newQuantity); // Cập nhật số lượng cho tổng tiền
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleUpdateQuantity(item.firestoreId, newQuantity);
      onQuantityChange(item.firestoreId, newQuantity); // Cập nhật số lượng cho tổng tiền
    }
  };

  const handleConfirm = () => {
    handleRemoveItem(item.firestoreId);
    setModalVisible(false);
  };

  const handleCancel = () => {
    console.log("Hủy!");
    setModalVisible(false);
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemLeft}>
        <CheckBox
          containerStyle={styles.checkbox}
          checked={isChecked}
          onPress={() => handleCheckboxChange(item, !isChecked)}
        />
        <Image source={{ uri: item.img }} style={styles.image} />
        <View style={styles.itemDetails}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.colorText}>{item.size}</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrease}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrease}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${totalPrice}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <ModalMessage
            visible={modalVisible}
            message="Bạn có chắc chắn muốn xóa sản phẩm này ra khỏi giỏ hàng?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            singleButton={false}
          />
          <Icon
            name="delete-sweep-outline"
            type="material-community"
            color={COLORS.red}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default function Cart({ navigation }) {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItemsState] = useState([]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const handleUpdateQuantity = async (firestoreId, newQuantity) => {
    if (!userId) {
      console.error("User  ID is not defined");
      return;
    }
    if (!firestoreId) {
      console.error("Firestore ID is required");
      return;
    }
    console.log(
      "Updating quantity for Firestore ID:",
      firestoreId,
      "to",
      newQuantity
    );

    try {
      await dispatch(
        updateCartItemQuantity({ firestoreId, quantity: newQuantity, userId })
      ).unwrap();
      console.log("Quantity updated successfully");

      // Cập nhật selectedItems với số lượng mới
      setSelectedItemsState((prevState) => {
        return prevState.map((item) => {
          if (item.firestoreId === firestoreId) {
            return { ...item, quantity: newQuantity }; // Cập nhật số lượng
          }
          return item;
        });
      });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = (firestoreId) => {
    dispatch(removeFromCart({ userId, firestoreId }))
      .unwrap()
      .then(() => {
        console.log("Item removed successfully");
        // Cập nhật lại trạng thái giỏ hàng trong Redux
        dispatch(fetchCartItems(userId)); // Lấy lại danh sách giỏ hàng mới
      })
      .catch((err) => {
        console.error("Failed to remove item:", err);
      });
  };

  const handleCheckboxChange = (item, isChecked) => {
    if (isChecked) {
      // Kiểm tra xem sản phẩm đã có trong danh sách chọn chưa
      setSelectedItemsState((prevState) => {
        // Thêm sản phẩm nếu chưa có trong danh sách chọn
        if (
          !prevState.some(
            (selectedItem) => selectedItem.firestoreId === item.firestoreId
          )
        ) {
          return [...prevState, item];
        }
        return prevState;
      });
    } else {
      // Xóa sản phẩm khỏi danh sách chọn nếu bỏ chọn
      setSelectedItemsState((prevState) =>
        prevState.filter(
          (selectedItem) => selectedItem.firestoreId !== item.firestoreId
        )
      );
    }
  };

  const handleProceedToCheckout = () => {
    const total = selectedItems.reduce((acc, item) => {
      const itemPrice = item.price * item.quantity; // Sử dụng số lượng đã cập nhật
      return acc + itemPrice; // Cộng dồn vào tổng
    }, 0);

    dispatch(setSelectedItems(selectedItems)); // Lưu các sản phẩm đã chọn vào orderSlice
    dispatch(setTotalPrice(total)); // Lưu totalPrice vào orderSlice
    navigation.navigate("Checkout"); // Chuyển hướng đến màn hình Checkout
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" type="fontawesome" size={35} color="#555" />
        </Pressable>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text></Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.firestoreId}
        renderItem={({ item }) => (
          <CartRender
            item={item}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
            handleCheckboxChange={handleCheckboxChange}
            isChecked={selectedItems.some(
              (selectedItem) => selectedItem.firestoreId === item.firestoreId
            )}
          />
        )}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total:</Text>
        <Text style={styles.summaryPrice}>
          $
          {selectedItems
            .reduce((acc, selectedItem) => {
              // Tìm sản phẩm trong items dựa trên firestoreId
              const item = items.find(
                (item) => item.firestoreId === selectedItem.firestoreId
              );
              if (item) {
                // Nếu tìm thấy sản phẩm, cộng dồn giá trị
                return acc + item.price * (selectedItem.quantity || 1);
              }
              return acc; // Nếu không tìm thấy, trả về giá trị tích lũy
            }, 0) // Khởi tạo giá trị tích lũy là 0
            .toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleProceedToCheckout}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cartItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginLeft: 10,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 8,
  },
  colorText: {
    fontSize: 12,
    color: "gray",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  checkoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkbox: {
    padding: 0,
    margin: 0,
  },
});
