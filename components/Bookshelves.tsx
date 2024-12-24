import { ThemeColorsType } from "@/constants/Colors"
import { ThemeContext } from "@/context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { Link } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { useContext, useEffect, useState } from "react"
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native"

type tbookshelf = {
    id: number
    name: string
}

const Bookshelves = () => {
    const [bookshelves, setBookshelves] = useState<tbookshelf[]>([])

    const {theme} = useContext(ThemeContext)
    const db = useSQLiteContext()

    const styles = createStyles(theme)

    useEffect(() => {
        const getBookshelves = async () => {
            const shelves: tbookshelf[] = await db.getAllAsync(`
                    SELECT * FROM bookshelves
                `)

                setBookshelves(shelves)
        }

        getBookshelves()
    }, [])

    return (
        <View style={styles.container}>
            {theme?.background && theme?.secondary ? <LinearGradient 
            colors={[theme?.secondary, theme?.background]}
            start={{ x: 0, y: 0 }}         
            end={{ x: 0, y: 1 }}           
            style={styles.gradient}>
                <Text style={styles.title}>My Bookshelves</Text>
            </LinearGradient> : null}
            <SafeAreaView>
                <FlatList 
                    data={bookshelves}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        gap: 8
                    }}
                    renderItem={({item}) => (
                        <Link style={styles.renderItem}
                        href={{
                            pathname: "/bookshelves/[id]",
                            params: {
                                id: item.id
                            }
                        }}>
                            <Text style={{
                                color: theme?.text,
                                fontSize: 18,
                                fontWeight: 600
                                }}>
                                {item.name}
                            </Text>
                        </Link>
                    )}
                />
            </SafeAreaView>
        </View>
    )
}

const createStyles = (theme: ThemeColorsType | null) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        title: {
            color: theme?.text,
            fontSize: 24,
            fontWeight: 600
        },
        renderItem: {
            borderWidth: 1.5,
            borderColor: theme?.gray,
            borderRadius: 3,
            padding: 10,
            backgroundColor: theme?.secondary,
            minHeight: 96
        },
        gradient: {
          width: "100%",
          height: 50,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 12
          }
    })
}
export default Bookshelves