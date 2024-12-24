import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native"

import Octicons from '@expo/vector-icons/Octicons';
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { BookContext, BookType } from "@/context/BookContext";
import Book from "./Book";

const Search = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [q, setQ] = useState("")

    const {theme} = useContext(ThemeContext)
    const {books} = useContext(BookContext)    

    const [results, setResults] = useState<BookType[]>([])

    useEffect(() => {
        setResults(books.filter((item) => item.title.toLowerCase().includes(q.toLowerCase())))
    }, [q])

    return (
        <View>
            <Pressable style={{
                height: "100%",
                width: 52,
                backgroundColor: theme?.accent,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }} onPress={() => setIsOpen(true)}>
                <Octicons name="search" size={26} color={theme?.text} />
            </Pressable>
            <Modal visible={isOpen}>
                <View style={{
                    flex: 1,
                    backgroundColor: theme?.secondary,
                    padding: 10
                }}>
                    <View style={{
                        width: "100%",
                        height: 52,

                        display: "flex",
                        flexDirection: "row",
                        gap: 4
                    }}>
                        <TextInput style={{
                            flex: 1,
                            backgroundColor: theme?.offGray,
                            borderRadius: 4,
                            paddingHorizontal: 4,
                            fontSize: 17,
                            color: theme?.text
                        }} 
                        placeholder="Type something to start search"
                        value={q}
                        onChangeText={(text) => setQ(text)}/>
                        <Pressable style={{
                            width: 52,
                            height: 52,
                            backgroundColor: theme?.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            borderRadius: 4
                        }} onPress={() => setIsOpen(false)}>
                            <Octicons name="x" size={32} color={theme?.text} />
                        </Pressable>
                    </View>
                    <Text 
                    style={{
                        marginVertical: 6,
                        fontSize: 16,
                        color: theme?.text
                    }}>Search your collection</Text>
                    <View style={{
                        width: "100%",
                        height: 1.5,
                        backgroundColor: theme?.offGray
                    }} />
                    <FlatList 
                        data={results}
                        renderItem={({item}) => <Book {...item} />}
                    />
                </View>
            </Modal>
        </View>
    )
}

export default Search