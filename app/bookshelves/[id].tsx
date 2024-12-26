import Book from "@/components/Book"
import { ThemeColorsType } from "@/constants/Colors"
import { BookType } from "@/context/BookContext"
import { ThemeContext } from "@/context/ThemeContext"
import { Link, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { useContext, useEffect, useState } from "react"
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"

import AntDesign from '@expo/vector-icons/AntDesign';

const Bookshelf = () => {
        const [books, setBooks] = useState<BookType[]>([])
        const [shelf, setShelf] = useState<string | null>(null)
        const [isVisible, setIsVisible] = useState<boolean >(false)

        const {id} = useLocalSearchParams()
        const db = useSQLiteContext()
        const {theme} = useContext(ThemeContext)

        const styles = createStyles(theme)

        const removeBook = async (bookId: number) => {
            try {
                await db.runAsync(`
                    DELETE FROM bookshelves_books WHERE bookshelf_id = ? AND book_id = ?
                    `, [Number(id), bookId])

                setBooks((prev) => prev.filter((item) => item.id !== bookId))
            } catch (error) {
                console.log(error)
            }
        }

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
                <Pressable
                    onPress={() => setIsVisible(true)}
                    style={{
                        paddingHorizontal: 12,
                        paddingTop: 12
                    }}
                >
                    <Text style={{
                        color: theme?.text,
                        fontSize: 16
                    }}>Remove books from the shelf</Text>
                </Pressable>
                <Modal animationType="slide" visible={isVisible} transparent={true}>
                    <View style={{
                        flex: 1,
                        backgroundColor: theme?.secondary
                    }}>
                        <View style={{
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1.5,
                            borderBottomColor: theme?.offGray
                        }}>
                            <Text style={{
                            color: theme?.text,
                            fontSize: 18
                            }}>Remove books from the shelf</Text>
                            <Pressable onPress={() => setIsVisible(false)}>
                                <AntDesign name="down" size={32} color={theme?.text} />
                            </Pressable>
                        </View>
                        <FlatList 
                                data={books}
                                contentContainerStyle={{
                                padding: 12,
                                gap: 12
                            }}
                            renderItem={({item}) => <View
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingHorizontal: 2
                            }}>
                                <Text style={{
                                    color: theme?.text,
                                    fontSize: 18
                                }}>{item.title}</Text>
                                <Pressable onPress={() => removeBook(item.id)}>
                                    <AntDesign name="minus" size={32} color={theme?.text} />
                                </Pressable>
                            </View>}
                            />
                    </View>
                </Modal>
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