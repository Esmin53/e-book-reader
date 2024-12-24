import { BookContextProvider } from "@/context/BookContext";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

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

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS bookshelves (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS bookshelves_books (
        id INTEGER PRIMARY KEY,
        bookshelf_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        FOREIGN KEY(bookshelf_id) REFERENCES bookshelves(id),
        FOREIGN KEY(book_id) REFERENCES books(id)
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
            <Stack.Screen name="bookshelves/[id]" options={{ headerShown: false}}/>
          </Stack>
        </BookContextProvider>
      </SQLiteProvider>
    </ThemeContextProvider>);
}
