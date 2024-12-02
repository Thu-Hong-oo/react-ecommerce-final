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
  CheckBox,
} from "react-native";
import { Icon, Rating } from "react-native-elements";

export default function Screen04({ navigation }) {
  const [isSelected, setSelection] = useState(false);
  const [rating, setRating] = useState(0);
  const [expandedSO, setExpandedSO] = useState(true);
  const [expandedPR, setExpandedPR] = useState(true);
  const [expandedAR, setExpandedAR] = useState(true);
  const [expandedO, setExpandedO] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.titleHeader}>
              <Text style={styles.filterHeader}>Filter</Text>
              <Icon
                name="close-outline"
                type="ionicon"
                color="darkgray"
                onPress={() => console.log("hello")}
              />
            </View>
            <View style={styles.hr} />
          </View>

          {/*Shipping options*/}
          <View>
            <View style={styles.eachRowExpandLess}>
              <Text style={styles.textEachExpandLess}>Shipping options</Text>
              <Icon
                name={expandedSO ? "expand-less" : "expand-more"}
                type="material"
                color="darkgray"
                size={30}
                onPress={() => setExpandedSO(!expandedSO)}
              />
            </View>

            {expandedSO && (
              <View>
                <View style={styles.eachCheckBox}>
                  <CheckBox value={isSelected} onValueChange={setSelection} />
                  <Text style={styles.textCheckBox}>
                    Instant (2 hours delivery)
                  </Text>
                </View>

                <View style={styles.eachCheckBox}>
                  <CheckBox value={isSelected} onValueChange={setSelection} />
                  <Text style={styles.textCheckBox}>
                    Express (2 days delivery)
                  </Text>
                </View>

                <View style={styles.eachCheckBox}>
                  <CheckBox value={isSelected} onValueChange={setSelection} />
                  <Text style={styles.textCheckBox}>
                    Standard (7- 10 days delivery)
                  </Text>
                </View>
              </View>
            )}
            <View style={{ alignItems: "center" }}>
              <View style={[styles.hr, { width: "90%" }]} />
            </View>
          </View>

          {/*Price range*/}
          <View>
            <View style={styles.eachRowExpandLess}>
              <Text style={styles.textEachExpandLess}>Price range ($)</Text>
              <Icon
                name={expandedPR ? "expand-less" : "expand-more"}
                type="material"
                color="darkgray"
                size={30}
                onPress={() => setExpandedPR(!expandedPR)} // Thay đổi trạng thái khi nhấn
              />
            </View>

            {expandedPR && (
              <View>
                <View style={styles.selectPrice}>
                  <View>
                    <Text style={styles.selectPriceText}>Min</Text>
                    <TextInput style={styles.priceInput} />
                  </View>

                  <View>
                    <Text style={styles.selectPriceText}>Max</Text>
                    <TextInput style={styles.priceInput} />
                  </View>
                </View>
              </View>
            )}
            <View style={{ alignItems: "center" }}>
              <View style={[styles.hr, { width: "90%" }]} />
            </View>
          </View>

          {/*Average review*/}
          <View>
            <View style={styles.eachRowExpandLess}>
              <Text style={styles.textEachExpandLess}>Average review</Text>
              <Icon
                name={expandedAR ? "expand-less" : "expand-more"}
                type="material"
                color="darkgray"
                size={30}
                onPress={() => setExpandedAR(!expandedAR)}
              />
            </View>

            {expandedAR && (
              <View>
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
            )}

            <View style={{ alignItems: "center" }}>
              <View style={[styles.hr, { width: "90%" }]} />
            </View>
          </View>
          {/*Others */}
          <View>
            <View style={styles.eachRowExpandLess}>
              <Text style={styles.textEachExpandLess}>Others</Text>
              <Icon
                name={expandedO ? "expand-less" : "expand-more"}
                type="material"
                color="darkgray"
                size={30}
                onPress={() => setExpandedO(!expandedO)}
              />
            </View>

            {expandedO && (
              <View>
                <View style={styles.eachOtherRow}>
                  <View style={styles.eachOther}>
                    <View>
                      <Icon name="sync" color="darkgray" size={32} />
                      <Text style={styles.eachOtherText}>
                        30-day Free Return
                      </Text>
                    </View>
                  </View>

                  <View style={styles.eachOther}>
                    <View>
                      <Icon
                        name="admin-panel-settings"
                        color="darkgray"
                        size={32}
                      />
                      <Text style={styles.eachOtherText}>Buyer Protection</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.eachOtherRow}>
                  <View style={styles.eachOther}>
                    <View>
                      <Icon name="local-offer" color="darkgray" size={32} />
                      <Text style={styles.eachOtherText}>Best Deal</Text>
                    </View>
                  </View>

                  <View style={styles.eachOther}>
                    <View>
                      <Icon name="location-on" color="darkgray" size={32} />
                      <Text style={styles.eachOtherText}>Ship to store</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={{ alignItems: "center" }}>
              <View style={[styles.hr, { width: "90%" }]} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eachOtherRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 11,
    marginBottom: 15,
  },
  eachOther: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9095A0",
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  eachOtherText: {
    textAlign: "center",
    color: "#9095A0",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  hr: { height: 1, backgroundColor: "lightgray", marginTop: 10 },
  titleHeader: {
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  filterHeader: {
    fontSize: 23,
    fontWeight: 600,
    flex: 1,
    textAlign: "center",
    color: "#171A1F",
  },
  eachRowExpandLess: {
    paddingHorizontal: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textEachExpandLess: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 600,
    color: "#171A1F",
  },
  eachCheckBox: {
    flexDirection: "row",
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  textCheckBox: {
    paddingHorizontal: 8,
    lineHeight: 15,
  },
  selectPriceText: {
    paddingBottom: 5,
    fontSize: 18,
    color: "#FF6026",
    fontWeight: 500,
    textAlign: "center",
  },
  selectPrice: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottomx: 15,
  },
  priceInput: {
    borderWidth: 1,
    width: 80,
    borderColor: "#FF6026",
    borderRadius: 3,
    outlineStyle: "none",
    textAlign: "center",
    paddingVertical: 5,
  },
});
