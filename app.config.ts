import "dotenv/config";
import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "IRhythm",
  slug: "irhythm",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "irhythm",
  userInterfaceStyle: "dark",
  backgroundColor: "#0A1628",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.irhythm.app",
  },
  android: {
    package: "com.irhythm.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0A1628",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
    backgroundColor: "#0A1628",
  },
  plugins: [
    [
      "expo-splash-screen",
      {
        image: "./assets/splash.png",
        imageWidth: 220,
        resizeMode: "contain",
        backgroundColor: "#0A1628",
      },
    ],
  ],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? "https://api.irhythm.example.com/v1",
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID ?? "ap-south-1_PLACEHOLDER",
    cognitoClientId: process.env.COGNITO_CLIENT_ID ?? "placeholder-cognito-client-id",
    awsRegion: process.env.AWS_REGION ?? "ap-south-1",
    eas: {
      projectId: "e5d8e15e-de58-4f23-bd46-4cb37b181124",
    },
  },
};

export default config;
