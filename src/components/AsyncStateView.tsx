import type { PropsWithChildren } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { EmptyState } from "./EmptyState";

interface AsyncStateViewProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

/**
 * Shared loading / error / empty state handling so every list screen behaves
 * consistently while the (not-yet-deployed) backend is unavailable.
 */
export function AsyncStateView({
  loading,
  error,
  isEmpty,
  emptyTitle,
  emptyMessage,
  children,
}: PropsWithChildren<AsyncStateViewProps>) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.cyan400} size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (isEmpty) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
