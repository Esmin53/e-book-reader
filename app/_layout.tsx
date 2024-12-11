import { BookContext, BookContextProvider } from "@/context/BookContext";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        uri TEXT NOT NULL,
        currentPage INTEGER DEFAULT 0
      )
    `);
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error during database migration:', error);
  }
}

export default function RootLayout() {
  return (
    <ThemeContextProvider>
      <SQLiteProvider databaseName="books.db" onInit={migrateDbIfNeeded}>
        <BookContextProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}} />
            <Stack.Screen name="books/[id]" options={{ headerShown: false}}/>
          </Stack>
        </BookContextProvider>
      </SQLiteProvider>
    </ThemeContextProvider>);
}
