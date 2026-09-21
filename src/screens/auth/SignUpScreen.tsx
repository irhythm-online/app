import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUp } from "../../auth/cognito";
import { Button } from "../../components/Button";
import { GradientBackground } from "../../components/GradientBackground";
import { TextField } from "../../components/TextField";
import type { AuthStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export function SignUpScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!displayName.trim() || !trimmedEmail || !password) {
      setError("Fill in your name, email, and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { username } = await signUp(trimmedEmail, password, displayName.trim());
      navigation.navigate("ConfirmEmail", { email: trimmedEmail, username });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
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
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join IRhythm and start listening.</Text>

            <TextField
              label="Display name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              placeholder="Alex Rivera"
            />
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
              autoComplete="password-new"
              placeholder="At least 8 characters"
              error={error}
            />

            <Button title="Create account" onPress={handleSignUp} loading={loading} style={styles.submit} />
            <Button title="Already have an account? Log in" variant="ghost" onPress={() => navigation.navigate("Login")} />
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
