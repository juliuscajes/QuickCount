import SQLite from "react-native-sqlite-storage";

// Error handler
SQLite.enablePromise(true);

const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabase({
      name: "MyDatabase.db",
      location: "default",
    });
    return db;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
};

// Usage
// Initialize and use database
const initializeAndUseDB = async () => {
  try {
    const db = await openDatabase();

    // Now use transaction
    await db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",
        [],
        () => console.log("Table created successfully"),
        (error) => console.log("Error creating table: ", error)
      );
    });
  } catch (error) {
    console.error("Database operation failed:", error);
  }
};
