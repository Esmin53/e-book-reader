import { useContext } from "react";
import { FlatList, SafeAreaView, StyleSheet} from "react-native";
import { BookContext } from "@/context/BookContext";
import Book from "@/components/Book";
import { ThemeContext } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeColorsType } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";

const Books = () => {

    const { books } = useContext(BookContext)
    const {theme} = useContext(ThemeContext)

  const styles = createStyles(theme)

    return (
        <SafeAreaView style={{width: "100%", flex: 1}}>
          {theme?.background && theme?.secondary ? <LinearGradient 
            colors={[theme?.secondary, theme?.background]}
            start={{ x: 0, y: 0 }}         
            end={{ x: 0, y: 1 }}           
            style={styles.gradient}/> : null}
          <FlatList 
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
    container: {
      flex: 1,
      height: "auto",
      width: "100%",
      backgroundColor: theme?.background,
      position: "relative"
    },
    navContainer: {
      width: "100%",
      gap: 10,
      display: "flex",
      flexDirection: "row",
      paddingTop: 10,
      backgroundColor: theme?.secondary,
      zIndex: 20,
      position: "relative"
    },
    text: {
      fontSize: 18,
      fontWeight: 600,
      color: "#D8D2C2",
      paddingHorizontal: 2
    },
    gradient: {
      width: "100%",
      height: 44,
      zIndex: 10,
      }
  })
}

export default Books