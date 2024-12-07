import FooterDialog from "@/components/FooterDialog";
import HeaderComponent from "@/components/HeaderComponent";
import { ThemeColorsType } from "@/constants/Colors";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from "expo-linear-gradient";

export default function Library() {
  
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
          <Text style={[styles.text, {marginVertical: 12, textAlign: "left", paddingLeft: 10, color: theme?.accent}]}>Books</Text>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5
          }} />
        </View>
        <View style={{

          
        }}>
          <Text style={[styles.text, {marginVertical: 12, textAlign: "center"}]}>Shelves</Text>
          <View style={{
            backgroundColor: theme?.accent,
            height: 1.5
          }} />
        </View>
        <View style={{

        }}>
          <Text style={[styles.text, {marginVertical: 12, textAlign: "right"}]}>Market</Text>
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
        colors={[theme?.secondary, theme?.background]} // Gradient colors
        start={{ x: 0, y: 0 }}         // Start at the top
        end={{ x: 0, y: 1 }}           // End at the bottom

              style={{
                width: "100%",
                height: 64,

                zIndex: 10,

              }}/> : null}

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
    }
  })
}