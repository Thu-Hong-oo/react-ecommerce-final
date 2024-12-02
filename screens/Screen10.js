import React, { useState } from "react";
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
  TouchableOpacity,
} from "react-native";
import { Icon, Rating } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

export default function Screen10({ navigation }) {
  const [checked, setChecked] = React.useState("first");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.row}>
          <View style={styles.itemLeft}>
            <Pressable>
              <Icon name="left" type="antdesign" size={20} color="gray" />
            </Pressable>
            <Text style={styles.alldeals}>Feedback</Text>
          </View>

          <View style={styles.itemRight}>
            <Icon name="cart-outline" type="ionicon" size={20} color="gray" />
            <Image
              source={require("../assets/imgs/beauty.png")}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 10 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={[styles.hr, { width: "100%" }]} />

          <View style={[styles.feeling, { flex: 1 }]}>
            <Icon name="sentiment-dissatisfied" size={50} color="gray" />
            <Icon name="sentiment-neutral" size={50} color="gray" />
            <Icon name="sentiment-satisfied" size={50} color="gray" />
          </View>

          <View style={[styles.shareMore, { flex: 2 }]}>
            <Text style={styles.shareMoreText}>Care to share more?</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Type your feedbacks"
              placeholderTextColor="#BCC1CA"
              style={styles.shareMoreInput}
            />
          </View>

          <View style={[styles.shareMore, { flex: 1.5 }]}>
            <Text style={styles.shareMoreText}>Upload images</Text>

            <View style={styles.feedBackImage}>
              <TouchableOpacity style={styles.toUpload} onPress={pickImage}>
                <Icon name="add" size={40} />
              </TouchableOpacity>

              {image && (
                <Image source={{ uri: image }} style={styles.imageUpload} />
              )}
            </View>
          </View>

          <View style={[styles.shareMore, { flex: 1 }]}>
            <Text style={styles.shareMoreText}>Rating</Text>
            <Rating
              type="custom"
              ratingColor="#F3C63F"
              ratingBackgroundColor="#DEE1E6"
              ratingCount={5}
              imageSize={30}
              onFinishRating={this.ratingCompleted}
              style={{ paddingVertical: 10, width: "90%" }}
            />
          </View>

          <View style={[styles.backToHome, { flex: 1 }]}>
            <TouchableOpacity style={styles.buttonBackToHome}>
              <Text style={styles.buttonBackToHomeText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  feedBackImage: {
    flexDirection: "row",
    paddingVertical: 10,
    width: "100%",
  },
  imageUpload: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 6,
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  toUpload: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#BCC1CA",
    marginHorizontal: 10,
    borderRadius: 6,
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  shareMoreInput: {
    backgroundColor: "#F3F4F6",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontWeight: 500,
    borderRadius: 6,
  },
  shareMoreText: {
    color: "#323842",
    fontWeight: 500,
    fontSize: 16,
  },
  shareMore: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  feeling: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    width: "65%",
  },
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

  backToHome: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 20,
    flex: 1.3,
  },
  buttonBackToHome: {
    backgroundColor: "#FF6026",
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
