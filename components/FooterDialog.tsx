import { Pressable, StyleSheet, Text, View } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';
import { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";


const FooterDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(true)


    const {theme} = useContext(ThemeContext)

    const styles = StyleSheet.create({
        drawer: {
            width: "100%",
            height: 200,
            backgroundColor: theme?.secondary,
            bottom: 0,
            left: 0,
            padding: 10,
            display: "flex",
            flexDirection: "row"
            
        }
    })

    return (
        <View style={[{
            position: "absolute",
            right: 10,
            bottom: 28,
            gap: 12,

        }, isDialogOpen ? styles.drawer : null]}>
            {isDialogOpen ? <View style={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "auto",
                    gap: 12
            }}>
                <Pressable style={{
                    backgroundColor: theme?.accent,
                    borderRadius: 4,
                    flex: 1,
                    height: 52,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{
                        color: theme?.text,
                        fontSize: 20
                    }}>Add Book</Text>
                </Pressable>
                <Pressable style={{
                    backgroundColor: theme?.accent,
                    borderRadius: 4,
                    flex: 1,
                    height: 52,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{
                        color: theme?.text,
                        fontSize: 20
                    }}>Add Shelf</Text>
                </Pressable>
            </View> : null}
            
            <Pressable style={{
                    width: 52,
                    height: 52,
                    backgroundColor: theme?.accent,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "auto"
            }} onPress={() => setIsDialogOpen(prev => !prev)}>
            {isDialogOpen ? <Octicons name="chevron-down" size={36} color={theme?.text} /> :
            <Octicons name="plus" size={36} color={theme?.text} /> }
            </Pressable>
        </View>
    )
}

export default FooterDialog