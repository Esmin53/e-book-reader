import FooterDialog from "@/components/FooterDialog";
import HeaderComponent from "@/components/HeaderComponent";
import { ThemeColorsType } from "@/constants/Colors";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from "expo-linear-gradient";
import Books from "@/components/Books";
import Bookshelves from "@/components/Bookshelves";
import { StatusBar } from "expo-status-bar";

export default function Library() {
  const [navigation, setNavigation] = useState<'books' | 'shelves'>('books')

  const {theme} = useContext(ThemeContext)

  const styles = createStyles(theme)

  return (
    <View
      style={styles.container}
    >
      <HeaderComponent />
      <View style={styles.navContainer}>
        <View style={{

        }}>
          <Pressable onPress={() => setNavigation('books')}>
            <Text style={[styles.text, {marginVertical: 12, textAlign: "left", paddingLeft: 10, 
              color: navigation === 'books' ? theme?.accent : theme?.text
              }]}>Books</Text>
          </Pressable>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5
          }} />
        </View>
        <View style={{

          
        }}>
          <Pressable onPress={() => setNavigation('shelves')}>
            <Text style={[styles.text, {marginVertical: 12, textAlign: "center", 
              color: navigation === 'shelves' ? theme?.accent : theme?.text
            }]}>Shelves</Text>
          </Pressable>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5
          }} />
        </View>
        <View style={{

        }}>
          <Text style={[styles.text, {marginVertical: 12, textAlign: "right", color: theme?.text}]}>Market</Text>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5
          }} />
        </View>
        <View style={{
          flex: 1,
          height: "100%",
          marginTop: "auto"
        }}>
          <View style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 10
            }}>
              <Octicons name="sort-desc" size={26} color={theme?.accent} />
            </View>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5,
          }} />
        </View>
      </View>


        {navigation === 'books' ? <Books /> : null}
        {navigation === 'shelves' ? <Bookshelves /> : null}

      <FooterDialog />
      <StatusBar backgroundColor={theme?.accent}/>
    </View>
  );
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