import { Ionicons } from "@expo/vector-icons";
import { BottomTabBar, createBottomTabNavigator, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { MiniPlayerBar } from "../components/MiniPlayerBar";
import { HomeScreen } from "../screens/home/HomeScreen";
import { LibraryScreen } from "../screens/library/LibraryScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { SearchScreen } from "../screens/search/SearchScreen";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: "home", inactive: "home-outline" },
  Search: { active: "search", inactive: "search-outline" },
  Library: { active: "library", inactive: "library-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <MiniPlayerBar />
      <BottomTabBar {...props} />
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.cyan400,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          backgroundColor: colors.navy900,
          borderTopColor: colors.navy600,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.bodyMedium,
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icon = ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? icon.active : icon.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
