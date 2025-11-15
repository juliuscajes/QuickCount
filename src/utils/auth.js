import db from "../database/database";

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            resolve(_array[0]);
          } else {
            reject(new Error("Invalid email or password"));
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const registerUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (_, result) => {
          // Get the newly created user
          tx.executeSql(
            "SELECT * FROM users WHERE id = ?",
            [result.insertId],
            (_, { rows: { _array } }) => {
              resolve(_array[0]);
            },
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getCurrentUser = () => {
  // You'll need to implement a way to store current user session
  // Using AsyncStorage or similar
  return null;
};
