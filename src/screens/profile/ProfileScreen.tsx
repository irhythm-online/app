import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaView style={styles.flex} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{(user?.displayName ?? "?").charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.displayName ?? "IRhythm listener"}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>
      </View>

      <View style={styles.card}>
        <Row icon="star-outline" label="Subscription" value="Free (Premium coming soon)" />
        <Divider />
        <Row icon="information-circle-outline" label="App version" value={appVersion} />
      </View>

      <View style={styles.footer}>
        <Button title="Log out" variant="secondary" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.gray300} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy950 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.navy700,
    borderWidth: 2,
    borderColor: colors.cyan400,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarInitial: {
    ...typography.h1,
    color: colors.cyan400,
  },
  name: {
    ...typography.h3,
    color: colors.white,
  },
  email: {
    ...typography.body,
    color: colors.gray300,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: colors.navy800,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.navy600,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  rowIcon: {
    width: 22,
  },
  rowLabel: {
    ...typography.body,
    color: colors.white,
    flex: 1,
  },
  rowValue: {
    ...typography.caption,
    color: colors.gray300,
    maxWidth: "45%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.navy600,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
