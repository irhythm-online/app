import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn } from "../../auth/cognito";
import { Button } from "../../components/Button";
import { GradientBackground } from "../../components/GradientBackground";
import { TextField } from "../../components/TextField";
import type { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const completeSignIn = useAuthStore((s) => s.completeSignIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const tokens = await signIn(email.trim().toLowerCase(), password);
      await completeSignIn(tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.flex}>
      <GradientBackground />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to keep the music going.</Text>

            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              placeholder="••••••••"
              error={error}
            />

            <Button title="Log in" onPress={handleLogin} loading={loading} style={styles.submit} />
            <Button
              title="Don't have an account? Sign up"
              variant="ghost"
              onPress={() => navigation.navigate("SignUp")}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy900 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray300,
    marginBottom: 32,
  },
  submit: {
    marginTop: 8,
    marginBottom: 4,
  },
});
