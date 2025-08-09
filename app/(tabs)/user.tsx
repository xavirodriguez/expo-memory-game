import { StyleSheet } from "react-native";

import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">User</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      <ThemedText>
        This app has two screens:{" "}
        <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{" "}
        <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
      </ThemedText>
      <ThemedText>
        The layout file in{" "}
        <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
        sets up the tab navigator.
      </ThemedText>
      <ExternalLink href="https://docs.expo.dev/router/introduction">
        <ThemedText type="link">Learn more</ThemedText>
      </ExternalLink>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
