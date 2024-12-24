import Book from "@/components/Book"
import { ThemeColorsType } from "@/constants/Colors"
import { BookType } from "@/context/BookContext"
import { ThemeContext } from "@/context/ThemeContext"
import { Link, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { useContext, useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"

import AntDesign from '@expo/vector-icons/AntDesign';

const Bookshelf = () => {
        const [books, setBooks] = useState<BookType[]>([])
        const [shelf, setShelf] = useState<string | null>(null)

        const {id} = useLocalSearchParams()
        const db = useSQLiteContext()
        const {theme} = useContext(ThemeContext)

        const styles = createStyles(theme)

        useEffect(() => {
            const getBooksInBookshelf = async () => {
                try {
                  const results: BookType[] = await db.getAllAsync(`
                    SELECT b.id, b.title, b.author, b.uri, b.currentPage
                    FROM books b
                    JOIN bookshelves_books bsb ON b.id = bsb.book_id
                    WHERE bsb.bookshelf_id = ?;
                  `, [Number(id)]);

                  const bookshelf: {
                    name: string,
                  } | null= await db.getFirstAsync(`
                    SELECT name FROM bookshelves WHERE id = ?
                    `, [Number(id)])
              
                    if(bookshelf?.name)
                    setShelf(bookshelf?.name)
                  setBooks(results)
                } catch (error) {
                  console.error("Failed to fetch books in bookshelf:", error);
                }
              };

              getBooksInBookshelf()
        }, [])

        return (
            <View style={{
                backgroundColor: theme?.background,
                flex: 1,
                paddingTop: 32
  
            }}>
                <View style={styles.header}>
                    <View>
                        <Text style={{
                            color: theme?.text,
                            fontSize: 20
                        }}>
                            {shelf}
                        </Text>
                        <Text style={{
                            color: theme?.text,
                            fontSize: 16
                        }}>
                            {books.length} books
                        </Text>
                    </View>
                    <Link href="/" style={{marginRight: 10}}>
                        <AntDesign name="back" size={28} color={theme?.text}/>
                    </Link>
                </View>
                <FlatList 
                    data={books}
                    contentContainerStyle={{
                        padding: 12
                    }}
                    renderItem={({item}) => <Book {...item}/>}
                />
                <StatusBar backgroundColor={theme?.secondary}/>
            </View>
        )
}

const createStyles = (theme: ThemeColorsType | null) => {
    return StyleSheet.create({
        header: {
            width: "100%",
            height: 52,
            backgroundColor: theme?.secondary,
            borderBottomWidth: 1.5,
            borderBottomColor: theme?.offGray,
            paddingHorizontal: 12,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        }
    })
}

export default Bookshelf