import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthenticated, setUser } from "../../redux/slices/authSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  // Get user data from Redux store
  const user = useSelector((state: any) => state.auth.user);
  const [token, setToken] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get token from AsyncStorage on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        setToken(storedToken);
        if (storedToken) {
          fetchUserProfile(storedToken);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    getToken();
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (authToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://10.0.2.2:4001/users/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      dispatch(setUser(data));
      setUpdatedName(data.name);
      setUpdatedEmail(data.email);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile data");
      console.error("Profile fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      dispatch(setAuthenticated(false));
      router.replace("/auth");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handleUpdate = () => {
    setIsModalVisible(true);
  };

  const handleConfirmUpdate = async () => {
    if (!token) {
      Alert.alert("Error", "Authentication token not found");
      return;
    }

    if (!updatedName || !updatedEmail) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    setIsUpdating(true);
    try {
      const updateData: any = {
        name: updatedName,
        email: updatedEmail,
      };

      if (newPassword) {
        updateData.newPassword = newPassword;
      }

      const response = await fetch("http://10.0.2.2:4001/users/profile", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser));
      
      Alert.alert("Success", "Profile updated successfully");
      setIsModalVisible(false);
      setNewPassword("");
    } catch (error: any) {
      Alert.alert("Update Failed", error.message || "Failed to update profile");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsModalVisible(false);
    setUpdatedName(user?.name || "");
    setUpdatedEmail(user?.email || "");
    setNewPassword("");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user?.name || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Update Profile Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelUpdate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={updatedName}
              onChangeText={setUpdatedName}
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              value={updatedEmail}
              onChangeText={setUpdatedEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="New Password (optional)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#888"
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancelUpdate}
                disabled={isUpdating}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleConfirmUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  profileInfo: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  signOutButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
});