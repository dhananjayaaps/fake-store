import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
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
      router.replace("./(tabs)");
    } catch (err: any) {
      alert(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f4faff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#07689c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#b0bec5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  toggleText: {
    textAlign: "center",
    color: "#07689c",
    marginTop: 16,
    fontWeight: "bold",
  },
});