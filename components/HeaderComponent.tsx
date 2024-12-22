import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"
import { Pressable, Text, View } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';

const HeaderComponent = () => {

    const { theme, colorScheme, setColorScheme} = useContext(ThemeContext)

    return (
        <View style={{
            backgroundColor: theme?.secondary,
            zIndex: 20,
            marginTop: 32
        }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                height: 12,
                gap: 3,
                marginBottom: 3
                }}>
                    <View style={{
                        width: "64.5%",
                        height: "100%",
                        backgroundColor: theme?.accent,
                    }} />
                    <View style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: theme?.accent,
                    }} />
                </View>
        <View style={{
            width:"100%",
            height: 52,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
        }}>
            <Text style={{
                color: theme?.text,
                fontSize: 18,
                fontWeight: 600,
                marginRight: "auto",
                backgroundColor: theme?.accent,
                flex: 1,
                height: "100%",
                textAlignVertical: "center",
                paddingLeft: 12
            }}>My Library</Text>
            <Pressable style={{
                height: "100%",
                width: 52,
                backgroundColor: theme?.accent,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }} onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
                {colorScheme === 'dark' ? 
                <Octicons name="sun" size={24} color={theme?.text} /> :
                <Octicons name="moon" size={24} color={theme?.text} />}
            </Pressable>
            <Pressable style={{
                height: "100%",
                width: 52,
                backgroundColor: theme?.accent,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Octicons name="search" size={24} color={theme?.text} /> :
            </Pressable>
        </View>
        <View style={{
                display: "flex",
                flexDirection: "row",
                height: 12,
                gap: 3,
                marginTop: 3
                }}>
                    <View style={{
                        width: "41%",
                        height: "100%",
                        backgroundColor: theme?.accent,
                        borderBottomLeftRadius: 5
                    }} />
                    <View style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: theme?.accent,
                        borderBottomRightRadius: 5
                    }} />
                </View>
        </View>
    )
}

export default HeaderComponent