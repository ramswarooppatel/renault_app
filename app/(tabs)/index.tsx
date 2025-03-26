import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useVehicle } from '../../lib/hooks/useVehicle';
import { useToast } from '../../lib/context/ToastContext';

// Components
import Card from '../components/Card';
import Button from '../components/Button';
import StatusCard from '../components/StatusCard';
import FeatureAccordion from '../components/FeatureAccordion';
import CarModel3D from '../components/CarModel3D';
import MenuDrawer from '../components/MenuDrawer';

// Mock data service
import { getDashboardData } from '../../lib/services/vehicleService';

export default function TabOneScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(getDashboardData());
  const { vehicle, setVehicleState, lockVehicle, unlockVehicle } = useVehicle();
  const { showToast } = useToast();
  const [menuVisible, setMenuVisible] = useState(false);
  const [tirePressureModalVisible, setTirePressureModalVisible] = useState(false);
  const [activeControlTab, setActiveControlTab] = useState('climate');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [windowsOpen, setWindowsOpen] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [parkingSensorsOn, setParkingSensorsOn] = useState(true);
  const [sunroofOpen, setSunroofOpen] = useState(false);
  const [cruiseControlOn, setCruiseControlOn] = useState(false);
  const [alarmOn, setAlarmOn] = useState(true);
  const [autoParkEnabled, setAutoParkEnabled] = useState(false);
  
  // Sound references
  const engineSoundRef = useRef<Audio.Sound | null>(null);
  const hornSoundRef = useRef<Audio.Sound | null>(null);
  const musicSoundRef = useRef<Audio.Sound | null>(null);
  
  // Animation values
  const fuelAnimationValue = useSharedValue(dashboardData.fuelLevel);
  const batteryAnimationValue = useSharedValue(dashboardData.batteryLevel);
  const engineStartAnimation = useSharedValue(0);
  const windowsAnimation = useSharedValue(0);
  const headlightsAnimation = useSharedValue(0);
  const sunroofAnimation = useSharedValue(0);
  
  useEffect(() => {
    // Load sounds
    async function loadSounds() {
      try {
        // Use platform-independent way to load sounds
        const { sound: engineSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/engine_start.mp3'),
          { shouldPlay: false }
        );
        engineSoundRef.current = engineSound;
        
        const { sound: hornSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/horn.mp3'),
          { shouldPlay: false }
        );
        hornSoundRef.current = hornSound;
        
        const { sound: musicSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/music.mp3'),
          { shouldPlay: false }
        );
        musicSoundRef.current = musicSound;
      } catch (error) {
        console.log('Error loading sounds', error);
        showToast('Could not load sound effects');
      }
    }
    
    loadSounds();
    
    // Cleanup sounds on unmount
    return () => {
      if (engineSoundRef.current) {
        engineSoundRef.current.unloadAsync();
      }
      if (hornSoundRef.current) {
        hornSoundRef.current.unloadAsync();
      }
      if (musicSoundRef.current) {
        musicSoundRef.current.unloadAsync();
      }
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboardData();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    fuelAnimationValue.value = withSpring(dashboardData.fuelLevel);
    batteryAnimationValue.value = withSpring(dashboardData.batteryLevel);
  }, [dashboardData]);
  
  // Play engine sound effect
  const playEngineSound = async () => {
    if (!soundEnabled || !engineSoundRef.current) return;
    
    try {
      await engineSoundRef.current.setPositionAsync(0);
      await engineSoundRef.current.playAsync();
    } catch (error) {
      console.log('Error playing engine sound', error);
    }
  };
  
  // Play horn sound effect
  const playHornSound = async () => {
    if (!soundEnabled || !hornSoundRef.current) return;
    
    try {
      await hornSoundRef.current.setPositionAsync(0);
      await hornSoundRef.current.playAsync();
    } catch (error) {
      console.log('Error playing horn sound', error);
    }
  };
  
  // Toggle music playback
  const toggleMusic = async () => {
    if (!musicSoundRef.current) return;
    
    try {
      if (musicPlaying) {
        await musicSoundRef.current.pauseAsync();
      } else {
        await musicSoundRef.current.playAsync();
      }
      setMusicPlaying(!musicPlaying);
    } catch (error) {
      console.log('Error toggling music', error);
    }
  };
  
  const refreshDashboardData = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setDashboardData(getDashboardData());
      setRefreshing(false);
    }, 1000);
  };
  
  const fuelStyle = useAnimatedStyle(() => {
    return {
      width: `${fuelAnimationValue.value}%`,
    };
  });
  
  const batteryStyle = useAnimatedStyle(() => {
    return {
      width: `${batteryAnimationValue.value}%`,
    };
  });
  
  const handleLockToggle = () => {
    if (vehicle.isLocked) {
      unlockVehicle();
      showToast('Vehicle unlocked successfully');
    } else {
      lockVehicle();
      showToast('Vehicle locked successfully');
    }
  };
  
  const handleRemoteStart = () => {
    setVehicleState({ ...vehicle, isRunning: !vehicle.isRunning });
    
    if (!vehicle.isRunning) {
      // Starting the engine
      playEngineSound();
      engineStartAnimation.value = withSpring(1, { damping: 10, stiffness: 100 });
      showToast('Remote start initiated');
    } else {
      // Stopping the engine
      engineStartAnimation.value = withSpring(0);
      showToast('Engine turned off');
    }
  };
  
  const toggleWindows = () => {
    setWindowsOpen(!windowsOpen);
    windowsAnimation.value = withTiming(windowsOpen ? 0 : 1, { 
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    showToast(windowsOpen ? 'Windows closing' : 'Windows opening');
  };
  
  const toggleHeadlights = () => {
    setHeadlightsOn(!headlightsOn);
    headlightsAnimation.value = withTiming(headlightsOn ? 0 : 1, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    showToast(headlightsOn ? 'Headlights off' : 'Headlights on');
  };
  
  const toggleSunroof = () => {
    setSunroofOpen(!sunroofOpen);
    sunroofAnimation.value = withTiming(sunroofOpen ? 0 : 1, { 
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    showToast(sunroofOpen ? 'Sunroof closing' : 'Sunroof opening');
  };
  
  const handleHorn = () => {
    playHornSound();
    showToast('Horn activated');
  };
  
  const navigateToVehicleDocuments = () => {
    router.push('/vehicle-documents');
  };
  
  const renderClimateControls = () => (
    <View style={styles.controlsCard}>
      <View style={styles.climateHeader}>
        <View style={styles.climateHeaderLeft}>
          <MaterialCommunityIcons name="fan" size={24} color="#FFCC00" />
          <Text style={styles.climateTitle}>Climate Control</Text>
        </View>
        <View style={styles.powerButton}>
          <TouchableOpacity
            onPress={() => {
              setVehicleState({ 
                ...vehicle, 
                climate: { 
                  ...vehicle.climate, 
                  isOn: !vehicle.climate.isOn 
                } 
              });
              showToast(vehicle.climate.isOn ? 'Climate turned off' : 'Climate turned on');
            }}
          >
            <Ionicons 
              name={vehicle.climate.isOn ? "power" : "power-outline"} 
              size={24} 
              color={vehicle.climate.isOn ? "#4CAF50" : "#757575"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {vehicle.climate.isOn && (
        <View style={styles.climateControls}>
          <View style={styles.tempControl}>
            <Text style={styles.tempValue}>{vehicle.climate.temperature}°C</Text>
            <View style={styles.tempButtons}>
              <TouchableOpacity 
                style={styles.tempButton}
                onPress={() => {
                  if (vehicle.climate.temperature > 16) {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        temperature: vehicle.climate.temperature - 1
                      }
                    });
                  }
                }}
              >
                <Ionicons name="remove" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tempButton}
                onPress={() => {
                  if (vehicle.climate.temperature < 30) {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        temperature: vehicle.climate.temperature + 1
                      }
                    });
                  }
                }}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.fanControl}>
            <Text style={styles.fanLabel}>Fan Speed</Text>
            <View style={styles.fanButtons}>
              {[1, 2, 3, 4].map(level => (
                <TouchableOpacity 
                  key={level}
                  style={[
                    styles.fanButton,
                    vehicle.climate.fanSpeed === level && styles.fanButtonActive
                  ]}
                  onPress={() => {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        fanSpeed: level
                      }
                    });
                  }}
                >
                  <Text style={[
                    styles.fanButtonText,
                    vehicle.climate.fanSpeed === level && styles.fanButtonTextActive
                  ]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.climateActionsRow}>
            <TouchableOpacity 
              style={styles.climateActionButton}
              onPress={() => showToast('AC turned on')}
            >
              <MaterialCommunityIcons name="air-conditioner" size={24} color="#222222" />
              <Text style={styles.climateActionText}>AC</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.climateActionButton}
              onPress={() => showToast('Defrost activated')}
            >
              <MaterialCommunityIcons name="car-defrost-front" size={24} color="#222222" />
              <Text style={styles.climateActionText}>Defrost</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.climateActionButton}
              onPress={() => showToast('Auto climate activated')}
            >
              <MaterialCommunityIcons name="auto-fix" size={24} color="#222222" />
              <Text style={styles.climateActionText}>Auto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.climateActionButton}
              onPress={() => showToast('Recirculation toggled')}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="#222222" />
              <Text style={styles.climateActionText}>Recirc</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
  
  const renderVehicleControls = () => (
    <View style={styles.controlsCard}>
      <View style={styles.controlsGrid}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleWindows}
        >
          <MaterialCommunityIcons 
            name={windowsOpen ? "window-open" : "window-closed"} 
            size={28} 
            color="#222222" 
          />
          <Text style={styles.controlText}>Windows</Text>
          <Text style={styles.controlStatus}>{windowsOpen ? 'Open' : 'Closed'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleHeadlights}
        >
          <MaterialCommunityIcons 
            name="car-light-high" 
            size={28} 
            color={headlightsOn ? "#FFCC00" : "#222222"} 
          />
          <Text style={styles.controlText}>Headlights</Text>
          <Text style={styles.controlStatus}>{headlightsOn ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleHorn}
        >
          <MaterialCommunityIcons name="bullhorn" size={28} color="#222222" />
          <Text style={styles.controlText}>Horn</Text>
          <Text style={styles.controlStatus}>Press</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            setParkingSensorsOn(!parkingSensorsOn);
            showToast(parkingSensorsOn ? 'Parking sensors disabled' : 'Parking sensors enabled');
          }}
        >
          <MaterialCommunityIcons 
            name="car-wireless" 
            size={28} 
            color={parkingSensorsOn ? "#4CAF50" : "#222222"} 
          />
          <Text style={styles.controlText}>Parking</Text>
          <Text style={styles.controlStatus}>{parkingSensorsOn ? 'Active' : 'Off'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleSunroof}
        >
          <MaterialCommunityIcons 
            name="car-convertible" 
            size={28} 
            color="#222222" 
          />
          <Text style={styles.controlText}>Sunroof</Text>
          <Text style={styles.controlStatus}>{sunroofOpen ? 'Open' : 'Closed'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            setCruiseControlOn(!cruiseControlOn);
            showToast(cruiseControlOn ? 'Cruise control disabled' : 'Cruise control enabled');
          }}
        >
          <MaterialCommunityIcons 
            name="speedometer" 
            size={28} 
            color={cruiseControlOn ? "#4CAF50" : "#222222"} 
          />
          <Text style={styles.controlText}>Cruise</Text>
          <Text style={styles.controlStatus}>{cruiseControlOn ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            setAlarmOn(!alarmOn);
            showToast(alarmOn ? 'Alarm disabled' : 'Alarm enabled');
          }}
        >
          <MaterialCommunityIcons 
            name="alarm-light" 
            size={28} 
            color={alarmOn ? "#4CAF50" : "#222222"} 
          />
          <Text style={styles.controlText}>Alarm</Text>
          <Text style={styles.controlStatus}>{alarmOn ? 'Armed' : 'Off'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            setAutoParkEnabled(!autoParkEnabled);
            showToast(autoParkEnabled ? 'Auto park disabled' : 'Auto park enabled');
          }}
        >
          <MaterialCommunityIcons 
            name="parking" 
            size={28} 
            color={autoParkEnabled ? "#4CAF50" : "#222222"} 
          />
          <Text style={styles.controlText}>Auto Park</Text>
          <Text style={styles.controlStatus}>{autoParkEnabled ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderAudioControls = () => (
    <View style={styles.controlsCard}>
      <View style={styles.audioControlsHeader}>
        <MaterialCommunityIcons name="music" size={24} color="#FFCC00" />
        <Text style={styles.controlsSectionTitle}>Audio System</Text>
      </View>
      
      <View style={styles.audioControlsContent}>
        <View style={styles.musicStatusBar}>
          <Text style={styles.musicTitle}>{musicPlaying ? 'Now Playing: Driving Playlist' : 'Music Paused'}</Text>
          <TouchableOpacity
            onPress={() => {
              setSoundEnabled(!soundEnabled);
              showToast(soundEnabled ? 'All sounds muted' : 'Sounds enabled');
            }}
          >
            <Ionicons 
              name={soundEnabled ? "volume-high" : "volume-mute"} 
              size={24} 
              color={soundEnabled ? "#4CAF50" : "#757575"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.mediaControls}>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="play-skip-back" size={28} color="#222222" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mediaButton, styles.mediaPlayButton]}
            onPress={toggleMusic}
          >
            <Ionicons 
              name={musicPlaying ? "pause" : "play"} 
              size={36} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="play-skip-forward" size={28} color="#222222" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.audioSourceButtons}>
          <TouchableOpacity style={styles.audioSourceButton}>
            <MaterialCommunityIcons name="radio" size={22} color="#222222" />
            <Text style={styles.audioSourceText}>Radio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.audioSourceButton, styles.audioSourceButtonActive]}>
            <MaterialCommunityIcons name="playlist-music" size={22} color="#222222" />
            <Text style={styles.audioSourceText}>Media</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.audioSourceButton}>
            <MaterialCommunityIcons name="bluetooth" size={22} color="#222222" />
            <Text style={styles.audioSourceText}>Bluetooth</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  const renderSeatControls = () => (
    <View style={styles.controlsCard}>
      <View style={styles.seatControlsHeader}>
        <MaterialCommunityIcons name="car-seat" size={24} color="#FFCC00" />
        <Text style={styles.controlsSectionTitle}>Seat Controls</Text>
      </View>
      
      <View style={styles.seatControlsContent}>
        <View style={styles.seatRow}>
          <TouchableOpacity 
            style={styles.seatButton}
            onPress={() => showToast('Driver seat heating activated')}
          >
            <MaterialCommunityIcons name="car-seat-heater" size={24} color="#222222" />
            <Text style={styles.seatButtonText}>Heat</Text>
          </TouchableOpacity>
          
          <View style={styles.seatPosition}>
            <Text style={styles.seatPositionText}>Driver</Text>
            <MaterialCommunityIcons name="car-seat" size={40} color="#222222" />
            <View style={styles.seatArrows}>
              <TouchableOpacity style={styles.seatArrow}>
                <Ionicons name="arrow-up" size={20} color="#222222" />
              </TouchableOpacity>
              <View style={styles.seatHorizontalArrows}>
                <TouchableOpacity style={styles.seatArrow}>
                  <Ionicons name="arrow-back" size={20} color="#222222" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.seatArrow}>
                  <Ionicons name="arrow-forward" size={20} color="#222222" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.seatArrow}>
                <Ionicons name="arrow-down" size={20} color="#222222" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.seatButton}
            onPress={() => showToast('Driver seat memory saved')}
          >
            <MaterialCommunityIcons name="content-save" size={24} color="#222222" />
            <Text style={styles.seatButtonText}>Memory</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.seatRow}>
          <TouchableOpacity 
            style={styles.seatButton}
            onPress={() => showToast('Passenger seat heating activated')}
          >
            <MaterialCommunityIcons name="car-seat-heater" size={24} color="#222222" />
            <Text style={styles.seatButtonText}>Heat</Text>
          </TouchableOpacity>
          
          <View style={styles.seatPosition}>
            <Text style={styles.seatPositionText}>Passenger</Text>
            <MaterialCommunityIcons name="car-seat" size={40} color="#222222" />
            <View style={styles.seatArrows}>
              <TouchableOpacity style={styles.seatArrow}>
                <Ionicons name="arrow-up" size={20} color="#222222" />
              </TouchableOpacity>
              <View style={styles.seatHorizontalArrows}>
                <TouchableOpacity style={styles.seatArrow}>
                  <Ionicons name="arrow-back" size={20} color="#222222" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.seatArrow}>
                  <Ionicons name="arrow-forward" size={20} color="#222222" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.seatArrow}>
                <Ionicons name="arrow-down" size={20} color="#222222" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.seatButton}
            onPress={() => showToast('Passenger seat memory saved')}
          >
            <MaterialCommunityIcons name="content-save" size={24} color="#222222" />
            <Text style={styles.seatButtonText}>Memory</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  return (
    <>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshDashboardData} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.vehicleName}>{vehicle.nickname}</Text>
              <Text style={styles.vehicleModel}>{vehicle.model} {vehicle.year}</Text>
            </View>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setMenuVisible(true)}
            >
              <Ionicons name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <CarModel3D 
          style={styles.carModelContainer}
          engineAnimation={engineStartAnimation}
          windowsAnimation={windowsAnimation}
          headlightsAnimation={headlightsAnimation}
          sunroofAnimation={sunroofAnimation}
        />
        
        <View style={styles.documentsButtonContainer}>
          <Button
            title="Vehicle Documents"
            icon="document-text"
            onPress={navigateToVehicleDocuments}
            variant="outline"
            size="sm"
          />
        </View>
        
        <View style={styles.vehicleStatsOverview}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="engine" size={20} color="#FFCC00" />
            <Text style={styles.statValue}>{vehicle.isRunning ? 'Running' : 'Off'}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="lock" size={20} color="#FFCC00" />
            <Text style={styles.statValue}>{vehicle.isLocked ? 'Locked' : 'Unlocked'}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fan" size={20} color="#FFCC00" />
            <Text style={styles.statValue}>
              {vehicle.climate.isOn ? `${vehicle.climate.temperature}°C` : 'Off'}
            </Text>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <Button 
            title={vehicle.isLocked ? "Unlock" : "Lock"} 
            icon={vehicle.isLocked ? "lock-closed" : "lock-open"} 
            onPress={handleLockToggle}
            variant={vehicle.isLocked ? "default" : "secondary"}
          />
          
          <Button 
            title={vehicle.isRunning ? "Stop Engine" : "Remote Start"} 
            icon={vehicle.isRunning ? "power" : "power-outline"} 
            onPress={handleRemoteStart}
            variant={vehicle.isRunning ? "black" : "default"}
          />
        </View>
        
        <View style={styles.controlTabs}>
          <TouchableOpacity 
            style={[styles.controlTab, activeControlTab === 'climate' && styles.activeControlTab]}
            onPress={() => setActiveControlTab('climate')}
          >
            <MaterialCommunityIcons 
              name="thermometer" 
              size={22} 
              color={activeControlTab === 'climate' ? "#FFCC00" : "#757575"} 
            />
            <Text style={[
              styles.controlTabText,
              activeControlTab === 'climate' && styles.activeControlTabText
            ]}>Climate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlTab, activeControlTab === 'vehicle' && styles.activeControlTab]}
            onPress={() => setActiveControlTab('vehicle')}
          >
            <MaterialCommunityIcons 
              name="car-cog" 
              size={22} 
              color={activeControlTab === 'vehicle' ? "#FFCC00" : "#757575"} 
            />
            <Text style={[
              styles.controlTabText,
              activeControlTab === 'vehicle' && styles.activeControlTabText
            ]}>Vehicle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlTab, activeControlTab === 'audio' && styles.activeControlTab]}
            onPress={() => setActiveControlTab('audio')}
          >
            <MaterialCommunityIcons 
              name="music" 
              size={22} 
              color={activeControlTab === 'audio' ? "#FFCC00" : "#757575"} 
            />
            <Text style={[
              styles.controlTabText,
              activeControlTab === 'audio' && styles.activeControlTabText
            ]}>Audio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlTab, activeControlTab === 'seats' && styles.activeControlTab]}
            onPress={() => setActiveControlTab('seats')}
          >
            <MaterialCommunityIcons 
              name="car-seat" 
              size={22} 
              color={activeControlTab === 'seats' ? "#FFCC00" : "#757575"} 
            />
            <Text style={[
              styles.controlTabText,
              activeControlTab === 'seats' && styles.activeControlTabText
            ]}>Seats</Text>
          </TouchableOpacity>
        </View>
        
        {activeControlTab === 'climate' && renderClimateControls()}
        {activeControlTab === 'vehicle' && renderVehicleControls()}
        {activeControlTab === 'audio' && renderAudioControls()}
        {activeControlTab === 'seats' && renderSeatControls()}
        
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Vehicle Status</Text>
          
          <View style={styles.statusGrid}>
            <StatusCard 
              title="Fuel Level" 
              icon="gas-station" 
              value={`${dashboardData.fuelLevel}%`}
              status={dashboardData.fuelLevel < 20 ? 'warning' : 'normal'}
            >
              <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, fuelStyle, {
                  backgroundColor: dashboardData.fuelLevel < 20 ? '#FFC107' : '#4CAF50'
                }]} />
              </View>
              <Text style={styles.statusSubtext}>Range: {dashboardData.range} km</Text>
            </StatusCard>
            
            <StatusCard 
              title="Battery" 
              icon="battery" 
              value={`${dashboardData.batteryLevel}%`}
              status={dashboardData.batteryLevel < 30 ? 'warning' : 'normal'}
            >
              <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, batteryStyle, {
                  backgroundColor: dashboardData.batteryLevel < 30 ? '#FFC107' : '#4CAF50'
                }]} />
              </View>
            </StatusCard>
            
            <StatusCard 
              title="Temperature" 
              icon="thermometer" 
              value={`${dashboardData.cabinTemp}°C`}
            >
              <Text style={styles.statusSubtext}>
                Outside: {dashboardData.outsideTemp}°C
              </Text>
            </StatusCard>
            
            <StatusCard 
              title="Tire Pressure" 
              icon="car" 
              value={dashboardData.tirePressureStatus}
              status={dashboardData.tirePressureStatus === 'Normal' ? 'normal' : 'warning'}
            >
              <TouchableOpacity 
                style={styles.detailLink}
                onPress={() => setTirePressureModalVisible(true)}
              >
                <Text style={styles.detailLinkText}>View details</Text>
              </TouchableOpacity>
            </StatusCard>
          </View>
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Smart Fuel Features</Text>
          
          <FeatureAccordion 
            title="Fuel Quality Monitoring"
            icon="shield-checkmark"
            defaultOpen={true}
          >
            <Text style={styles.featureText}>
              Our system uses advanced chemical sensors to analyze fuel composition in real-time,
              ensuring you only receive high-quality fuel that meets manufacturer specifications.
            </Text>
            <Button 
              title="View Fuel Quality Report" 
              icon="document-text" 
              onPress={() => showToast('Loading fuel quality report...')}
              variant="outline"
              size="sm"
              style={styles.featureButton}
            />
          </FeatureAccordion>
          
          <FeatureAccordion 
            title="Misfueling Prevention"
            icon="alert-circle"
          >
            <Text style={styles.featureText}>
              Never put the wrong fuel in your tank again. Our system recognizes fuel types
              and prevents costly misfueling errors that can cause significant engine damage.
            </Text>
            <Button 
              title="View Protection Status" 
              icon="shield" 
              onPress={() => showToast('Misfueling protection: Active')}
              variant="outline"
              size="sm"
              style={styles.featureButton}
            />
          </FeatureAccordion>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>SmartFuel Hub Overview</Text>
          
          <View style={styles.featureHighlightContainer}>
            <View style={styles.featureHighlightHeader}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#FFCC00" />
              <Text style={styles.featureHighlightTitle}>Intelligent Fuel Protection</Text>
            </View>
            <Text style={styles.featureHighlightDescription}>
              Your vehicle is equipped with Renault's SmartFuel Hub technology, providing 
              real-time monitoring of fuel quality, composition, and consumption to protect 
              your engine and optimize performance.
            </Text>
            
            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <View style={styles.featureItemIcon}>
                  <MaterialCommunityIcons name="chemical-weapon" size={20} color="#222222" />
                </View>
                <Text style={styles.featureItemTitle}>Chemical Analysis</Text>
                <Text style={styles.featureItemDescription}>Real-time fuel composition monitoring</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureItemIcon}>
                  <MaterialCommunityIcons name="alert-octagon" size={20} color="#222222" />
                </View>
                <Text style={styles.featureItemTitle}>Misfuel Prevention</Text>
                <Text style={styles.featureItemDescription}>Automatic protection system</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureItemIcon}>
                  <MaterialCommunityIcons name="chart-line" size={20} color="#222222" />
                </View>
                <Text style={styles.featureItemTitle}>Efficiency Analysis</Text>
                <Text style={styles.featureItemDescription}>Track consumption patterns</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureItemIcon}>
                  <MaterialCommunityIcons name="cube-outline" size={20} color="#222222" />
                </View>
                <Text style={styles.featureItemTitle}>Blockchain Records</Text>
                <Text style={styles.featureItemDescription}>Secure transaction history</Text>
              </View>
            </View>
            
            <Button 
              title="View Smart Fuel Dashboard" 
              icon="analytics" 
              onPress={() => showToast('Opening Smart Fuel Dashboard...')}
              variant="default"
              size="default"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Tire Pressure Modal */}
      <Modal
        visible={tirePressureModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTirePressureModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tire Pressure</Text>
              <TouchableOpacity
                onPress={() => setTirePressureModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tirePressureContainer}>
              <Image 
                source={require('../../assets/images/car-top-view.png')} 
                style={styles.carTopView}
                resizeMode="contain"
              />
              
              <View style={styles.tirePressureInfo}>
                <View style={styles.tirePressureRow}>
                  <View style={styles.tirePressureValue}>
                    <Text style={styles.tireValue}>34</Text>
                    <Text style={styles.tireUnit}>PSI</Text>
                    <Text style={styles.tirePosition}>Front Left</Text>
                  </View>
                  
                  <View style={styles.tirePressureValue}>
                    <Text style={styles.tireValue}>34</Text>
                    <Text style={styles.tireUnit}>PSI</Text>
                    <Text style={styles.tirePosition}>Front Right</Text>
                  </View>
                </View>
                
                <View style={styles.tirePressureRow}>
                  <View style={[styles.tirePressureValue, styles.tireWarning]}>
                    <Text style={[styles.tireValue, styles.tireValueWarning]}>28</Text>
                    <Text style={styles.tireUnit}>PSI</Text>
                    <Text style={styles.tirePosition}>Rear Left</Text>
                  </View>
                  
                  <View style={styles.tirePressureValue}>
                    <Text style={styles.tireValue}>33</Text>
                    <Text style={styles.tireUnit}>PSI</Text>
                    <Text style={styles.tirePosition}>Rear Right</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.tirePressureMessage}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#FFC107" />
              <Text style={styles.tirePressureMessageText}>
                Rear left tire pressure is low. Recommended: 34 PSI
              </Text>
            </View>
            
            <Button 
              title="Set Recommended Pressure" 
              onPress={() => {
                setTirePressureModalVisible(false);
                showToast('Navigation to nearest service station');
              }}
              variant="default"
              size="default"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
      
      <MenuDrawer 
        isVisible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#222222',
    paddingTop: 40, // Adjusted for status bar
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#CCCCCC',
  },
  carModelContainer: {
    height: 250,
    marginHorizontal: 16,
    marginTop: 16,
  },
  documentsButtonContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  vehicleStatsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  controlTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeControlTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFCC00',
  },
  controlTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    marginLeft: 4,
  },
  activeControlTabText: {
    color: '#222222',
  },
  controlsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  climateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  climateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  climateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222222',
    marginLeft: 8,
  },
  controlsSectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222222',
    marginLeft: 8,
  },
  powerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  climateControls: {
    marginTop: 16,
  },
  tempControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tempValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
  },
  tempButtons: {
    flexDirection: 'row',
  },
  tempButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fanControl: {
    marginTop: 8,
  },
  fanLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 8,
  },
  fanButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fanButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  fanButtonActive: {
    backgroundColor: '#FFCC00',
  },
  fanButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
  },
  fanButtonTextActive: {
    color: '#222222',
  },
  climateActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  climateActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  climateActionText: {
    fontSize: 12,
    color: '#222222',
    marginTop: 4,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  controlText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222222',
    marginTop: 6,
  },
  controlStatus: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
  audioControlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  audioControlsContent: {
    alignItems: 'center',
  },
  musicStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
  },
  mediaControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mediaButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  mediaPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFCC00',
  },
  audioSourceButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  audioSourceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  audioSourceButtonActive: {
    backgroundColor: '#FFCC00',
  },
  audioSourceText: {
    fontSize: 12,
    color: '#222222',
    marginLeft: 4,
  },
  seatControlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  seatControlsContent: {
    marginTop: 8,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  seatButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  seatButtonText: {
    fontSize: 12,
    color: '#222222',
    marginTop: 4,
  },
  seatPosition: {
    alignItems: 'center',
  },
  seatPositionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 8,
  },
  seatArrows: {
    alignItems: 'center',
    marginTop: 8,
  },
  seatHorizontalArrows: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  seatArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  statusSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222222',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 8,
    width: '100%',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statusSubtext: {
    fontSize: 12,
    color: '#757575',
  },
  detailLink: {
    marginTop: 8,
  },
  detailLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFCC00',
  },
  featuresSection: {
    padding: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 16,
    lineHeight: 20,
  },
  featureButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  featureHighlightContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureHighlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureHighlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginLeft: 12,
  },
  featureHighlightDescription: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureItemIcon: {
    backgroundColor: '#FFCC00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureItemDescription: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  tirePressureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  carTopView: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  tirePressureInfo: {
    width: '100%',
  },
  tirePressureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tirePressureValue: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    width: 100,
  },
  tireWarning: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  tireValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },
  tireValueWarning: {
    color: '#FFC107',
  },
  tireUnit: {
    fontSize: 12,
    color: '#757575',
  },
  tirePosition: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
  },
  tirePressureMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  tirePressureMessageText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
  modalButton: {
    marginTop: 8,
  },
});