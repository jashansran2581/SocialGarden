import React, { useState } from "react";
import axios from "axios";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";

const API_KEY = "b10b103ace4c4679b26cf2d84d4efc32"; // Same API key

const Signup = () => {
  const [values, setValues] = useState<{ email: string; password: string; confirmPassword: string }>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ email: string; password: string; confirmPassword: string }>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter(); // Router to navigate

  // Email existence check function
  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`
      );
      const { deliverability } = response.data;
      return deliverability === "DELIVERABLE";
    } catch (error) {
      console.error("Error checking email", error);
      return false;
    }
  };

  // Validation function
  const validate = async (values: { email: string; password: string; confirmPassword: string }) => {
    let errorMessages = { email: "", password: "", confirmPassword: "" };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (!values.email) {
      errorMessages.email = "Email should not be empty";
    } else if (!emailPattern.test(values.email)) {
      errorMessages.email = "Invalid email format";
    } else {
      const emailExists = await checkEmailExists(values.email);
      if (emailExists) {
        errorMessages.email = "Email already exists";
      }
    }

    if (!values.password) {
      errorMessages.password = "Password should not be empty";
    } else if (!passwordPattern.test(values.password)) {
      errorMessages.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, and numbers";
    }

    if (values.password !== values.confirmPassword) {
      errorMessages.confirmPassword = "Passwords do not match";
    }

    return errorMessages;
  };

  const handleInput = (name: string, value: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const validationErrors = await validate(values); // Await validation
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password && !validationErrors.confirmPassword) {
      console.log("Sign-up Successful");
      
      // Handle the actual signup process here (e.g., send data to server)
      // After the signup is successful, navigate to the login screen
      alert("Sign-up successful! Please log in."); // Optional success message

      // Redirect to the login page
      router.replace("/modals/login");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Sign-up</Text>

        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Enter Email"
            placeholderTextColor="#A9A9A9"
            value={values.email}
            onChangeText={(text) => handleInput("email", text)}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Enter Password"
            placeholderTextColor="#A9A9A9"
            value={values.password}
            onChangeText={(text) => handleInput("password", text)}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Confirm Password"
            placeholderTextColor="#A9A9A9"
            value={values.confirmPassword}
            onChangeText={(text) => handleInput("confirmPassword", text)}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    loginBox: {
      width: "80%",
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
    signUpLink: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    signUpText: {
      color: Colors.primary,
      fontWeight: "bold",
      marginLeft: 5,
    },
    
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 15,
    },
    input: {
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    errorText: {
      color: "red",
      fontSize: 12,
    },
    button: {
      backgroundColor: "#28a745",
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    separatorView: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      marginVertical: 30,
    },
    separator: {
      color: Colors.grey,
      fontSize: 16,
      marginHorizontal: 5,
    },
    btnOutline: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: Colors.grey,
      height: 50,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      paddingHorizontal: 10,
    },
    btnOutlineText: {
      color: "#000",
      fontSize: 16,
    },
  });
  