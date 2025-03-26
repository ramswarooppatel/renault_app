import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';

interface CarModel3DProps {
  style?: object;
  engineAnimation?: Animated.SharedValue<number>;
  windowsAnimation?: Animated.SharedValue<number>;
  headlightsAnimation?: Animated.SharedValue<number>;
  sunroofAnimation?: Animated.SharedValue<number>;
}

const CarModel3D: React.FC<CarModel3DProps> = ({ 
  style,
  engineAnimation,
  windowsAnimation,
  headlightsAnimation,
  sunroofAnimation
}) => {
  const webViewRef = useRef<WebView>(null);

  const resetView = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };
  
  // Animation styles
  const headlightsStyle = useAnimatedStyle(() => {
    if (!headlightsAnimation) return { backgroundColor: 'transparent', opacity: 0 };
    
    return {
      backgroundColor: interpolateColor(
        headlightsAnimation.value,
        [0, 1],
        ['rgba(255, 204, 0, 0)', 'rgba(255, 204, 0, 0.8)']
      ),
      opacity: headlightsAnimation.value,
    };
  });
  
  const windowsStyle = useAnimatedStyle(() => {
    if (!windowsAnimation) return { height: '0%' };
    
    return {
      height: `${windowsAnimation.value * 100}%`,
    };
  });
  
  const sunroofStyle = useAnimatedStyle(() => {
    if (!sunroofAnimation) return { width: '100%' };
    
    return {
      width: `${(1 - sunroofAnimation.value) * 100}%`,
    };
  });
  
  const engineStyle = useAnimatedStyle(() => {
    if (!engineAnimation) return { transform: [] };
    
    return {
      transform: [
        { translateX: engineAnimation.value * 1 },
        { translateY: engineAnimation.value * 1 },
      ],
    } as any;
  });

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://sketchfab.com/models/2d166ebc096d4cc5bdeef76fb2eb1798/embed?dnt=1&autostart=1&ui_theme=dark' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsFullscreenVideo={true}
      />
      
      {/* Visual effects overlays */}
      <Animated.View style={[styles.headlightsOverlay, headlightsStyle]} />
      
      <View style={styles.windowsContainer}>
        <View style={styles.windowLeft}>
          <Animated.View style={[styles.windowOverlay, windowsStyle]} />
        </View>
        <View style={styles.windowRight}>
          <Animated.View style={[styles.windowOverlay, windowsStyle]} />
        </View>
      </View>
      
      <View style={styles.sunroofContainer}>
        <Animated.View style={[styles.sunroofOverlay, sunroofStyle]} />
      </View>
      
      <Animated.View style={[styles.engineEffect, engineStyle]} />
      
      <TouchableOpacity style={styles.resetButton} onPress={resetView}>
        <Ionicons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.resetText}>Reset View</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#222222',
  },
  resetButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  headlightsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  windowsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 2,
  },
  windowLeft: {
    flex: 1,
    overflow: 'hidden',
  },
  windowRight: {
    flex: 1,
    overflow: 'hidden',
  },
  windowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sunroofContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  sunroofOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  engineEffect: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
});

export default CarModel3D;