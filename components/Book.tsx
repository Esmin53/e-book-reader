import { ThemeContext } from "@/context/ThemeContext"
import { Link } from "expo-router"
import { useContext } from "react"
import {StyleSheet, Text, View } from "react-native"
import Pdf from "react-native-pdf"
import { ThemeColorsType } from "@/constants/Colors"
import EditBookInfo from "./EditBookInfo"
import DeleteBook from "./DeleteBook"

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AddToShelf from "./AddToShlef"

const Book = (item: {
    uri: string,
    title: string,
    author: string,
    id: number
}) => {

    const {theme} = useContext(ThemeContext)

    const styles = createStyles(theme)


    return (
    <View 
    style={{
      width: "100%",
      height: 136,
      backgroundColor: theme?.secondary,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme?.offGray,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      paddingTop: 8,
      marginBottom: 12
    }}>
      <View style={{
        height: "100%",
        width: 86,
        backgroundColor: "#525252"
      }}>
        <Pdf 
        page={1}
        scrollEnabled={false}
        trustAllCerts={true}
        singlePage={true}
        source={{ 
          uri: item.uri,
          cache: true}}
          style={{
            height: "100%",
            width: 86,
          }}
        />
      </View>
      <View style={{
        flex: 1,
        height: "100%",
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        paddingRight: 6
      }}>
        <Text style={{
          color: theme?.text,
          fontSize: 17,
          fontWeight: "600",
          width: "100%",
          height: "auto",
          textOverflow: "wrap"
          }}>{item.title}</Text>
        <Text style={{
          color: "#B6BBC4",
          fontSize: 15,
          width: "100%",
          height: "auto",
          textOverflow: "wrap",
          }}>{item.author}</Text>
          <View style={{
            width: "100%",
            marginTop: "auto",
            marginBottom: 6,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 16,
            marginRight: 16
          }}>
            <Link            href={{
              //@ts-ignore
              pathname: "/books/[id]",
              params: {
              id: item.id
                }
                }} style={{
                  marginRight: "auto"
                }}>
                  <Text style={{
                    color: theme?.text,
                    fontSize: 18
                  }}>Read</Text>
            </Link>
            <EditBookInfo title={item.title} id={item.id} author={item.author}/>
            <DeleteBook id={item.id}/>
            <AddToShelf id={item.id}/>
          </View>
      </View>
    </View>
    )
}

function createStyles(theme: ThemeColorsType | null) {
  return StyleSheet.create({
    container: {}
  })
}

export default Book