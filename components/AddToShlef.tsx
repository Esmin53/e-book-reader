
import { ThemeColorsType } from '@/constants/Colors';
import { ThemeContext } from '@/context/ThemeContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

type bookshelf = {
    id: number
    name: string
}

const AddToShelf = ({id}: {id: number}) => {

    const [isOpen, setIsOpen] = useState<boolean >(false)

    const [inBookShelves, setInBookShelves] = useState<bookshelf[]>([])
    const [notInBookShelves, setNotInBookShelves] = useState<bookshelf[]>([])
    const [selectedShelf, setSelectedShelf] = useState<number | null>(null)


    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()

    const styles = createStyles(theme)

    const addToBookshelf = async () => {
        if(selectedShelf === null) return

        try {
            const existingEntry = await db.getFirstAsync(`
                SELECT * FROM bookshelves_books 
                WHERE bookshelf_id = ? AND book_id = ?
            `, [selectedShelf, id]);
    
            if (existingEntry) {
                console.log("Book already exists in this bookshelf");
                return;
            }
    
            await db.runAsync(`
                INSERT INTO bookshelves_books (bookshelf_id, book_id) VALUES (?, ?)
                `, [selectedShelf, id])

            setIsOpen(false),
            setSelectedShelf(null)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(isOpen === false) return

        const getBookshelves = async () => {
            try {

                    const shelvesWithBook: bookshelf[] = await db.getAllAsync(
                        `SELECT bs.* FROM bookshelves bs
                         JOIN bookshelves_books bsb ON bs.id = bsb.bookshelf_id
                         WHERE bsb.book_id = ?`,
                        [id]
                    );
            
                    const shelvesWithoutBook: bookshelf[] = await db.getAllAsync(
                        `SELECT bs.* FROM bookshelves bs
                         WHERE bs.id NOT IN (
                             SELECT bookshelf_id FROM bookshelves_books WHERE book_id = ?
                         )`,
                        [id]
                    );

                    setInBookShelves(shelvesWithBook)
                    setNotInBookShelves(shelvesWithoutBook)
            
            } catch (error) {
                console.log(error)
            }
        }

        getBookshelves()
    }, [isOpen])

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcons name="bookshelf" size={28} color={theme?.accent} />
            </Pressable>
            <Modal animationType='slide' visible={isOpen} style={{
                backgroundColor: theme?.background
            }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles?.title}>Bookshelves</Text>
                        <Pressable onPress={() => setIsOpen(false)}>
                            <MaterialCommunityIcons name="window-close" size={36} color={theme?.accent} />
                        </Pressable>
                    </View>
                    {inBookShelves.length !== 0 ? <View style={{
                        paddingHorizontal: 12,
                        flex: 1,
                        maxHeight: 116
                    }}>
                    <Text style={{
                            fontSize: 17,
                            color: theme?.text,
                            marginTop: 10
                        }}>Already in these shelves</Text>
                        <FlatList
                            data={inBookShelves}
                            renderItem={({item}) => (
                                <View style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 6
                                }} >
                                    <Text style={{
                                        color: theme?.accent,
                                        fontSize: 16
                                        }}>{item.name}</Text>
                                        <View style={styles?.checkboxSelected}>
                                            <MaterialCommunityIcons name="check" size={13} color={theme?.accent} />
                                        </View>
                                </View>
                            )}
                        />
                    </View> : null}
                    <View style={styles.contentContainer}>
                        <View style={{
                            width: "90%",
                            height: 3,
                            backgroundColor: "#333533"
                        }} />
                        <FlatList
                        style={{flex: 1}}
                            data={notInBookShelves}
                            renderItem={({item}) => (
                                <Pressable style={styles?.renderItem} onPress={() => {
                                    if(selectedShelf === item.id) {
                                        setSelectedShelf(null)
                                    } else {
                                        setSelectedShelf(item.id)
                                    }
                                }}>
                                    <Text style={{
                                        color: theme?.text,
                                        fontSize: 18
                                        }}>{item.name}</Text>
                                        {selectedShelf === item.id ? <View style={styles?.checkboxSelected}>
                                            <MaterialCommunityIcons name="check" size={13} color={theme?.accent} />
                                        </View> : <View style={styles?.checkbox}/>}
                                </Pressable>
                            )}
                        />
                        <Pressable style={styles.button} onPress={addToBookshelf}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

function createStyles(theme: ThemeColorsType | null) {
  return StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme?.background
    },
    header: {
        width: "100%",
        height: 56,
        backgroundColor: theme?.secondary,
        borderBottomColor: "#333533",
        borderBottomWidth: 2,
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 20,
        color: theme?.text,
        fontWeight: 600
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 14,
        display: "flex",
        flexDirection: "column"
    },
    inShelfContentContainer: {
        paddingVertical: 10,
        paddingBottom: 10,
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    renderItem: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1.5,
        borderBlockColor: "#333533",
        paddingVertical: 14
    },
    checkboxSelected: {
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderRadius: 1.5,
        borderColor: theme?.accent
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderRadius: 1.5,
        borderColor: theme?.text
    },
    button: {
        width: "100%",
        height: 48,
        backgroundColor: theme?.accent,
        marginTop: "auto",
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: theme?.text,
        fontSize: 18
    }
  })
}

export default AddToShelf