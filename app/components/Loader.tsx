import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const RenaultLoader = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  scale.value = withRepeat(withSequence(withTiming(1.5, { duration: 2000 }), withTiming(1, { duration: 2000 })), -1, true);
  opacity.value = withRepeat(withSequence(withTiming(0.1, { duration: 2000 }), withTiming(0.3, { duration: 2000 })), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Animated Pulse Background */}
      <Animated.View style={[styles.pulseRing, animatedStyle]} />
      
      {/* Renault Logo */}
      <Svg width={130} height={130} viewBox="0 0 66 86">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFD200" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FFD200" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="33" cy="43" r="35" fill="url(#glow)" />
        <Path d="M52.3 43l-23 43H23L0 43 22.9 0h6.5L6.5 43l19.6 36.9L45.7 43 34.3 21.5l3.3-6.1L52.3 43z" fill="#FFD200" />
        <Path d="M42.5 0h-6.6L13.1 43l14.7 27.6 3.2-6.1L19.6 43 39.2 6l19.6 37-22.9 43h6.6l22.8-43L42.5 0z" fill="#FFD200" />
      </Svg>
      
      {/* Branding Text */}
      <Text style={styles.brandText}>SMART <Text style={styles.yellowText}>Fuel</Text>-<Text style={styles.pinkText}>Renauvate</Text></Text>
      <Text style={styles.subText}>Intelligent Fuel Management System</Text>

      {/* Loading Indicator */}
      <View style={styles.loadingBar}>
        <Animated.View style={[styles.progressBar, { width: "100%" }]} />
      </View>
      <Text style={styles.loadingText}>Loading SmartFuel System...</Text>

      {/* Footer */}
      <Text style={styles.footerText}>Made with ❤️ in INDIA by Team: RouteFusion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  pulseRing: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 210, 0, 0.2)",
  },
  brandText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  yellowText: {
    color: "#FFD200",
  },
  pinkText: {
    color: "#FF4081",
  },
  subText: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 4,
  },
  loadingBar: {
    width: 120,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFD200",
  },
  loadingText: {
    color: "#CCC",
    fontSize: 12,
    marginTop: 5,
  },
  footerText: {
    color: "white",
    fontSize: 12,
    position: "absolute",
    bottom: 20,
  },
});

export default RenaultLoader;
