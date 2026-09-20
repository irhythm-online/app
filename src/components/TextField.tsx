import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function TextField({ label, error, style, ...rest }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.gray500}
        style={[styles.input, error && styles.inputError, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.label,
    color: colors.gray300,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.navy800,
    borderWidth: 1,
    borderColor: colors.navy600,
    color: colors.white,
    fontFamily: fontFamily.bodyRegular,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: 6,
  },
});
