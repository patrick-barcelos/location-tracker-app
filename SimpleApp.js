import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function SimpleApp() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [apiStatus, setApiStatus] = useState('Ready to send');
  const [isLoading, setIsLoading] = useState(false);

  // Function to set test location
  const setTestLocation = () => {
    console.log('Setting test location...');
    const testLocation = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 5,
      },
      timestamp: Date.now(),
    };
    setLocation(testLocation);
    setErrorMsg(null);
    console.log('Test location set:', testLocation);
  };

  // Function to send location data to API
  const sendLocationToAPI = async () => {
    console.log('Button pressed! Location:', location);
    
    if (!location) {
      console.log('No location available');
      setApiStatus('No location available');
      return;
    }

    console.log('Setting loading state...');
    setIsLoading(true);
    setApiStatus('Sending...');

    try {
      console.log('Making API call...');
      const response = await fetch('http://localhost:3000/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString(),
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        setApiStatus('Sent successfully!');
        setTimeout(() => setApiStatus('Ready to send'), 2000);
      } else {
        console.log('Failed response:', response.status);
        setApiStatus('Failed to send');
      }
    } catch (error) {
      console.log('API Error:', error);
      setApiStatus('API Error - Check server');
      console.error('Error sending location to API:', error);
    } finally {
      console.log('Resetting loading state...');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      console.log('Starting location permission request...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      
      if (status !== 'granted') {
        console.log('Location permission denied');
        setErrorMsg('Permission to access location was denied');
        return;
      }

      console.log('Getting current position...');
      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 10000,
          timeout: 15000,
        });
        console.log('Current position received:', location);
        setLocation(location);

        // Start watching position for real-time updates
        console.log('Starting location watching...');
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            console.log('Location updated:', location);
            setLocation(location);
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location: ' + error.message);
      }
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude.toFixed(6)}\nLongitude: ${location.coords.longitude.toFixed(6)}\nAccuracy: ${location.coords.accuracy}m`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Tracker - Simple Version</Text>
      <Text style={styles.location}>{text}</Text>
      
      {!location && (
        <TouchableOpacity 
          style={[styles.button, styles.testButton]}
          onPress={setTestLocation}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            Use Test Location (SF)
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={sendLocationToAPI}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Sending...' : 'Send Location to API'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.apiStatus}>Status: {apiStatus}</Text>
      <Text style={styles.debug}>
        Debug: {location ? 'Location OK' : 'No Location'} | {isLoading ? 'Loading' : 'Ready'}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  location: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#FF9500',
  },
  apiStatus: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  debug: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#999',
  },
});