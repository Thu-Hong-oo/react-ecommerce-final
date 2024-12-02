import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  ScrollView,
  TextInput,
  ImageBackground,
} from "react-native";
import { Icon, Rating } from "react-native-elements";
import { useSelector } from "react-redux";
import COLORS from "../components/Colors";
import { useNavigation } from "@react-navigation/native";

export default function Screen09({ navigation }) {
  const finalPrice = useSelector((state) => state.order.finalPrice);
  const totalPrice = useSelector((state) => state.order.totalPrice);
  const paymentMethod = useSelector((state) => state.order.paymentMethod);
  const handleBackToHome = () => {
    // Điều hướng về trang chủ
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.row}>
        </View>
      </View>

      <View style={{ flex: 5 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.notice}>
            <View style={styles.noticeIcon}>
              <Icon name="check" color="white" size={42} />
            </View>
            <Text style={styles.noticeText1}>Order placed successfully!</Text>

            <Text style={styles.noticeText2}>
              Commodo eu ut sunt qui minim fugiat elit nisi enim
            </Text>
          </View>

          <View style={styles.paymentDetail}>
            <View style={styles.paymentDetailEach}>
              <Text style={styles.paymentDetailEachText1}>Tổng tiền</Text>
              <Text style={styles.paymentDetailEachText1}>${totalPrice}</Text>
            </View>

            <View style={styles.paymentDetailEach}>
              <Text style={styles.paymentDetailEachText1}>
                Số tiền cần thanh toán
              </Text>
              <Text style={styles.paymentDetailEachText1}>${finalPrice}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <View style={[styles.hr, { width: "90%" }]} />
            </View>

            <View style={styles.paymentDetailEach}>
              <Text style={styles.paymentDetailEachText1}>
                Phương thức thanh toán
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.paymentDetailEachText1}>
                  {paymentMethod}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.backToHome}>
            <Pressable style={styles.buttonBackToHome} onPress={()=>navigation.navigate('Home')}>

              <Icon name="house" color="white" size={32} />
              <Text style={styles.buttonBackToHomeText}>Back to home </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hr: { height: 1, backgroundColor: "lightgray", marginTop: 10 },

  header: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 3,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  itemRight: { flexDirection: "row", alignItems: "center" },
  alldeals: { paddingHorizontal: 10, fontSize: 16, fontWeight: "bold" },
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
  },

  notice: {
    alignItems: "center",
    flex: 4,
  },
  noticeIcon: {
    backgroundColor: "#17A948",
    height: 70,
    width: 70,
    justifyContent: "center",
    borderRadius: "100%",
  },
  noticeText1: {
    paddingTop: 10,
    color: "#FF6026",
    fontWeight: 500,
    fontSize: 20,
    paddingHorizontal: 8,
  },
  noticeText2: {
    paddingTop: 10,
    color: "#9095A0",
    fontWeight: 500,
    fontSize: 15,
    width: "75%",
    textAlign: "center",
  },

  paymentMethodEachImg: {
    width: 35,
    height: 35,
    borderRadius: "100%",
    borderWidth: 0.5,
    borderColor: "#BCC1CA",
  },
  paymentDetail: {
    backgroundColor: "#FAFAFB",
    paddingVertical: 20,
    margin: 10,
    borderRadius: 6,
    flex: 4.5,
  },
  paymentDetailEach: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  paymentDetailEachText1: {
    fontSize: 15,
    color: "#565E6C",
    paddingHorizontal: 8,
  },
  paymentDetailEachSucessIcon: {
    borderRadius: 10,
    backgroundColor: "#EEFDF3",
    padding: 8,
    lineHeight: 8,
  },
  ratingExperience: {
    alignItems: "center",
    flex: 1.2,
  },
  backToHome: {
    marginTop: 15,
    paddingHorizontal: 20,
    flex: 1.3,
  },
  buttonBackToHome: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 6,
    paddingVertical: 10,
  },
  buttonBackToHomeText: {
    color: "white",
    fontWeight: 400,
    fontSize: 20,
    paddingHorizontal: 8,
  },
  addNewCardText: {
    color: "#FF6026",
    fontWeight: 400,
    fontSize: 20,
    paddingHorizontal: 8,
  },
});
