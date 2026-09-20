import { useState } from "react";
import { type GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

interface SeekBarProps {
  positionMillis: number;
  durationMillis: number;
  onSeek: (millis: number) => void;
}

function formatTime(millis: number): string {
  if (!Number.isFinite(millis) || millis < 0) return "0:00";
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SeekBar({ positionMillis, durationMillis, onSeek }: SeekBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const progress = durationMillis > 0 ? Math.min(positionMillis / durationMillis, 1) : 0;

  function handlePress(event: GestureResponderEvent) {
    if (barWidth <= 0 || durationMillis <= 0) return;
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / barWidth));
    onSeek(ratio * durationMillis);
  }

  return (
    <View>
      <Pressable
        style={styles.track}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        onPress={handlePress}
      >
        <View style={styles.trackBackground} />
        <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
        <View style={[styles.thumb, { left: `${progress * 100}%` }]} />
      </Pressable>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
        <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
      </View>
    </View>
  );
}

const TRACK_HEIGHT = 4;
const THUMB_SIZE = 14;

const styles = StyleSheet.create({
  track: {
    height: 24,
    justifyContent: "center",
  },
  trackBackground: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.navy600,
  },
  trackFill: {
    position: "absolute",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.cyan400,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.cyan400,
    marginLeft: -THUMB_SIZE / 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: {
    ...typography.caption,
    color: colors.gray500,
  },
});
