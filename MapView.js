import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import API_CONFIG from './config';

export default function MapScreen({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Function to fetch locations from API
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching locations from API...');
      
      const response = await fetch(`${API_CONFIG.getApiUrl()}/api/location`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched locations:', data);
      
      if (data.data && data.data.length > 0) {
        setLocations(data.data);
        
        // Center map on the latest location
        const latestLocation = data.data[data.data.length - 1];
        setMapRegion({
          latitude: latestLocation.latitude,
          longitude: latestLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Function to format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Function to get marker color based on age
  const getMarkerColor = (timestamp) => {
    const now = new Date();
    const locationTime = new Date(timestamp);
    const hoursDiff = (now - locationTime) / (1000 * 60 * 60);
    
    if (hoursDiff < 1) return '#FF0000'; // Red for recent (< 1 hour)
    if (hoursDiff < 24) return '#FF8C00'; // Orange for today (< 24 hours)
    return '#808080'; // Gray for older
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Location Map</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchLocations}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLocations}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <>
          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {locations.map((location, index) => (
              <Marker
                key={location.id || index}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={`Location ${index + 1}`}
                description={`Time: ${formatTime(location.timestamp)}\nAccuracy: ${location.accuracy}m`}
                pinColor={getMarkerColor(location.timestamp)}
              />
            ))}
          </MapView>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Showing {locations.length} location{locations.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.legendText}>
              🔴 Recent (less than 1hr) | 🟠 Today (less than 24hr) | ⚪ Older
            </Text>
          </View>

          {locations.length > 0 && (
            <ScrollView style={styles.locationsList}>
              <Text style={styles.listTitle}>Recent Locations:</Text>
              {locations.slice(-5).reverse().map((location, index) => (
                <View key={location.id || index} style={styles.locationItem}>
                  <Text style={styles.locationText}>
                    📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.timeText}>
                    {formatTime(location.timestamp)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#28a745',
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  legendText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  locationsList: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});