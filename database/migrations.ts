import * as SQLite from "expo-sqlite"


export const initializeDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('books.db');
}