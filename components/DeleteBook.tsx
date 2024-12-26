import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"

import Octicons from '@expo/vector-icons/Octicons';
import { ThemeColorsType } from "@/constants/Colors";
import { BookContext, BookType } from "@/context/BookContext";
import { useSQLiteContext } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteBook = ({id}: {id: number}) => {

        const [isVisible, setIsVisible] = useState<boolean >(false)
    
        const { theme } = useContext(ThemeContext)
        const { setBooks } = useContext(BookContext)
        const db = useSQLiteContext()

        const styles = createStyles(theme)

        const deleteBook = async (id: number) => {
            try {
                await db.runAsync(
                    `DELETE FROM books WHERE id = ?`,
                    [id]
                    
                  )
      
                  await db.runAsync(
                      `DELETE FROM bookshelves_books WHERE book_id = ?`
                  , [id])
            
                      const jsonValue: string | null = await AsyncStorage.getItem('last-read-book')
      
                      const lastBookRead: BookType | null = jsonValue !== null ? JSON.parse(jsonValue) : null
      
                      if(lastBookRead !== null && lastBookRead.id === id) {
                          await AsyncStorage.removeItem('last-read-book')
                      }
      
                  setBooks(prev => prev.filter((item) => item.id !== id))
            } catch (error) {
                console.log(error)
            }

        }

    return (<View style={{

    }}>
        <Pressable onPress={() => setIsVisible(true)}>
            <Octicons name="trash" size={28} color={theme?.accent} />
        </Pressable>
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.overlay} >
                <View style={[styles.modalContainer]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.title}>Are You Absolutley Sure You Want To Delete This Book?</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Pressable style={styles.button} onPress={() => setIsVisible(false)}>
                            <Text style={{color: theme?.text}}>No</Text>
                        </Pressable>
                        <Pressable style={[styles.button, {backgroundColor: "#0077b6"}]} onPress={() => deleteBook(id)}>
                            <Text style={{color: theme?.text}}>Yes</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
)
}

function createStyles(theme: ThemeColorsType | null) {
  return StyleSheet.create({
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(12, 12, 12, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContainer: {
        width: "90%",
        backgroundColor: theme?.background,
        borderRadius: 14,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: theme?.secondary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        paddingVertical: 36
    },
    modalHeader: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14
    },
    title: {
        fontSize: 18,
        color: theme?.text,
        textAlign: "center"
    },
    contentContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 14,
        gap: 22
    },
    inputContainer: {
        width: "100%",
        height: 52,
    },
    button: {
        height: 52,
        width: 126,
        backgroundColor: theme?.accent,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
  })
}

export default DeleteBook