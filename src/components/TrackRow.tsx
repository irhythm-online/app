import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Song } from "../api/types";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { AlbumArt } from "./AlbumArt";

interface TrackRowProps {
  song: Song;
  isActive?: boolean;
  isPlaying?: boolean;
  isLiked?: boolean;
  onPress: () => void;
  onToggleLike?: () => void;
  index?: number;
}

export function TrackRow({ song, isActive, isPlaying, isLiked, onPress, onToggleLike, index }: TrackRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      android_ripple={{ color: colors.navy700 }}
    >
      {typeof index === "number" ? (
        <Text style={[styles.index, isActive && styles.indexActive]}>{index + 1}</Text>
      ) : (
        <AlbumArt uri={song.coverArtUrl} size={44} radius={8} />
      )}
      <View style={styles.info}>
        <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {song.artistName}
        </Text>
      </View>
      {isActive && isPlaying ? (
        <Ionicons name="volume-high" size={18} color={colors.cyan400} style={styles.trailingIcon} />
      ) : null}
      {onToggleLike ? (
        <Pressable hitSlop={10} onPress={onToggleLike} style={styles.likeButton}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? colors.cyan400 : colors.gray300}
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  pressed: {
    backgroundColor: colors.navy800,
  },
  index: {
    ...typography.bodyMedium,
    color: colors.gray500,
    width: 44,
    textAlign: "center",
  },
  indexActive: {
    color: colors.cyan400,
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  titleActive: {
    color: colors.cyan400,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 2,
  },
  trailingIcon: {
    marginRight: 4,
  },
  likeButton: {
    padding: 4,
  },
});
