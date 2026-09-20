import { Pressable, StyleSheet, Text } from "react-native";
import type { Song } from "../api/types";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { AlbumArt } from "./AlbumArt";

const CARD_WIDTH = 136;

export function SongCard({ song, onPress }: { song: Song; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <AlbumArt uri={song.coverArtUrl} size={CARD_WIDTH} />
      <Text style={styles.title} numberOfLines={1}>
        {song.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {song.artistName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.white,
    marginTop: 8,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 2,
  },
});
