import { useContext } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import { BookContext } from "@/context/BookContext";
import Book from "@/components/Book";
import { ThemeContext } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeColorsType } from "@/constants/Colors";
import { Link } from "expo-router";
import LastBookRead from "./LastBookRead";

const Books = () => {

    const { books } = useContext(BookContext)
    const {theme} = useContext(ThemeContext)

  const styles = createStyles(theme)

    return (
        <SafeAreaView style={{width: "100%", flex: 1, gap: 12}}>
          <FlatList 
            ListHeaderComponent={<LastBookRead />}
            data={books}
            contentContainerStyle={{
              width: "100%",
              paddingHorizontal: 12,
            }}
            renderItem={({item}) => <Book {...item} />}
          />
        </SafeAreaView>
    )
}

function createStyles(theme: ThemeColorsType | null) {
  return StyleSheet.create({
    lastBookContainer: {
      width: "100%",
      paddingHorizontal: 12,
      display: "flex",
      flexDirection: "row",
      gap: 10
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
      paddingHorizontal: 12
      },
    title: {
      color: theme?.text,
      fontSize: 22,
      fontWeight: 600
    }
  })
}

export default Books