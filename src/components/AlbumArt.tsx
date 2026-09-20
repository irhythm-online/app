import { Image, View } from "react-native";
import { colors } from "../theme/colors";

interface AlbumArtProps {
  uri?: string | null;
  size: number;
  radius?: number;
}

export function AlbumArt({ uri, size, radius = 12 }: AlbumArtProps) {
  const style = {
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: colors.navy700,
  };

  if (!uri) {
    return <View style={style} />;
  }

  return <Image source={{ uri }} style={style} />;
}
