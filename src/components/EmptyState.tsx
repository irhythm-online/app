import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Nothing here yet — go find your next favorite song.",
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    ...typography.h3,
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.gray300,
    textAlign: "center",
  },
});
