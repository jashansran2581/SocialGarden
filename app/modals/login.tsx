import React, { useState } from "react";
import axios from "axios";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";

const API_KEY = "b10b103ace4c4679b26cf2d84d4efc32";


enum Strategy {
  Google = "oauth_google",
  Facebook = "oauth_facebook",
}

const Page = () => {
  const [values, setValues] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

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
  const validate = async (values: { email: string; password: string }) => {
    let errorMessages = { email: "", password: "" };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (!values.email) {
      errorMessages.email = "Email should not be empty";
    } else if (!emailPattern.test(values.email)) {
      errorMessages.email = "Invalid email format";
    } else {
      const emailExists = await checkEmailExists(values.email);
      if (!emailExists) {
        errorMessages.email = "Email does not exist";
      }
    }

    if (!values.password) {
      errorMessages.password = "Password should not be empty";
    } else if (!passwordPattern.test(values.password)) {
      errorMessages.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, and numbers";
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

    if (!validationErrors.email && !validationErrors.password) {
      console.log("Login Successful");
      // Here you can add navigation to another screen
      // navigation.navigate("HomeScreen");
    }
  };

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Sign-in</Text>

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
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
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
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.signUpLink}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("./modals/signup")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separatorView}>
          <View
            style={{
              flex: 1,
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={styles.separator}>or</Text>
          <View
            style={{
              flex: 1,
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>

        <View style={{ gap: 20 }}>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => onSelectAuth(Strategy.Google)}
          >
            <Ionicons
              name="logo-google"
              size={24}
              style={defaultStyles.btnIcon}
            />
            <Text style={styles.btnOutlineText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Page;

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
