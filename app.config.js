const EAS_UPDATE_URL =
  "https://u.expo.dev/2f1f6211-c99a-46e1-b88d-1b6891e135a7";
const EAS_PROJECT_ID = "2f1f6211-c99a-46e1-b88d-1b6891e135a7";
const EAS_APP_OWNER = "kachdn";

const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    name: IS_DEV ? "Pasha Dev" : "Pasha",
    slug: "pasha-money",
    owner: EAS_APP_OWNER,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./ui/assets/images/icon.png",
    scheme: "pasha.eth",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./ui/assets/images/adaptive-icon.png",
        backgroundColor: IS_DEV ? "#ffffff" : "#ccfbf1",
      },
      edgeToEdgeEnabled: true,
      package: IS_DEV ? "com.pasha.app.test" : "com.pasha.app",
      googleServicesFile: IS_DEV
        ? "./google-services.test.json"
        : "./google-services.prod.json",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: IS_DEV ? "pasha.ngrok.io" : "app.pasha.money",
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./ui/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      //"expo-notifications",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
      [
        "expo-splash-screen",
        {
          image: "./ui/assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: IS_DEV ? "#ffffff" : "#ccfbf1",
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./ui/assets/fonts/Inter-Medium.ttf",
            "./ui/assets/fonts/Inter-Regular.ttf",
            "./ui/assets/fonts/Inter-SemiBold.ttf",
            "./ui/assets/fonts/Inter-Bold.ttf",
            "./ui/assets/fonts/InputMono-Regular.ttf",
            "./ui/assets/fonts/SpaceMono-Regular.ttf",
          ],
        },
      ],
      [
        "react-native-bottom-tabs",
        {
          theme: "material3",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
            kotlinVersion: "2.0.21",
          },
        },
      ],
      [
        "expo-contacts",
        {
          contactsPermission: "Allow Pasha to access your contacts.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    updates: {
      url: EAS_UPDATE_URL,
    },
  },
};
