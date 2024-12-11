import * as SQLite from 'expo-sqlite';

const openDatabaseAsync = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('books.db');
      return db;
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  };

  export default openDatabaseAsync