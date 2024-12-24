import { BookType } from "@/context/BookContext"
import { Link, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { ThemeContext } from "@/context/ThemeContext"
import AntDesign from '@expo/vector-icons/AntDesign';
import Pdf from "react-native-pdf"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar"

const Book = () => {
    const [book, setBook] = useState<BookType | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [pages, setPages] = useState(0)
    const [isChangingPage, setIsChangingPage] = useState(false);

    const {id} = useLocalSearchParams()
    const db = useSQLiteContext()

    const {theme} = useContext(ThemeContext)

    const getBook = async () => {
        const book: BookType | null = await db.getFirstAsync(`
            SELECT * FROM books WHERE id = ?
            `, [Number(id)])

            setBook(book)
            if(book?.currentPage) {
                setCurrentPage(book?.currentPage)

                await AsyncStorage.setItem('last-read-book', JSON.stringify(book))
            }
    }

    const handleNextPage = async () => {
        if(currentPage === pages) return
        if (isChangingPage) return;
        setIsChangingPage(true)

        try {
            setCurrentPage((prev) => prev + 1);
    
            if (book?.id) {
                await db.runAsync(
                    `UPDATE books SET currentPage = ? WHERE id = ?`,
                    [currentPage + 1, book.id]
                );
            }
        } catch (error) {
            console.error("Error updating page:", error);
        } 
    };

    const handlePrevPage = async () => {
        if(currentPage === 0 || currentPage === 1) return

        if (isChangingPage) return;
        setIsChangingPage(true)

        try {
            setCurrentPage((prev) => {
                const prevPage = prev - 1
    
                if (book?.id) {
                    db.runAsync(
                        `UPDATE books SET currentPage = ? WHERE id = ?`,
                        [prevPage, book.id]
                    ).catch((error) => console.error("Error updating page:", error));
                }
    
                return prevPage
    
            })
        } catch (error) {
            console.error("Error updating page:", error);
        }

    }

    useEffect(() => {
        
        getBook()
    }, [])


    return <View style={{
        flex: 1,
        backgroundColor: theme?.background,
        paddingTop: 34
        }}>
            <View style={{
                display: "flex",
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 30,
                backgroundColor: theme?.background
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
                {isChangingPage ? <View style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: 20,
                    backgroundColor: 'rgba(250, 250, 250, 0.7)',
                }} /> : null}
               {book?.uri ? <Pdf
               page={currentPage}
               style={{flex: 1}}
               enablePaging={true}
               scrollEnabled={false}
                    source={{
                        uri: book?.uri,
                        cache: true
                    }}
                onLoadProgress={(percent) => console.log(percent)}
                onLoadComplete={(numberOfPages,filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    pages !== numberOfPages && setPages(numberOfPages)
                    setIsChangingPage(false)
                    console.log("Page Changed")
                }}
                /> : null}
            <View style={{
                height: 68,
                padding: 12,
                paddingHorizontal: 18,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 30,
                backgroundColor: theme?.background
            }}>
                <Pressable onPress={() => {
                    setIsChangingPage(true)
                    handlePrevPage()
                }}>
                    <AntDesign name="caretleft" size={32} color={theme?.text} />
                </Pressable>
                <Text style={{color: theme?.text, fontSize: 32}}>{currentPage}/{pages}</Text>
                <Pressable onPress={handleNextPage}>
                    <AntDesign name="caretright" size={32} color={theme?.text} />
                </Pressable>
            </View>
            <StatusBar backgroundColor={theme?.background}/>
    </View>
}

export default Book