import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Sample property data for demonstration
const sampleProperties = [
  {
    id: 1,
    title: 'Rumah Mewah di Jakarta Selatan',
    description: 'LT: 200m², LB: 150m², 4 Kamar Tidur, 3 Kamar Mandi',
    price: 'Rp 2.5 Miliar',
    coordinate: {
      latitude: -6.229728,
      longitude: 106.799972,
    },
  },
  {
    id: 2,
    title: 'Apartemen di Kuningan',
    description: 'LT: 75m², 2 Kamar Tidur, 2 Kamar Mandi, Furnished',
    price: 'Rp 1.8 Miliar',
    coordinate: {
      latitude: -6.2275,
      longitude: 106.8222,
    },
  },
  {
    id: 3,
    title: 'Rumah Minimalis di BSD',
    description: 'LT: 120m², LB: 90m², 3 Kamar Tidur, 2 Kamar Mandi',
    price: 'Rp 1.2 Miliar',
    coordinate: {
      latitude: -6.3021,
      longitude: 106.6529,
    },
  },
];

const MapsScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const styles = createStyles(colors);

  const handleMapError = (error: any) => {
    console.error('Map Error:', error);
    setMapError('Terjadi kesalahan saat memuat peta. Pastikan Google Play Services terinstall dan terhubung internet.');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={
              isDark
                ? require('../assets/back_dark.png')
                : require('../assets/back.png')
            }
            style={styles.backIcon}
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Peta Properti</Text>
        
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Map View */}
      {mapError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mapError}</Text>
        </View>
      ) : (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: -6.229728,
              longitude: 106.799972,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {sampleProperties.map(property => (
              <Marker
                key={property.id}
                coordinate={property.coordinate}
                title={property.title}
                description={property.price}
                onPress={() => handlePropertySelect(property)}
              />
            ))}
          </MapView>

          {/* Property Details Panel */}
          {selectedProperty && (
            <View style={styles.propertyPanel}>
              <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
              <Text style={styles.propertyDescription}>{selectedProperty.description}</Text>
              <Text style={styles.propertyPrice}>{selectedProperty.price}</Text>
              
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>Lihat Detail</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Search/Floating Button */}
          <TouchableOpacity style={styles.searchButton}>
            <Image
              source={
                isDark
                  ? require('../assets/select_dark.png')
                  : require('../assets/select.png')
              }
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorText: {
      color: colors.error || 'red',
      fontSize: 16,
      textAlign: 'center',
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    backButton: {
      padding: 8,
      marginRight: 10,
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    headerRightPlaceholder: {
      width: 40,
    },
    map: {
      flex: 1,
    },
    propertyPanel: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    propertyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    propertyDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    propertyPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 12,
    },
    detailButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    detailButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    searchButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchIcon: {
      width: 24,
      height: 24,
      tintColor: '#fff',
    },
  });

export default MapsScreen;
