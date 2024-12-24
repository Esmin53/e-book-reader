import { BookContext } from "@/context/BookContext"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"
import { Pressable, Text, View } from "react-native"


const DropDown = () => {

    const {theme} = useContext(ThemeContext)

    const {books, setBooks} = useContext(BookContext)

    const sortBooks = (sort: string) => {  
        let tempBooks = [...books];
    
        if (sort === 'author') {
            tempBooks.sort((a, b) => a.author.localeCompare(b.author));  
            console.log('author');
        } 
        if (sort === 'title') {
            tempBooks.sort((a, b) => a.title.localeCompare(b.title));
            console.log('title');
        } if(sort === 'newest') {
            tempBooks.sort((a, b) => b.id - a.id)
        } else if(sort === 'oldest') {
            tempBooks.sort((a, b) => a.id - b.id)
        }
    
        setBooks(tempBooks); 
    }

    return (
            <View style={{
            width: 200,
            backgroundColor: theme?.secondary,
            borderWidth: 1.5,
            borderColor: theme?.offGray,
            borderRadius: 3,
            position: "absolute",
            zIndex: 50,
            top: 44,
            right: 12,
            padding: 4,
            paddingHorizontal: 6
            }}>
                <Text style={{
                color: theme?.text
                }}>Order by:</Text>
                <Pressable
                style={{
                    marginBottom: 4,
                    borderBottomWidth: 1.5,
                    borderBottomColor: theme?.gray
                }} onPress={() => sortBooks('title')}>
                    <Text style={{
                color: theme?.text,
                fontSize: 18,
                paddingVertical: 8,
                width: "100%",
                textAlign: "center"
                }}>Title</Text>
                </Pressable>
                <Pressable
                style={{
                    marginBottom: 4,
                    borderBottomWidth: 1.5,
                    borderBottomColor: theme?.gray
                }} onPress={() => sortBooks('author')}>
                    <Text style={{
                color: theme?.text,
                fontSize: 18,
                paddingVertical: 8,
                width: "100%",
                textAlign: "center"
                }}>Author name</Text>
                </Pressable>
                <Pressable onPress={() => sortBooks('newest')}
                style={{
                    marginBottom: 4,
                    borderBottomWidth: 1.5,
                    borderBottomColor: theme?.gray
                }}>
                    <Text style={{
                color: theme?.text,
                fontSize: 18,
                paddingVertical: 8,
                width: "100%",
                textAlign: "center"
                }}>Newest</Text>
                </Pressable>
                <Pressable onPress={() => sortBooks('oldest')}
                style={{
                    marginBottom: 4
                }}>
                    <Text style={{
                color: theme?.text,
                fontSize: 18,
                paddingVertical: 8,
                width: "100%",
                textAlign: "center"
                }}>Oldest</Text>
                </Pressable>
            </View>

    )
}

export default DropDown