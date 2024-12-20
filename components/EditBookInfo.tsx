import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native"

import Octicons from '@expo/vector-icons/Octicons';
import { ThemeColorsType } from "@/constants/Colors";
import { BookContext } from "@/context/BookContext";
import { useSQLiteContext } from "expo-sqlite";

interface BookInfoProps {
    title: string
    author: string
    id: number
}

const EditBookInfo = ({title, author, id}: BookInfoProps) => {
    const [newTitle, setTitle] = useState(title)
    const [newAuthor, setAuthor] = useState(author)

    const [isVisible, setIsVisible] = useState<boolean >(false)

    const { theme } = useContext(ThemeContext)
    const { books, setBooks } = useContext(BookContext)
    const db = useSQLiteContext()

    const styles = createStyles(theme)

    const updateBook = async () => {
        let newBooks = books.map((item) => {
            if(item.id !== id) {
                return item
            } else {
                return {
                    ...item,
                    title: newTitle,
                    author: newAuthor
                }
            }
        })

        try {
            await db.runAsync(`
                UPDATE books SET title = ?, author = ? WHERE id = ?
                `, [newTitle, newAuthor, id])

            setBooks(newBooks)

            ToastAndroid.show(`Book info successfuly updated`, ToastAndroid.BOTTOM)
            setIsVisible(false)
        } catch (error) {
            console.log(error)
            ToastAndroid.show(`There was an error updating book info`, ToastAndroid.BOTTOM)
        }

    }

    return (
        <View style={{}}>
            <Pressable onPress={() => setIsVisible(true)}>
                <Octicons name="pencil" size={28} color={theme?.accent} />
            </Pressable>
            <Modal visible={isVisible} transparent={true} animationType="slide">
                <View style={styles.overlay} />
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.title}>Edit Book Info</Text>
                        <Pressable onPress={() => setIsVisible(false)}>
                            <Octicons name="chevron-down" size={32} color={theme?.accent} />
                        </Pressable>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Title</Text>
                            <TextInput style={styles.textInput} value={newTitle} onChangeText={(text) => setTitle(text)}/>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Author</Text>
                            <TextInput style={styles.textInput} value={newAuthor} onChangeText={(text) => setAuthor(text)}/>
                        </View>
                        <Pressable style={styles.button} onPress={updateBook}>
                            <Text style={{
                                color: theme?.text,
                                fontSize: 17
                                }}>Save Changes</Text>
                        </Pressable>
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
        backgroundColor: "rgba(12, 12, 12, 0.45)"
    },
    modalContainer: {
        width: "100%",
        minHeight: "35%",
        backgroundColor: theme?.background,
        position: "absolute",
        bottom: 0,
        borderRadius: 14,
        overflow: "hidden"
    },
    modalHeader: {
        width: "100%",
        height: 46,
        backgroundColor: theme?.secondary,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14
    },
    title: {
        fontSize: 19,
        color: theme?.text,
        fontWeight: 600
    },
    contentContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 14,
        gap: 22
    },
    inputContainer: {
        width: "100%",
        height: 52,
    },
    inputLabel: {
        color: theme?.text,
        paddingBottom: 4
    },
    textInput: {
        width: "100%",
        height: 42,
        backgroundColor: theme?.secondary,
        color: theme?.text,
        paddingHorizontal: 8,
        fontSize: 18
    },
    button: {
        height: 52,
        width: "100%",
        backgroundColor: theme?.accent,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
  })
}

export default EditBookInfo