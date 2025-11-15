import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ref,
  set,
  get,
  update,
  onValue,
  off,
  push,
  remove,
} from "firebase/database";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";

// Add this function at the top after imports
const createUserIfNotExists = async (userId, email, name) => {
  try {
    const userRef = ref(db, "users/" + userId);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        budget: 0,
        expenses: [],
        totalSpent: 0,
        email: email,
        name: name || "User",
        createdAt: new Date().toISOString(),
        id: userId,
      });
      console.log("✅ New user created in database:", userId);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};

export default function CollaborationScreen({ navigation }) {
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Initialize database structure
  const initializeDatabaseStructure = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No user for initialization");
        return;
      }

      console.log("🔧 Initializing database structure...");

      // ✅ FIX: Ensure current user exists in database
      await createUserIfNotExists(
        currentUser.uid,
        currentUser.email,
        currentUser.displayName
      );

      console.log("✅ Database connection successful");

      // The collaboration nodes will be created automatically when first used
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      Alert.alert(
        "Database Error",
        "Failed to initialize database. Please check your connection."
      );
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user logged in");
      setInitializing(false);
      return;
    }

    console.log("Setting up listeners for user:", currentUser.uid);

    // Initialize database first
    initializeDatabaseStructure();

    // Listen for collaboration requests
    const requestsRef = ref(db, "collaborationRequests");
    const requestsUnsubscribe = onValue(
      requestsRef,
      (snapshot) => {
        const requestsData = snapshot.val() || {};
        const requestsList = [];

        for (let id in requestsData) {
          const request = requestsData[id];
          if (
            request.toUserId === currentUser.uid &&
            request.status === "pending"
          ) {
            requestsList.push({ id, ...request });
          }
        }
        setRequests(requestsList);
      },
      (error) => {
        console.error("Error listening to requests:", error);
      }
    );

    // Listen for collaborations
    const collabRef = ref(db, "collaborations");
    const collabUnsubscribe = onValue(
      collabRef,
      (snapshot) => {
        const collabData = snapshot.val() || {};
        const collabList = [];
        const sharedList = [];

        for (let id in collabData) {
          const collab = collabData[id];
          if (
            collab.user1Id === currentUser.uid ||
            collab.user2Id === currentUser.uid
          ) {
            collabList.push({ id, ...collab });

            // If budget is shared and current user is not the owner, add to shared budgets
            if (collab.budgetShared && collab.user1Id !== currentUser.uid) {
              sharedList.push({ id, ...collab });
            }
          }
        }
        setCollaborations(collabList);
        setSharedBudgets(sharedList);
      },
      (error) => {
        console.error("Error listening to collaborations:", error);
      }
    );

    return () => {
      console.log("Cleaning up listeners");
      off(requestsRef);
      off(collabRef);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigation to login screen will be handled by your auth state listener
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  const searchUser = async () => {
    if (!searchEmail) {
      Alert.alert("Error", "Please enter an email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSearchLoading(true);
    setFoundUser(null);

    try {
      console.log("Searching for user with email:", searchEmail);

      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      const usersData = snapshot.val() || {};

      let foundUserData = null;
      for (let userId in usersData) {
        const user = usersData[userId];
        if (
          user.email &&
          user.email.toLowerCase() === searchEmail.toLowerCase()
        ) {
          foundUserData = {
            id: userId,
            ...user,
          };
          break;
        }
      }

      if (!foundUserData) {
        console.log("No user found with email:", searchEmail);
        Alert.alert(
          "Not Found",
          "No user found with this email. Make sure they have registered with QuickCount."
        );
        return;
      }

      if (foundUserData.id === auth.currentUser.uid) {
        Alert.alert("Error", "You cannot send request to yourself");
        return;
      }

      console.log("Found user:", foundUserData);
      setFoundUser(foundUserData);
    } catch (error) {
      console.error("Error searching user:", error);
      Alert.alert(
        "Error",
        "Failed to search user. Please check your internet connection."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const sendCollaborationRequest = async () => {
    if (!foundUser) return;

    setSendingRequest(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in to send requests");
        return;
      }

      // ✅ FIX: Ensure current user exists in database FIRST
      await createUserIfNotExists(
        currentUser.uid,
        currentUser.email,
        currentUser.displayName
      );

      // Get current user data
      const userRef = ref(db, "users/" + currentUser.uid);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData) {
        Alert.alert("Error", "User data not found even after creation");
        return;
      }

      // Create the request data
      const requestData = {
        fromUserId: currentUser.uid,
        fromUserName: userData.name || currentUser.email,
        fromUserEmail: currentUser.email,
        toUserId: foundUser.id,
        toUserEmail: foundUser.email,
        status: "pending",
        createdAt: new Date().toISOString(),
        budgetShared: false,
      };

      // Save the request
      const newRequestRef = push(ref(db, "collaborationRequests"));
      await set(newRequestRef, requestData);

      Alert.alert("Success", "Collaboration request sent!");
      setFoundUser(null);
      setSearchEmail("");
    } catch (error) {
      console.error("❌ ERROR sending request:", error);
      Alert.alert("Error", `Failed to send request: ${error.message}`);
    } finally {
      setSendingRequest(false);
    }
  };

  const handleRequestResponse = async (requestId, accepted) => {
    try {
      const requestRef = ref(db, "collaborationRequests/" + requestId);
      const requestSnapshot = await get(requestRef);
      const request = requestSnapshot.val();

      if (!request) {
        Alert.alert("Error", "Request not found");
        return;
      }

      // ✅ FIX: Ensure current user exists before creating collaboration
      await createUserIfNotExists(
        auth.currentUser.uid,
        auth.currentUser.email,
        auth.currentUser.displayName
      );

      if (accepted) {
        // Create collaboration
        const newCollabRef = push(ref(db, "collaborations"));
        await set(newCollabRef, {
          user1Id: request.fromUserId,
          user1Name: request.fromUserName,
          user1Email: request.fromUserEmail,
          user2Id: request.toUserId,
          user2Name: auth.currentUser.displayName || auth.currentUser.email,
          user2Email: auth.currentUser.email,
          createdAt: new Date().toISOString(),
          budgetShared: false,
        });

        // Update request status
        await update(requestRef, {
          status: "accepted",
          respondedAt: new Date().toISOString(),
          collaborationId: newCollabRef.key,
        });

        Alert.alert("Success", "Collaboration request accepted!");
      } else {
        // Reject request
        await update(requestRef, {
          status: "rejected",
          respondedAt: new Date().toISOString(),
        });
        Alert.alert("Success", "Collaboration request rejected.");
      }
    } catch (error) {
      console.error("Error handling request:", error);
      Alert.alert("Error", "Failed to process request");
    }
  };

  const toggleBudgetSharing = async (collabId, currentState) => {
    try {
      const collabRef = ref(db, "collaborations/" + collabId);
      await update(collabRef, {
        budgetShared: !currentState,
        budgetSharedUpdated: new Date().toISOString(),
      });

      Alert.alert(
        "Success",
        `Budget sharing ${!currentState ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error toggling budget sharing:", error);
      Alert.alert("Error", "Failed to update budget sharing");
    }
  };

  const viewSharedBudget = async (collab) => {
    try {
      const userRef = ref(db, "users/" + collab.user1Id);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData) {
        Alert.alert("Error", "User data not found");
        return;
      }

      setSelectedCollaboration({
        ...collab,
        sharedBudget: userData.budget || 0,
        sharedExpenses: userData.expenses || {},
      });
      setModalVisible(true);
    } catch (error) {
      console.error("Error viewing shared budget:", error);
      Alert.alert("Error", "Failed to load shared budget");
    }
  };

  const removeCollaboration = async (collabId) => {
    try {
      await remove(ref(db, "collaborations/" + collabId));
      Alert.alert("Success", "Collaboration removed");
    } catch (error) {
      console.error("Error removing collaboration:", error);
      Alert.alert("Error", "Failed to remove collaboration");
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        {item.fromUserName} wants to collaborate
      </Text>
      {item.status === "pending" ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleRequestResponse(item.id, true)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleRequestResponse(item.id, false)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.statusText}>Status: {item.status}</Text>
      )}
    </View>
  );

  const renderCollaborationItem = ({ item }) => (
    <View style={styles.collabItem}>
      <Text style={styles.collabText}>
        Collaborating with:{" "}
        {item.user1Id === auth.currentUser.uid
          ? item.user2Name
          : item.user1Name}
      </Text>
      <Text style={styles.collabDate}>
        Since: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      {item.user1Id === auth.currentUser.uid ? (
        // Current user is the budget owner
        <View style={styles.budgetSharingSection}>
          <Text style={styles.sharingText}>
            Budget Sharing: {item.budgetShared ? "Enabled" : "Disabled"}
          </Text>
          <TouchableOpacity
            style={[
              styles.sharingButton,
              item.budgetShared ? styles.disableButton : styles.enableButton,
            ]}
            onPress={() => toggleBudgetSharing(item.id, item.budgetShared)}
          >
            <Text style={styles.buttonText}>
              {item.budgetShared ? "Disable Sharing" : "Enable Sharing"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Current user is collaborator
        <View style={styles.budgetSharingSection}>
          <Text style={styles.sharingText}>
            Budget Access: {item.budgetShared ? "Granted" : "Not Granted"}
          </Text>
          {item.budgetShared && (
            <TouchableOpacity
              style={styles.viewBudgetButton}
              onPress={() => viewSharedBudget(item)}
            >
              <Text style={styles.buttonText}>View Shared Budget</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeCollaboration(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove Collaboration</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSharedBudgetItem = ({ item }) => (
    <View style={styles.sharedBudgetItem}>
      <Text style={styles.budgetOwner}>{item.user1Name}'s Budget</Text>
      <Text style={styles.budgetAmount}>₱{item.sharedBudget || 0}</Text>
      <TouchableOpacity
        style={styles.viewBudgetButton}
        onPress={() => viewSharedBudget(item)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>
          Initializing collaboration system...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Logout */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>👥 Collaboration</Text>
            <Text style={styles.subtitle}>Work together on shared budgets</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Search User */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter user's email"
            placeholderTextColor="#A0AEC0"
            value={searchEmail}
            onChangeText={setSearchEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchUser}
            disabled={searchLoading}
          >
            {searchLoading ? (
              <ActivityIndicator size="small" color="#1E2A3A" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {foundUser && (
          <View style={styles.foundUser}>
            <Text style={styles.foundUserText}>Found: {foundUser.email}</Text>
            <Text style={styles.foundUserName}>Name: {foundUser.name}</Text>
            <TouchableOpacity
              style={[
                styles.sendRequestButton,
                sendingRequest && styles.disabledButton,
              ]}
              onPress={sendCollaborationRequest}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Send Collaboration Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Shared Budgets */}
        {sharedBudgets.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Shared Budgets with You</Text>
            <FlatList
              data={sharedBudgets}
              renderItem={renderSharedBudgetItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.list}
            />
          </>
        )}

        {/* Active Collaborations */}
        {collaborations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Collaborations</Text>
            <FlatList
              data={collaborations}
              renderItem={renderCollaborationItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.list}
            />
          </>
        )}

        {/* Incoming Requests */}
        <Text style={styles.sectionTitle}>Incoming Requests</Text>
        {requests.length === 0 ? (
          <Text style={styles.noItems}>No pending requests</Text>
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.list}
          />
        )}
      </ScrollView>

      {/* Shared Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedCollaboration?.user1Name}'s Budget
            </Text>

            {selectedCollaboration && (
              <>
                <Text style={styles.budgetInfo}>
                  Total Budget: ₱{selectedCollaboration.sharedBudget || 0}
                </Text>

                <Text style={styles.expensesTitle}>Recent Expenses:</Text>
                {Object.values(selectedCollaboration.sharedExpenses).length ===
                0 ? (
                  <Text style={styles.noExpenses}>No expenses yet</Text>
                ) : (
                  <FlatList
                    data={Object.values(
                      selectedCollaboration.sharedExpenses
                    ).slice(0, 5)}
                    renderItem={({ item }) => (
                      <View style={styles.expenseItem}>
                        <Text style={styles.expenseDesc}>
                          {item.description}
                        </Text>
                        <Text style={styles.expenseAmount}>₱{item.amount}</Text>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2A3A",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#B8C5D6",
    lineHeight: 22,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  searchSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#2A3A4A",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    minWidth: 80,
  },
  searchButtonText: {
    color: "#1E2A3A",
    fontWeight: "700",
    fontSize: 16,
  },
  foundUser: {
    backgroundColor: "#2A3A4A",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  foundUserText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: "500",
  },
  foundUserName: {
    fontSize: 14,
    color: "#B8C5D6",
    marginBottom: 12,
  },
  sendRequestButton: {
    backgroundColor: "#4ECDC4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: "#6c757d",
  },
  requestItem: {
    backgroundColor: "#2A3A4A",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  collabItem: {
    backgroundColor: "#2A3A4A",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A4A5A",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sharedBudgetItem: {
    backgroundColor: "#2A3A4A",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#4ECDC4",
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  requestText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "500",
  },
  collabText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  budgetOwner: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4ECDC4",
    marginBottom: 12,
  },
  collabDate: {
    fontSize: 14,
    color: "#B8C5D6",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  acceptButton: {
    backgroundColor: "#4ECDC4",
  },
  rejectButton: {
    backgroundColor: "#FF6B6B",
  },
  budgetSharingSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3A4A5A",
  },
  sharingText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#B8C5D6",
    fontWeight: "500",
  },
  sharingButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  enableButton: {
    backgroundColor: "#4ECDC4",
  },
  disableButton: {
    backgroundColor: "#FF6B6B",
  },
  viewBudgetButton: {
    backgroundColor: "#3A4A5A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#4A5A6A",
  },
  removeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    backgroundColor: "transparent",
  },
  removeButtonText: {
    color: "#FF6B6B",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  statusText: {
    color: "#B8C5D6",
    fontStyle: "italic",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 24,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  noItems: {
    textAlign: "center",
    color: "#8A9BB0",
    fontStyle: "italic",
    marginVertical: 16,
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#2A3A4A",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#3A4A5A",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  budgetInfo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4ECDC4",
    marginBottom: 20,
    textAlign: "center",
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  noExpenses: {
    color: "#8A9BB0",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A4A5A",
  },
  expenseDesc: {
    fontSize: 14,
    color: "#E8EDF5",
    flex: 1,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  closeButton: {
    backgroundColor: "#4ECDC4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
});
