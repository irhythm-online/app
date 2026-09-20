import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { AlbumArt } from "./AlbumArt";

interface BrowseCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  circular?: boolean;
  onPress: () => void;
}

export function BrowseCard({ title, subtitle, imageUrl, circular, onPress }: BrowseCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <AlbumArt uri={imageUrl} size={CARD_ART_SIZE} radius={circular ? CARD_ART_SIZE / 2 : 12} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const CARD_ART_SIZE = 130;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.white,
    marginTop: 8,
    alignSelf: "stretch",
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 2,
  },
});
