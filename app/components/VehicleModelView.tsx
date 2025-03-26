import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface VehicleModelViewProps {
  style?: any;
}

const VehicleModelView: React.FC<VehicleModelViewProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: 'https://www.pngall.com/wp-content/uploads/12/Renault-PNG-Images.png' }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default VehicleModelView;