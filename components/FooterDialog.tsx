import { Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';
import { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColorsType } from "@/constants/Colors";
import {getDocumentAsync} from "expo-document-picker"
import { useSQLiteContext } from "expo-sqlite";
import { BookContext, BookType } from "@/context/BookContext";

const FooterDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [name, setName] = useState<string >("Name")
    const [bookShelfName, setBookshelfName] = useState<string >("")
    const [isBookshelf, setIsBooksHelf] = useState(false)

    const [fileData, setFileData] = useState<{
        title: string,
        author: string,
        uri: string
    } | null>(null)
    
    const db = useSQLiteContext()

    const { theme } = useContext(ThemeContext)
    const {setBooks} = useContext(BookContext)

    const styles = createStyles(theme)
    
    const pickDocument = async () => {
        try {
          const result = await getDocumentAsync({
            type: ['text/plain', 'application/pdf'],
            copyToCacheDirectory: true,
          });
    
          if (result.assets !== null) {
            console.log('File selected:', result.assets[0]);
            setFileData({
                title: result.assets[0].name,
                author: "Unknown",
                uri: result.assets[0].uri
            })
          } else {
            console.log('User canceled file picker');

          }
        } catch (error) {
          console.error('Error picking document:', error);
          ToastAndroid.show(`There Was An Error Selecting This File`, ToastAndroid.BOTTOM)
        }
      };
    
      const addBook = async () => {
        if(fileData === null) return
        try {
            let { lastInsertRowId} = await db.runAsync(
                `INSERT INTO books (title, author, uri, currentPage) VALUES (?, ?, ?, ?)`,
                [fileData.title, fileData.author, fileData.uri, 0]
            )

            let book: BookType | null = await db.getFirstAsync(
                `SELECT * FROM books WHERE id = ?`,
            [ lastInsertRowId ])

            ToastAndroid.show(`You Successfully added ${book?.title}`, ToastAndroid.BOTTOM)
            
            if(book !== null) setBooks(prev => [book, ...prev])
            setFileData(null)
        } catch (error) {
            ToastAndroid.show(`There was an error adding this book to your collection!`, ToastAndroid.BOTTOM)
        } 
      }

      const addBookshelf = async () => {
        if(bookShelfName.length === 0) return
        try {
            let { lastInsertRowId} = await db.runAsync(
                `INSERT INTO bookshelves (name) VALUES (?)`,
                [bookShelfName]
            )

            let bookshelf: {id: string, name: string} | null = await db.getFirstAsync(
                `SELECT * FROM bookshelves WHERE id = ?`,
            [ lastInsertRowId ])


            console.log(bookshelf)
            ToastAndroid.show(`You Successfully added ${bookshelf?.name}`, ToastAndroid.BOTTOM)
        } catch (error) {
            ToastAndroid.show(`There was an error adding this book to your collection!`, ToastAndroid.BOTTOM)
        }

      }
    
    return (
        <View style={[{
            position: "absolute",
            right: 10,
            bottom: 28,
            gap: 12,

        }, isDialogOpen ? styles.drawer : null]}>
            {isDialogOpen ? <View style={{
                height: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column"
            }}>
                <View style={styles.drawerButtons}>
                <Pressable style={{
                    backgroundColor: theme?.accent,
                    borderRadius: 4,
                    flex: 1,
                    height: 52,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }} onPress={() => {
                    setIsBooksHelf(false)
                    pickDocument()
                }}>
                    <Text style={{
                        color: theme?.text,
                        fontSize: 20
                    }}>Add Book</Text>
                </Pressable>
                <Pressable style={{
                    backgroundColor: theme?.accent,
                    borderRadius: 4,
                    flex: 1,
                    height: 52,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }} onPress={() => {
                    setFileData(null)
                    setIsBooksHelf(true)
                }}>
                    <Text style={{
                        color: theme?.text,
                        fontSize: 20
                    }}>Add Shelf</Text>
                </Pressable>
            </View>
            {fileData ? <View style={{
                width: "100%",
                flex: 1,
                gap: 12
            }}>
                <View>
                    <Text style={{color: theme?.text, fontSize: 16}}>Title</Text>
                    <View style={{backgroundColor: "#333533"}}>
                    <TextInput value={fileData.title} onChangeText={(text) => setFileData({
                        ...fileData,
                        title: text})} style={{
                            color: theme?.text,
                            fontSize: 20,
                        }}/>
                    </View>
                </View>
                <View>
                    <Text style={{color: theme?.text, fontSize: 16}}>Author</Text>
                    <View style={{backgroundColor: "#333533"}}>
                        <TextInput value={fileData.author} onChangeText={(text) => setFileData({
                            ...fileData,
                            author: text})} style={{
                                color: theme?.text,
                                fontSize: 20
                            }} placeholderTextColor={theme?.text}/>
                    </View>
                </View>
   
                <Text style={{color: theme?.text, fontSize: 15}}>Url: {fileData.uri}</Text>
                <Pressable style={styles.button}>
                <Text style={{
                        color: theme?.text,
                        fontSize: 20,
                    }} onPress={addBook}>Save Book</Text>
                </Pressable>
            </View> : null}
            {isBookshelf ? <View style={{marginVertical: "auto"}}>
                <Text style={{color: theme?.text,
                    fontSize: 16,
                    paddingBottom: 4
                }}>Bookshelf Name</Text>
                <TextInput value={bookShelfName} onChangeText={(text) => setBookshelfName(text)} 
                    placeholder="e.g. Russian Literature" placeholderTextColor={theme?.text}
                        style={{
                            color: theme?.text,
                            fontSize: 18,
                            backgroundColor: "#333433",
                            height: 48,
                            paddingHorizontal: 6
                        }}/>
                        <Pressable style={[styles.button, {marginTop: 12}]}>
                            <Text style={{
                        color: theme?.text,
                        fontSize: 20,
                    }} onPress={addBookshelf}>Save Bookshelf</Text>
                </Pressable>
            </View> : null}
            </View> : null}
            
            <Pressable style={{
                    width: 52,
                    height: 52,
                    backgroundColor: theme?.accent,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "auto"
            }} onPress={() => setIsDialogOpen(prev => !prev)}>
            {isDialogOpen ? <Octicons name="chevron-down" size={36} color={theme?.text} /> :
            <Octicons name="plus" size={36} color={theme?.text} /> }
            </Pressable>
        </View>
    )
}

const createStyles = (theme: ThemeColorsType | null) => {
    return StyleSheet.create({
        drawer: {
            width: "100%",
            minHeight: 300,
            backgroundColor: theme?.secondary,
            bottom: 0,
            left: 0,
            padding: 10,
            display: "flex",
            flexDirection: "row",
            borderTopColor: "#333533",
            borderTopWidth: 3
        },
        drawerButtons: {
            display: "flex",
            flexDirection: "row",
            marginLeft: "auto",
            gap: 12,
            marginBottom: 20
        },
        button: {
            width: "100%",
            height: 52,
            backgroundColor: theme?.accent,
            marginTop: "auto",
            borderRadius: 4,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        }
    })
}

export default FooterDialog