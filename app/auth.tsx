import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../redux/slices/authSlice";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const validateAndSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
      alert("Please fill all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "fail@test.com") {
        throw new Error("Server validation failed.");
      }

      dispatch(setAuthenticated(true));
      router.replace("/(tabs)/profile");

    } catch (err: any) {
      alert(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInLater = () => {
    // Optional: You can dispatch an unauthenticated state or guest mode
    dispatch(setAuthenticated(false)); // Optional if your logic supports it
    router.replace("/(tabs)");
  };

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#07689c" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back!"}</Text>

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={validateAndSubmit}>
          <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setIsSignUp((prev) => !prev)}>
        <Text style={styles.toggleText}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* 👇 New Sign In Later button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSignInLater}>
        <Text style={styles.skipText}>Sign In Later</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#07689c",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#07689c",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
  },
  secondaryButton: {
    backgroundColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  toggleText: {
    marginTop: 16,
    textAlign: "center",
    color: "#07689c",
    textDecorationLine: "underline",
  },
  skipButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  skipText: {
    color: "gray",
    fontStyle: "italic",
  },
});
