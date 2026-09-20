/**
 * Font families loaded via @expo-google-fonts/poppins + @expo-google-fonts/inter.
 * Headings use Poppins (600/700), body/UI uses Inter (400/500/600), per BRAND.md.
 */
export const fontFamily = {
  headingSemiBold: "Poppins_600SemiBold",
  headingBold: "Poppins_700Bold",
  bodyRegular: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
} as const;

export const typography = {
  h1: { fontFamily: fontFamily.headingBold, fontSize: 30, lineHeight: 38 },
  h2: { fontFamily: fontFamily.headingBold, fontSize: 24, lineHeight: 32 },
  h3: { fontFamily: fontFamily.headingSemiBold, fontSize: 19, lineHeight: 26 },
  sectionTitle: { fontFamily: fontFamily.headingSemiBold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fontFamily.bodyRegular, fontSize: 15, lineHeight: 21 },
  bodyMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 15, lineHeight: 21 },
  bodySemiBold: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fontFamily.bodyRegular, fontSize: 13, lineHeight: 18 },
  captionMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
} as const;
