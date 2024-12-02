import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import COLORS from "../components/Colors";

const SignUp = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create an account</Text>

        {/* Form Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username or Email"
            style={styles.input}
            placeholderTextColor="#7a7a7a"
          />
          <FontAwesome name="user" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor="#7a7a7a"
          />
          <FontAwesome name="lock" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor="#7a7a7a"
          />
          <FontAwesome name="eye" style={styles.icon} />
        </View>

        <Text style={styles.agreementText}>
          By clicking the <Text style={styles.registerText}>Register</Text>{" "}
          button, you agree to the public offer
        </Text>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>- OR Continue with -</Text>

        {/* Social Media Icons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            onPress={() => alert("Google Login")}
            style={styles.socialIconContainer}
          >
            <FontAwesome
              name="google"
              style={[styles.socialIcon, { color: "#DB4437" }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert("Apple Login")}
            style={styles.socialIconContainer}
          >
            <FontAwesome
              name="apple"
              style={[styles.socialIcon, { color: "#000000" }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert("Facebook Login")}
            style={styles.socialIconContainer}
          >
            <FontAwesome
              name="facebook"
              style={[styles.socialIcon, { color: "#3b5998" }]}
            />
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>I Already Have an Account </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 10,
    width: "90%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    fontSize: 18,
    color: "#7a7a7a",
  },
  agreementText: {
    fontSize: 12,
    color: "#7a7a7a",
    marginVertical: 10,
  },
  registerText: {
    color: COLORS.primary,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  registerButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#7a7a7a",
    marginVertical: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialIconContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 100,
    padding: 10,
    marginHorizontal: 10,
    width: 50,
  },
  socialIcon: {
    fontSize: 30,
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#7a7a7a",
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export default SignUp;
