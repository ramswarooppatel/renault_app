import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
  ScrollView,
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
import { useRouter } from 'expo-router';

interface MenuDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isVisible, onClose }) => {
  const { vehicle } = useVehicle();
  const { showToast } = useToast();
  const router = useRouter();
  
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

  const handleMenuItemPress = (route: string) => {
    onClose();
    switch (route) {
      case 'Dashboard':
        router.push('/(tabs)');
        break;
      case 'Vehicle Profile':
        router.push('/menu/vehicle-profile');
        break;
      case 'Maintenance Schedule':
        router.push('/menu/maintenance');
        break;
      case 'Fuel History':
        router.push('/menu/fuel-history');
        break;
      case 'Trip Records':
        router.push('/menu/trip-records');
        break;
      case 'SmartFuel Hub':
        router.push('/menu/smartfuel');
        break;
      case 'Owner Manual':
        router.push('/menu/manual');
        break;
      case 'Diagrams':
        router.push('/menu/diagrams');
        break;
      case 'Issue Resolution':
        router.push('/menu/support/issues');
        break;
      case 'Contact Us':
        router.push('/menu/support/contact');
        break;
      case 'About':
        router.push('/menu/about');
        break;
      case 'Legal Documents':
        router.push('/menu/legal');
        break;
      case 'Settings':
        router.push('/menu/settings');
        break;
      case 'Help & Support':
        router.push('/menu/support');
        break;
      default:
        showToast(`${route} selected`);
    }
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
        <View style={styles.container}>
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
          
          <ScrollView 
            style={styles.menuItemsContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.menuItems}>
              {[
                { icon: "speedometer", label: "Dashboard", route: "/(tabs)" },
                { icon: "car", label: "Vehicle Profile", route: "/(tabs)/vehicle-profile" },
                { icon: "tools", label: "Maintenance Schedule", route: "/(tabs)/maintenance" },
                { icon: "gas-station", label: "Fuel History", route: "/(tabs)/fuel-history" },
                { icon: "map", label: "Trip Records", route: "/(tabs)/trip-records" },
                { icon: "shield-check", label: "SmartFuel Hub", route: "/(tabs)/smartfuel" },
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

              {/* Documentation Section */}
              <Text style={styles.menuSectionTitle}>Documentation</Text>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('Owner Manual')}
              >
                <MaterialCommunityIcons name="book-open-variant" size={24} color="#222222" />
                <Text style={styles.menuItemText}>Owner Manual</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('Diagrams')}
              >
                <MaterialCommunityIcons name="car-info" size={24} color="#222222" />
                <Text style={styles.menuItemText}>Vehicle Diagrams</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Support Section */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('Issue Resolution')}
              >
                <MaterialCommunityIcons name="wrench" size={24} color="#222222" />
                <Text style={styles.menuItemText}>Issue Resolution</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('Contact Us')}
              >
                <MaterialCommunityIcons name="message" size={24} color="#222222" />
                <Text style={styles.menuItemText}>Contact Us</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Info Section */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('About')}
              >
                <MaterialCommunityIcons name="information" size={24} color="#222222" />
                <Text style={styles.menuItemText}>About</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('Legal Documents')}
              >
                <MaterialCommunityIcons name="file-document" size={24} color="#222222" />
                <Text style={styles.menuItemText}>Legal Documents</Text>
              </TouchableOpacity>

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
          </ScrollView>

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
    backgroundColor: '#FFFFFF',
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
  menuSectionTitle: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  menuItemsContainer: {
    flex: 1,
  },
});

export default MenuDrawer;