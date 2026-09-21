import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirmSignUp, resendConfirmationCode } from "../../auth/cognito";
import { Button } from "../../components/Button";
import { GradientBackground } from "../../components/GradientBackground";
import { TextField } from "../../components/TextField";
import type { AuthStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<AuthStackParamList, "ConfirmEmail">;

export function ConfirmEmailScreen({ route, navigation }: Props) {
  const { email, username } = route.params;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setNotice(null);
    if (!code.trim()) {
      setError("Enter the verification code from your email.");
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp(username, code.trim());
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify that code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      await resendConfirmationCode(username);
      setNotice("We sent a new code to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <View style={styles.flex}>
      <GradientBackground />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to {"\n"}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <TextField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="123456"
              error={error}
            />
            {notice ? <Text style={styles.notice}>{notice}</Text> : null}

            <Button title="Verify" onPress={handleConfirm} loading={loading} style={styles.submit} />
            <Button title="Resend code" variant="ghost" onPress={handleResend} loading={resending} />
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
  email: {
    color: colors.cyan300,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  notice: {
    ...typography.caption,
    color: colors.success,
    marginTop: -8,
    marginBottom: 16,
  },
  submit: {
    marginTop: 8,
    marginBottom: 4,
  },
});
