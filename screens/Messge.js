import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { GiftedChat, Message } from "react-native-gifted-chat";
import { getLastedProducts } from "../services/productService";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/slices/productSlice";
import { useNavigation } from "@react-navigation/native";
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]); // Khai báo state cho sản phẩm
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    // Khởi tạo tin nhắn chào mừng từ chatbot
    setMessages([
      {
        _id: 1,
        text: "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?",
        createdAt: new Date(),
        user: {
          _id: 2, // ID của chatbot
          name: "ChatBot",
        },
      },
    ]);

    // Fetch dữ liệu sản phẩm
    const loadProducts = async () => {
      try {
        const products = await getLastedProducts(); // Gọi hàm fetch từ dịch vụ
        setAvailableProducts(products); // Lưu sản phẩm vào state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts(); // Gọi hàm fetch khi component được mount
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
    handleUserMessage(newMessages[0].text); // Xử lý tin nhắn của người dùng
  };

  const handleUserMessage = (text) => {
    const cleanedText = text.trim().toLowerCase();
    let response = "";

    if (cleanedText.includes("mua") || cleanedText.includes("sản phẩm")) {
      response = "Bạn muốn mua sản phẩm gì?";
    } else if (cleanedText.includes("đặt hàng")) {
      response = "Bạn muốn đặt hàng sản phẩm nào?";
    } else if (cleanedText.includes("trả hàng")) {
      response = "Bạn muốn trả hàng nào? Vui lòng cung cấp thông tin sản phẩm.";
    } else if (cleanedText.includes("thông tin sản phẩm")) {
      response = "Bạn cần thông tin về sản phẩm nào?";
    } else if (cleanedText.includes("giá")) {
      response = "Bạn muốn biết giá của sản phẩm nào?";
    } else if (cleanedText.includes("khuyến mãi")) {
      response =
        "Hiện tại có nhiều chương trình khuyến mãi. Bạn muốn biết về sản phẩm nào?";
    } else if (cleanedText.includes("giao hàng")) {
      response =
        "Thời gian giao hàng tùy thuộc vào địa chỉ của bạn. Bạn có thể cho tôi biết địa chỉ giao hàng không?";
    } else if (cleanedText.includes("hỗ trợ")) {
      response = "Bạn cần hỗ trợ về vấn đề gì?";
    } else if (cleanedText.includes("đổi hàng")) {
      response = "Bạn muốn đổi hàng nào? Vui lòng cung cấp thông tin sản phẩm.";
    } else if (cleanedText.includes("thanh toán")) {
      response =
        "Chúng tôi hỗ trợ nhiều phương thức thanh toán. Bạn muốn biết thêm chi tiết về phương thức nào?";
    } else if (cleanedText.includes("liên hệ")) {
      response =
        "Bạn có thể liên hệ với chúng tôi qua số điện thoại hoặc email nào?";
    } else {
      // Tìm kiếm sản phẩm nếu không thuộc câu hỏi khác
      const matchedProducts = availableProducts.filter((product) =>
        product.name.toLowerCase().includes(cleanedText)
      );

      if (matchedProducts.length > 0) {
        response = "Dưới đây là các sản phẩm phù hợp với yêu cầu của bạn:";
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: previousMessages.length + 1,
              text: response,
              createdAt: new Date(),
              user: {
                _id: 2, // ID của chatbot
                name: "ChatBot",
              },
              products: matchedProducts, // Đính kèm danh sách sản phẩm
            },
          ])
        );
        return;
      } else {
        response = "Xin lỗi, tôi không hiểu. Bạn có thể hỏi lại được không?";
      }
    }

    // Gửi phản hồi từ chatbot
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: previousMessages.length + 1,
          text: response,
          createdAt: new Date(),
          user: {
            _id: 2, // ID của chatbot
            name: "ChatBot",
          },
        },
      ])
    );
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.products) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{currentMessage.text}</Text>
          <View style={styles.productList}>
            {currentMessage.products.map((product) => (
              <View key={product.id} style={styles.productContainer}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedProduct(product));
                    navigation.navigate("DetailProduct");
                  }}
                >
                  <Image
                    source={{ uri: product.mainImage }}
                    style={styles.productImage}
                  />
                </TouchableOpacity>

                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return <Message {...props} />;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1, // ID của người dùng
        }}
        renderMessage={renderMessage} // Sử dụng render tùy chỉnh
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  productContainer: {
    width: 120,
    marginRight: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});

export default ChatBot;
