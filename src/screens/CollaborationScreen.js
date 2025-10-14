import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

export default function CollaborationScreen() {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  const addMember = () => {
    if (memberName.trim() === "") return;
    setMembers([...members, { id: Date.now().toString(), name: memberName }]);
    setMemberName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Collaboration</Text>
      <Text style={styles.subtitle}>Invite or list your group members</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter member name"
        value={memberName}
        onChangeText={setMemberName}
      />

      <Button title="Add Member" onPress={addMember} color="#007AFF" />

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberBox}>
            <Text style={styles.memberText}>• {item.name}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />

      {members.length === 0 && (
        <Text style={styles.note}>
          No members yet. Add your first collaborator!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  memberBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  memberText: {
    fontSize: 16,
  },
  note: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
