import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.flex}>
      <GradientBackground />
      <SafeAreaView style={styles.content}>
        <View style={styles.hero}>
          {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
          <Image source={require("../../../assets/icon.png")} style={styles.logo} />
          <Text style={styles.wordmark}>IRhythm</Text>
          <Text style={styles.tagline}>Feel Every Beat.</Text>
        </View>
        <View style={styles.actions}>
          <Button title="Log in" onPress={() => navigation.navigate("Login")} />
          <Button
            title="Create account"
            variant="secondary"
            onPress={() => navigation.navigate("SignUp")}
            style={styles.secondaryButton}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy900 },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 22,
    marginBottom: 24,
  },
  wordmark: {
    ...typography.h1,
    color: colors.white,
  },
  tagline: {
    ...typography.body,
    color: colors.gray300,
    marginTop: 8,
  },
  actions: {
    gap: 14,
  },
  secondaryButton: {
    marginTop: 0,
  },
});
