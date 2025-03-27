import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  FlatList,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';
import { carModels } from '../data/carModels';

const { width, height } = Dimensions.get('window');

const CarCatalogueScreen = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const modalY = useSharedValue(height);

  const showCarDetails = (car) => {
    setSelectedCar(car);
    setSelectedTab('overview');
    setActiveImageIndex(0);
    modalY.value = withSpring(0);
  };

  const hideCarDetails = () => {
    modalY.value = withSpring(height);
    setTimeout(() => setSelectedCar(null), 300);
  };

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalY.value }],
    };
  });

  const renderCarCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.carCard} 
      onPress={() => showCarDetails(item)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.carImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardOverlay}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.carName}>{item.name}</Text>
            <Text style={styles.carPrice}>{item.price}</Text>
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.tagText}>{item.category}</Text>
            </View>
            {item.fuelTypes.map((fuel, index) => (
              <View key={index} style={styles.fuelTag}>
                <Text style={styles.tagText}>{fuel}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCarDetails = () => {
    if (!selectedCar) return null;

    return (
      <Modal
        visible={!!selectedCar}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={hideCarDetails}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.imageGallery}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setActiveImageIndex(index);
                }}
              >
                {selectedCar.gallery.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              <View style={styles.paginationDots}>
                {selectedCar.gallery.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex && styles.activeDot
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.detailsContent}>
              <Text style={styles.modelName}>{selectedCar.name}</Text>
              <Text style={styles.modelPrice}>{selectedCar.price}</Text>

              <View style={styles.tabsContainer}>
                {['overview', 'specs', 'features', 'tech'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tab,
                      selectedTab === tab && styles.activeTab
                    ]}
                    onPress={() => setSelectedTab(tab)}
                  >
                    <Text style={[
                      styles.tabText,
                      selectedTab === tab && styles.activeTabText
                    ]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedTab === 'overview' && (
                <View style={styles.section}>
                  <Text style={styles.description}>{selectedCar.description}</Text>
                  <View style={styles.specHighlights}>
                    {Object.entries(selectedCar.specifications).map(([key, value]) => (
                      <View key={key} style={styles.specItem}>
                        <Text style={styles.specLabel}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        <Text style={styles.specValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {selectedTab === 'specs' && (
                <View style={styles.section}>
                  <View style={styles.specGroup}>
                    <Text style={styles.groupTitle}>Engine Specifications</Text>
                    {selectedCar.detailedSpecifications.engine.map((spec, index) => (
                      <View key={index} style={styles.detailedSpecItem}>
                        <Text style={styles.specLabel}>{spec.name}</Text>
                        <Text style={styles.specValue}>{spec.value}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.specGroup}>
                    <Text style={styles.groupTitle}>Dimensions</Text>
                    {selectedCar.detailedSpecifications.dimensions.map((spec, index) => (
                      <View key={index} style={styles.detailedSpecItem}>
                        <Text style={styles.specLabel}>{spec.name}</Text>
                        <Text style={styles.specValue}>{spec.value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {selectedTab === 'features' && (
                <View style={styles.section}>
                  <View style={styles.featuresList}>
                    {selectedCar.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#FFCC33" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {selectedTab === 'tech' && (
                <View style={styles.section}>
                  {selectedCar.technology.map((tech, index) => (
                    <View key={index} style={styles.techItem}>
                      <Text style={styles.techTitle}>{tech.name}</Text>
                      <Text style={styles.techDescription}>{tech.description}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <Button
              title="Book a Test Drive"
              onPress={() => {}}
              variant="default"
              style={styles.bottomButton}
            />
          </View>
        </Animated.View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={carModels}
        renderItem={renderCarCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.cardList}
      />
      {renderCarDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardList: {
    padding: 16,
  },
  carCard: {
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 16,
    color: '#FFCC33',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: '50%',
  },
  categoryTag: {
    backgroundColor: '#FFCC33',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
    marginBottom: 4,
  },
  fuelTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGallery: {
    height: height * 0.4,
    backgroundColor: '#000',
  },
  galleryImage: {
    width,
    height: '100%',
  },
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFCC33',
  },
  detailsContent: {
    padding: 16,
  },
  modelName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modelPrice: {
    fontSize: 20,
    color: '#FFCC33',
    fontWeight: '600',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFCC33',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
  },
  specHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specItem: {
    width: '50%',
    marginBottom: 12,
  },
  specLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailedSpecItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  techItem: {
    marginBottom: 16,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  techDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  bottomButton: {
    width: '100%',
  },
});

export default CarCatalogueScreen;