import FooterDialog from "@/components/FooterDialog";
import HeaderComponent from "@/components/HeaderComponent";
import { ThemeColorsType } from "@/constants/Colors";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from "expo-sqlite";
import { BookContext } from "@/context/BookContext";
import { Link } from "expo-router";
import Pdf from "react-native-pdf"

export default function Library() {
  
  const {theme} = useContext(ThemeContext)

  const db = useSQLiteContext()

  const styles = createStyles(theme)

  const { books, setBooks } = useContext(BookContext)

  const deleteBook = async (id: number) => {
      await db.runAsync(
        `DELETE FROM books WHERE id = ?`,
        [id]
      )

      setBooks(prev => prev.filter((item) => item.id !== id))
  }

  return (
    <View
      style={styles.container}
    >
      <HeaderComponent />
      <View style={styles.navContainer}>
        <View style={{

        }}>
          <Text style={[styles.text, {marginVertical: 12, textAlign: "left", paddingLeft: 10, color: theme?.accent}]}>Books</Text>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5
          }} />
        </View>
        <View style={{

          
        }}>
          <Text style={[styles.text, {marginVertical: 12, textAlign: "center", color: theme?.text}]}>Shelves</Text>
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
      {theme?.background && theme?.secondary ? <LinearGradient 
        colors={[theme?.secondary, theme?.background]}
        start={{ x: 0, y: 0 }}         
        end={{ x: 0, y: 1 }}           
        style={styles.gradient}/> : null}


        <SafeAreaView style={{width: "100%", flex: 1}}>
          <FlatList 
            data={books}
            contentContainerStyle={{
              width: "100%",
              paddingHorizontal: 12,
            }}
            renderItem={({item}) => <View 

            style={{
              width: "100%",
              height: 136,
              backgroundColor: theme?.secondary,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "#525252",
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
                    <Octicons name="pencil" size={28} color={theme?.accent} />
                    <Pressable onPress={() => deleteBook(item.id)} >

                        <Octicons name="trash" size={28} color={theme?.accent} />

                    </Pressable>
                    <MaterialCommunityIcons name="bookshelf" size={28} color={theme?.accent} />
                  </View>
              </View>
            </View>}
          />
        </SafeAreaView>
      <FooterDialog />
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