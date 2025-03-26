import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useVehicle } from '../../lib/hooks/useVehicle';
import { useToast } from '../../lib/context/ToastContext';

interface MenuDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isVisible, onClose }) => {
  const { vehicle } = useVehicle();
  const { showToast } = useToast();
  
  const translateX = useSharedValue(DRAWER_WIDTH);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (isVisible) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0.5, {
        duration: 300,
      });
    } else {
      translateX.value = withTiming(DRAWER_WIDTH, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 300,
      });
    }
  }, [isVisible]);
  
  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    } as any;
  });
  
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const handleBackdropPress = () => {
    onClose();
  };

  const handleMenuItemPress = (action: string) => {
    showToast(`${action} selected`);
    onClose();
  };
  
  return (
    <>
      <Animated.View 
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>
      
      <Animated.View style={[styles.drawer, drawerStyle]}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileIcon}>
              <MaterialCommunityIcons name="account" size={36} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Renault Owner</Text>
              <Text style={styles.profileEmail}>owner@example.com</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#CCCCCC" />
            </TouchableOpacity>
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle.nickname}</Text>
            <Text style={styles.vehicleModel}>{vehicle.model} {vehicle.year}</Text>
          </View>
        </View>
        
        <View style={styles.menuItems}>
          {[
            { icon: "speedometer", label: "Dashboard" },
            { icon: "car", label: "Vehicle Profile" },
            { icon: "tools", label: "Maintenance Schedule" },
            { icon: "gas-station", label: "Fuel History" },
            { icon: "map", label: "Trip Records" },
            { icon: "shield-check", label: "SmartFuel Hub" },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.label)}
            >
              <MaterialCommunityIcons name={item.icon as any} size={24} color="#222222" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuItemPress('Settings')}
          >
            <Ionicons name="settings" size={24} color="#222222" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuItemPress('Help & Support')}
          >
            <Ionicons name="help-circle" size={24} color="#222222" />
            <Text style={styles.menuItemText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => handleMenuItemPress('Logout')}
          >
            <Ionicons name="log-out" size={20} color="#757575" />
            <Text style={styles.footerButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  backdropTouchable: {
    width: '100%',
    height: '100%',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  header: {
    backgroundColor: '#222222',
    padding: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  vehicleInfo: {
    marginTop: 8,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },
  menuItems: {
    padding: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerButtonText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MenuDrawer;
