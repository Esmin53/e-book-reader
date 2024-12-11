import { BookType } from "@/context/BookContext"
import { Link, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useEffect, useState } from "react"
import { Text, View } from "react-native"
import {WebView} from "react-native-webview"
import * as FileSystem from 'expo-file-system';
import { ThemeContext } from "@/context/ThemeContext"
import AntDesign from '@expo/vector-icons/AntDesign';

const Book = () => {
    const [book, setBook] = useState<BookType | null>(null)
    const [base64, setBase64] = useState<string | null>(null);

    const {id} = useLocalSearchParams()
    const db = useSQLiteContext()

    const {theme} = useContext(ThemeContext)

    const getBook = async () => {
        const book: BookType | null = await db.getFirstAsync(`
            SELECT * FROM books WHERE id = ?
            `, [Number(id)])

            setBook(book)

            console.log(book)
    }
    useEffect(() => {
        const loadFile = async () => {
            if(!book) return

            const fileBase64 = await FileSystem.readAsStringAsync(book.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setBase64(fileBase64);
        };

        loadFile();
    }, [book]);


    useEffect(() => {
        getBook()
    }, [])
    return <View style={{
        flex: 1,
        backgroundColor: theme?.background
        }}>
            <View style={{
                display: "flex",
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <View style={{marginLeft: 10}}>
                <Text style={{
                    color: theme?.text,
                    fontSize: 24,
                    fontWeight: 600
                }}>{book?.title}</Text>
                <Text style={{
                    color: theme?.text,
                    fontSize: 20,
                }}>{book?.author}</Text>
                </View>
                <Link href="/" style={{marginRight: 10}}>
                    <AntDesign name="back" size={32} color={theme?.text}/>
                </Link>
            </View>
        <WebView
              originWhitelist={['*']}
            source={{ uri: `${book?.uri}` }}
            style={{ flex: 1,
                width: "100%",

             }}
        />
            <View style={{
                height: 68,
                padding: 12,
                paddingHorizontal: 18,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <AntDesign name="caretleft" size={32} color={theme?.text} />
                <Text style={{color: theme?.text, fontSize: 32}}>{book?.currentPage}</Text>
                <AntDesign name="caretright" size={32} color={theme?.text} />
            </View>
    </View>
}

export default Book