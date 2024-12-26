import { ThemeColorsType } from "@/constants/Colors"
import { BookType } from "@/context/BookContext"
import { ThemeContext } from "@/context/ThemeContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { Link } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Pdf from "react-native-pdf"

const LastBookRead = () => {

    const {theme} = useContext(ThemeContext)

    const [book, setBook] = useState<BookType | null>(null)

    const styles = crateStyles(theme)

    useEffect(() => {
        const getData = async () => {
            const jsonValue = await AsyncStorage.getItem('last-read-book')
            const bookInfo = jsonValue != null ? JSON.parse(jsonValue) : null

            setBook(bookInfo)
        }

        getData()
    }, [])

    if(book === null)
        return  <View style={{marginBottom: 6}}>
          {theme?.background && theme?.secondary ? <LinearGradient 
          colors={[theme?.secondary, theme?.background]}
          start={{ x: 0, y: 0 }}         
          end={{ x: 0, y: 1 }}           
          style={[styles.gradient, {height: 26}]} /> : null}
      </View>

    return (
        <View >
        {theme?.background && theme?.secondary ? <LinearGradient 
          colors={[theme?.secondary, theme?.background]}
          start={{ x: 0, y: 0 }}         
          end={{ x: 0, y: 1 }}           
          style={styles.gradient}>
            <Text style={styles.title}>Last book you read:</Text>
          </LinearGradient> : null}
          <View style={styles.lastBookContainer}>
          <Pdf 
        page={1}
        scrollEnabled={false}
        trustAllCerts={true}
        singlePage={true}
        source={{ 
          uri: book.uri,
          cache: true}}
          style={styles.firstPage}
        />
            <View style={{paddingVertical: 4,
               gap: 6,
               height: 146,
               flexWrap: "wrap",
               display: "flex",
               flexDirection: "column",
            }}>
              <Text style={{
                color: theme?.text,
                fontSize: 19,
                fontWeight: "600",
                width: "100%",
                textOverflow: "wrap",
                height: "auto",
                flexShrink: 1,
                paddingRight: 12
              }}>
                {book.title}
              </Text>
              <Text style={{
                color: theme?.text,
                fontSize: 16,
                marginBottom: "auto",
                
              }}>{book?.author}</Text>
              <Link href={`/`} >
              <Text style={{
                  color: theme?.text,
                  fontSize: 16,
                  textDecorationLine: "underline",
                  textDecorationColor: theme?.gray
              }}>Continue reading</Text></Link>
            </View>
          </View>
      </View>
    )
}

const crateStyles = (theme: ThemeColorsType | null) => {
    return StyleSheet.create({
        lastBookContainer: {
            width: "100%",
            paddingBottom: 12,
            paddingHorizontal: 12,
            marginBottom: 12,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1.5,
            borderBottomColor: theme?.offGray
          },
          firstPage: {
            height: 146,
            width: 96,
            backgroundColor: "#fff"
          },
          gradient: {
            width: "100%",
            height: 48,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            },
          title: {
            color: theme?.text,
            fontSize: 22,
            fontWeight: 600,
            paddingHorizontal: 12
          }
    })
}

export default LastBookRead