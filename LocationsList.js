import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import API_CONFIG from './config';

export default function LocationsList({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations. Make sure the API server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch locations when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchLocations();
  };

  // Function to format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Function to get distance between two points (approximate)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saved Locations</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchLocations}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing && (
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
        <ScrollView 
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              📍 Total Locations: {locations.length}
            </Text>
            {locations.length > 1 && (
              <Text style={styles.statsText}>
                📏 Total Distance: {
                  locations.reduce((total, location, index) => {
                    if (index === 0) return 0;
                    const prev = locations[index - 1];
                    return total + getDistance(
                      prev.latitude, prev.longitude,
                      location.latitude, location.longitude
                    );
                  }, 0).toFixed(2)
                } km
              </Text>
            )}
          </View>

          {locations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No locations saved yet</Text>
              <Text style={styles.emptySubtext}>Go back and send some locations to see them here!</Text>
            </View>
          ) : (
            locations.map((location, index) => (
              <View key={location.id || index} style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <Text style={styles.locationTitle}>Location #{index + 1}</Text>
                  <Text style={styles.locationTime}>
                    {formatTime(location.timestamp)}
                  </Text>
                </View>
                
                <View style={styles.coordinatesContainer}>
                  <Text style={styles.coordinateText}>
                    📍 Latitude: {location.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinateText}>
                    📍 Longitude: {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.accuracyText}>
                    🎯 Accuracy: {location.accuracy}m
                  </Text>
                </View>

                {index > 0 && (
                  <Text style={styles.distanceText}>
                    📏 Distance from previous: {
                      getDistance(
                        locations[index - 1].latitude, 
                        locations[index - 1].longitude,
                        location.latitude, 
                        location.longitude
                      ).toFixed(2)
                    } km
                  </Text>
                )}

                <Text style={styles.receivedText}>
                  Received: {formatTime(location.receivedAt)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
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
    paddingHorizontal: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
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
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationTime: {
    fontSize: 12,
    color: '#666',
  },
  coordinatesContainer: {
    marginBottom: 10,
  },
  coordinateText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 5,
  },
  distanceText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
    fontWeight: '500',
  },
  receivedText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
});