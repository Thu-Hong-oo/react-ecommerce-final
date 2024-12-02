// src/App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Provider, useSelector } from "react-redux"; // Sử dụng useSelector
import store from "./redux/store"; // Import store
import "@expo/metro-runtime";
import COLORS from "./components/Colors";

import Home from "./screens/Home";
import Search from "./screens/Search";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import Notification from "./screens/Notification";
import DetailProduct from "./screens/DetailProduct";
import Cart from "./screens/Cart";
import Favorite from "./screens/Favorite";
import Profile from "./screens/Profile";
import Order from "./screens/Order";

import Screen01 from "./screens/Screen01";
import Screen02 from "./screens/Screen02";
import Screen03 from "./screens/Screen03";
import Screen04 from "./screens/Screen04";
import Screen05 from "./screens/Screen04";
import Screen06 from "./screens/Screen06";
import Checkout from "./screens/Checkout";
import PaymentMethod from "./screens/PaymentMethod";
import OrderSucess from "./screens/OrderSucess";
import Screen10 from "./screens/Screen10";
import OrderDetails from "./screens/OrderDetails";
import Messge from "./screens/Messge";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Kiểm tra trạng thái người dùng, nếu đã đăng nhập thì hiển thị HomeTab, chưa thì chuyển tới SignIn
function RootNavigator() {
  const user = useSelector((state) => state.user.user); // Lấy thông tin người dùng từ Redux
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Nếu người dùng đã đăng nhập, hiển thị BottomTabs
        <Stack.Screen name="MainTabs" component={BottomTabs} />
      ) : (
        // Nếu chưa đăng nhập,
        <>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Home stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
      <Stack.Screen name="Electronics" component={Screen02} />
      <Stack.Screen name="Fresh Fruits" component={Screen03} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="OrderSucess" component={OrderSucess} />
    </Stack.Navigator>
  );
}

// My Order stack
function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="OrderDetail" component={OrderDetails} />
    </Stack.Navigator>
  );
}

// Favorite stack
function FavoriteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favorite" component={Favorite} />
    </Stack.Navigator>
  );
}
//Chat
function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chat" component={Messge} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
    </Stack.Navigator>
  );
}

// My Profile stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "OrderTab") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "FavoriteTab") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "ChatTab") {
            iconName = focused ? "chatbubble" : "chatbubble-outline"; // Thay đổi biểu tượng
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderStack}
        options={{ title: "My Order" }}
      />
      <Tab.Screen
        name="FavoriteTab"
        component={FavoriteStack}
        options={{ title: "Favorite" }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{ title: "Chat" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "My Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator /> {/* Chạy RootNavigator để điều hướng ứng dụng */}
        {/*<BottomTabs />*/}
      </NavigationContainer>
    </Provider>
  );
}
