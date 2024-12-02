import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={20} color="#555" />
        </Pressable>
        <Text style={styles.headerText}>Notification</Text>
        <Icon name="cog" size={24} color="#555" />
      </View>

      {/* Recent Section */}
      <Text style={styles.sectionTitle}>Recent</Text>

      {/* Notification Items */}
      <View style={styles.notificationContainer}>
        {/* Purchase Completed */}
        <View style={styles.notificationItem}>
          <Icon
            name="shopping-cart"
            size={28}
            color="#6B7280"
            style={styles.icon}
          />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Purchase Completed!</Text>
              <Text style={styles.notificationTime}>2 m ago</Text>
            </View>
            <Text style={styles.notificationText}>
              You have successfully purchased 334 headphones, thank you and wait
              for your package to arrive ✨
            </Text>
          </View>
        </View>

        {/* Message from Jerremy */}
        <View style={styles.notificationItem}>
          <Image
            source={{ uri: "https://placehold.co/40x40" }}
            style={styles.profileImage}
          />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>
                Jerremy Send You a Message
              </Text>
              <Text style={styles.notificationTime}>2 m ago</Text>
            </View>
            <Text style={styles.notificationText}>
              hello your package has almost arrived, are you at home now?
            </Text>
            <TouchableOpacity>
              <Text style={styles.replyText}>Reply the message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Flash Sale */}
        <View style={styles.notificationItem}>
          <Icon name="bolt" size={28} color="#6B7280" style={styles.icon} />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Flash Sale!</Text>
              <Text style={styles.notificationTime}>2 m ago</Text>
            </View>
            <Text style={styles.notificationText}>
              Get 20% discount for first transaction in this month! 🎉
            </Text>
          </View>
        </View>

        {/* Package Sent */}
        <View style={styles.notificationItem}>
          <Icon
            name="paper-plane"
            size={28}
            color="#6B7280"
            style={styles.icon}
          />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Package Sent</Text>
              <Text style={styles.notificationTime}>10 m ago</Text>
            </View>
            <Text style={styles.notificationText}>
              Hi your package has been sent from New York
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  notificationContainer: {
    flexDirection: "column",
    gap: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  icon: {
    marginRight: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  notificationText: {
    fontSize: 14,
    color: "#6B7280",
  },
  replyText: {
    fontSize: 14,
    color: "#3B82F6",
    marginTop: 4,
  },
});

export default App;
