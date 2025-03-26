import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useVehicle } from '../../lib/hooks/useVehicle';
import { useToast } from '../../lib/context/ToastContext';

// Components
import Card from '../components/Card';
import Button from '../components/Button';
import VehicleModelView from '../components/VehicleModelView';

// Fixed type definition for vehicle climate
type ClimateMode = 'face' | 'face-feet' | 'feet' | 'face-defrost';

const ClimateScreen = () => {
  const { vehicle, setVehicleState } = useVehicle();
  const { showToast } = useToast();
  const [activeZone, setActiveZone] = useState('all'); // 'all', 'driver', 'passenger', 'rear'
  
  const handlePowerToggle = () => {
    setVehicleState({
      ...vehicle,
      climate: {
        ...vehicle.climate,
        isOn: !vehicle.climate.isOn
      }
    });
    showToast(vehicle.climate.isOn ? 'Climate turned off' : 'Climate turned on');
  };
  
  const handleTemperatureChange = (value: number) => {
    setVehicleState({
      ...vehicle,
      climate: {
        ...vehicle.climate,
        temperature: value
      }
    });
  };
  
  const handleFanSpeedChange = (level: number) => {
    setVehicleState({
      ...vehicle,
      climate: {
        ...vehicle.climate,
        fanSpeed: level
      }
    });
  };
  
  const handleModeChange = (mode: ClimateMode) => {
    setVehicleState({
      ...vehicle,
      climate: {
        ...vehicle.climate,
        mode: mode
      }
    });
  };
  
  const handlePresetSelect = (preset: string) => {
    let newSettings = { ...vehicle.climate };
    
    switch(preset) {
      case 'defrost':
        newSettings = { ...newSettings, temperature: 24, fanSpeed: 4, mode: 'face-defrost' as ClimateMode, isAcOn: true };
        break;
      case 'comfort':
        newSettings = { ...newSettings, temperature: 22, fanSpeed: 2, mode: 'face' as ClimateMode, isAcOn: true };
        break;
      case 'eco':
        newSettings = { ...newSettings, temperature: 23, fanSpeed: 1, mode: 'face' as ClimateMode, isAcOn: false };
        break;
      case 'max':
        newSettings = { ...newSettings, temperature: 18, fanSpeed: 4, mode: 'face' as ClimateMode, isAcOn: true };
        break;
    }
    
    setVehicleState({
      ...vehicle,
      climate: newSettings
    });
    
    showToast(`${preset.charAt(0).toUpperCase() + preset.slice(1)} preset applied`);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.powerSection}>
          <Text style={styles.headerTitle}>Climate Control</Text>
          <TouchableOpacity
            style={[styles.powerButton, vehicle.climate.isOn && styles.powerButtonActive]}
            onPress={handlePowerToggle}
          >
            <Ionicons name="power" size={24} color={vehicle.climate.isOn ? "#FFFFFF" : "#757575"} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>
          Current cabin temperature: {vehicle.climate.cabinTemperature}°C
        </Text>
      </View>
      
      {vehicle.climate.isOn ? (
        <>
          <Card style={styles.interiorCard}>
            <Text style={styles.sectionTitle}>Zone Control</Text>
            <VehicleModelView 
              activeZone={activeZone} 
              onZoneSelect={setActiveZone} 
              style={styles.interiorView} 
            />
            
            <View style={styles.zoneButtons}>
              <TouchableOpacity 
                style={[styles.zoneButton, activeZone === 'all' && styles.zoneButtonActive]}
                onPress={() => setActiveZone('all')}
              >
                <Text style={[styles.zoneButtonText, activeZone === 'all' && styles.zoneButtonTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.zoneButton, activeZone === 'driver' && styles.zoneButtonActive]}
                onPress={() => setActiveZone('driver')}
              >
                <Text style={[styles.zoneButtonText, activeZone === 'driver' && styles.zoneButtonTextActive]}>Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.zoneButton, activeZone === 'passenger' && styles.zoneButtonActive]}
                onPress={() => setActiveZone('passenger')}
              >
                <Text style={[styles.zoneButtonText, activeZone === 'passenger' && styles.zoneButtonTextActive]}>Passenger</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.zoneButton, activeZone === 'rear' && styles.zoneButtonActive]}
                onPress={() => setActiveZone('rear')}
              >
                <Text style={[styles.zoneButtonText, activeZone === 'rear' && styles.zoneButtonTextActive]}>Rear</Text>
              </TouchableOpacity>
            </View>
          </Card>
          
          <Card style={styles.controlCard}>
            <Text style={styles.sectionTitle}>Temperature</Text>
            <View style={styles.temperatureControl}>
              <Text style={styles.temperatureValue}>{vehicle.climate.temperature}°C</Text>
              <View style={styles.temperatureSlider}>
                <Text style={styles.sliderLabel}>16°C</Text>
                <Slider
                  style={{flex: 1, height: 40}}
                  minimumValue={16}
                  maximumValue={30}
                  step={0.5}
                  value={vehicle.climate.temperature}
                  onValueChange={handleTemperatureChange}
                  minimumTrackTintColor="#FFCC00"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#FFCC00"
                />
                <Text style={styles.sliderLabel}>30°C</Text>
              </View>
            </View>
          </Card>
          
          <Card style={styles.controlCard}>
            <Text style={styles.sectionTitle}>Fan Speed</Text>
            <View style={styles.fanButtons}>
              {[1, 2, 3, 4, 5].map(level => (
                <TouchableOpacity 
                  key={level}
                  style={[
                    styles.fanButton,
                    vehicle.climate.fanSpeed === level && styles.fanButtonActive
                  ]}
                  onPress={() => handleFanSpeedChange(level)}
                >
                  <Text style={[
                    styles.fanButtonText,
                    vehicle.climate.fanSpeed === level && styles.fanButtonTextActive
                  ]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          
          <Card style={styles.controlCard}>
            <Text style={styles.sectionTitle}>Air Flow Direction</Text>
            <View style={styles.modeButtons}>
              <TouchableOpacity 
                style={[styles.modeButton, vehicle.climate.mode === 'face' && styles.modeButtonActive]}
                onPress={() => handleModeChange('face')}
              >
                <MaterialCommunityIcons 
                  name="air-conditioner" 
                  size={24} 
                  color={vehicle.climate.mode === 'face' ? "#FFCC00" : "#757575"} 
                />
                <Text style={styles.modeButtonText}>Face</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeButton, vehicle.climate.mode === 'face-feet' && styles.modeButtonActive]}
                onPress={() => handleModeChange('face-feet')}
              >
                <MaterialCommunityIcons 
                  name="human-handsdown" 
                  size={24} 
                  color={vehicle.climate.mode === 'face-feet' ? "#FFCC00" : "#757575"} 
                />
                <Text style={styles.modeButtonText}>Face & Feet</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeButton, vehicle.climate.mode === 'feet' && styles.modeButtonActive]}
                onPress={() => handleModeChange('feet')}
              >
                <MaterialCommunityIcons 
                  name="shoe-print" 
                  size={24} 
                  color={vehicle.climate.mode === 'feet' ? "#FFCC00" : "#757575"} 
                />
                <Text style={styles.modeButtonText}>Feet</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeButton, vehicle.climate.mode === 'face-defrost' && styles.modeButtonActive]}
                onPress={() => handleModeChange('face-defrost')}
              >
                <MaterialCommunityIcons 
                  name="car-defrost-front" 
                  size={24} 
                  color={vehicle.climate.mode === 'face-defrost' ? "#FFCC00" : "#757575"} 
                />
                <Text style={styles.modeButtonText}>Defrost</Text>
              </TouchableOpacity>
            </View>
          </Card>
          
          <Card style={styles.controlCard}>
            <Text style={styles.sectionTitle}>Quick Settings</Text>
            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => handlePresetSelect('defrost')}
              >
                <MaterialCommunityIcons name="car-defrost-front" size={24} color="#FFFFFF" />
                <Text style={styles.presetButtonText}>Defrost</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => handlePresetSelect('comfort')}
              >
                <MaterialCommunityIcons name="sofa" size={24} color="#FFFFFF" />
                <Text style={styles.presetButtonText}>Comfort</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => handlePresetSelect('eco')}
              >
                <MaterialCommunityIcons name="leaf" size={24} color="#FFFFFF" />
                <Text style={styles.presetButtonText}>Eco</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => handlePresetSelect('max')}
              >
                <MaterialCommunityIcons name="snowflake" size={24} color="#FFFFFF" />
                <Text style={styles.presetButtonText}>Max Cool</Text>
              </TouchableOpacity>
            </View>
          </Card>
          
          <Card style={styles.controlCard}>
            <Text style={styles.sectionTitle}>Additional Controls</Text>
            <View style={styles.additionalControls}>
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>A/C</Text>
                <TouchableOpacity
                  onPress={() => {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        isAcOn: !vehicle.climate.isAcOn
                      }
                    });
                  }}
                >
                  <View style={[styles.toggleButton, vehicle.climate.isAcOn && styles.toggleButtonActive]}>
                    <View style={[styles.toggleIndicator, vehicle.climate.isAcOn && styles.toggleIndicatorActive]} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Recirculation</Text>
                <TouchableOpacity
                  onPress={() => {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        isRecirculationOn: !vehicle.climate.isRecirculationOn
                      }
                    });
                  }}
                >
                  <View style={[styles.toggleButton, vehicle.climate.isRecirculationOn && styles.toggleButtonActive]}>
                    <View style={[styles.toggleIndicator, vehicle.climate.isRecirculationOn && styles.toggleIndicatorActive]} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Rear Defroster</Text>
                <TouchableOpacity
                  onPress={() => {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        isRearDefrostOn: !vehicle.climate.isRearDefrostOn
                      }
                    });
                  }}
                >
                  <View style={[styles.toggleButton, vehicle.climate.isRearDefrostOn && styles.toggleButtonActive]}>
                    <View style={[styles.toggleIndicator, vehicle.climate.isRearDefrostOn && styles.toggleIndicatorActive]} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Heated Seats</Text>
                <TouchableOpacity
                  onPress={() => {
                    setVehicleState({
                      ...vehicle,
                      climate: {
                        ...vehicle.climate,
                        isHeatedSeatsOn: !vehicle.climate.isHeatedSeatsOn
                      }
                    });
                  }}
                >
                  <View style={[styles.toggleButton, vehicle.climate.isHeatedSeatsOn && styles.toggleButtonActive]}>
                    <View style={[styles.toggleIndicator, vehicle.climate.isHeatedSeatsOn && styles.toggleIndicatorActive]} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          
          <View style={styles.scheduleSection}>
            <Button 
              title="Schedule Climate Control" 
              icon="calendar" 
              onPress={() => showToast('Climate scheduling coming soon')}
              variant="outline"
              size="lg"
              style={styles.scheduleButton}
            />
          </View>
        </>
      ) : (
        <View style={styles.powerOffMessage}>
          <MaterialCommunityIcons name="power-sleep" size={64} color="#BDBDBD" />
          <Text style={styles.powerOffText}>Climate control is turned off</Text>
          <Button 
            title="Turn On" 
            icon="power" 
            onPress={handlePowerToggle}
            variant="default"
            size="lg"
            style={styles.turnOnButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#222222',
    paddingTop: 30,
  },
  powerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold', // Changed from fontFamily: FONTS.bold
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: 'normal', // Changed from fontFamily: FONTS.regular
    color: '#CCCCCC',
    marginTop: 8,
  },
  powerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerButtonActive: {
    backgroundColor: '#FFCC00',
  },
  interiorCard: {
    padding: 16,
    margin: 16,
  },
  interiorView: {
    height: 200,
    marginVertical: 16,
  },
  zoneButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zoneButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  zoneButtonActive: {
    backgroundColor: '#FFCC00',
  },
  zoneButtonText: {
    fontSize: 14,
    fontWeight: '500', // Changed from fontFamily: FONTS.medium
    color: '#757575',
  },
  zoneButtonTextActive: {
    color: '#222222',
  },
  controlCard: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold', // Changed from fontFamily: FONTS.bold
    color: '#222222',
    marginBottom: 16,
  },
  temperatureControl: {
    alignItems: 'center',
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: 'bold', // Changed from fontFamily: FONTS.bold
    color: '#222222',
    marginBottom: 16,
  },
  temperatureSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: 'normal', // Changed from fontFamily: FONTS.regular
    color: '#757575',
    width: 40,
    textAlign: 'center',
  },
  fanButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fanButton: {
    flex: 1,
    height: 48,
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
    fontWeight: '500', // Changed from fontFamily: FONTS.medium
    color: '#757575',
  },
  fanButtonTextActive: {
    color: '#222222',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  modeButton: {
    width: '48%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  modeButtonActive: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#FFCC00',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500', // Changed from fontFamily: FONTS.medium
    color: '#757575',
    marginTop: 8,
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  presetButton: {
    width: '48%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
    borderRadius: 8,
    marginBottom: 16,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '500', // Changed from fontFamily: FONTS.medium
    color: '#FFFFFF',
    marginTop: 8,
  },
  additionalControls: {
    marginTop: 8,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500', // Changed from fontFamily: FONTS.medium
    color: '#424242',
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFCC00',
  },
  toggleIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  toggleIndicatorActive: {
    transform: [{ translateX: 20 }],
  },
  scheduleSection: {
    padding: 16,
    marginBottom: 32,
  },
  scheduleButton: {
    width: '100%',
  },
  powerOffMessage: {
    margin: 32,
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  powerOffText: {
    fontSize: 18,
    fontWeight: '500', // Changed from fontFamily: FONTS.medium
    color: '#757575',
    marginVertical: 16,
    textAlign: 'center',
  },
  turnOnButton: {
    marginTop: 16,
  },
});

export default ClimateScreen;