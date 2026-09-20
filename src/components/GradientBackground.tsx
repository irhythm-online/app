import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, type ViewStyle } from "react-native";
import { heroGradient } from "../theme/colors";

/** Absolutely-positioned navy gradient wash — render as the first child of a flex container. */
export function GradientBackground({ style }: { style?: ViewStyle }) {
  return (
    <LinearGradient
      colors={heroGradient.colors}
      locations={heroGradient.locations}
      start={heroGradient.start}
      end={heroGradient.end}
      style={[StyleSheet.absoluteFill, style]}
    />
  );
}
