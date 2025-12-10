import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Demander la permission de localisation
 */
export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await Geolocation.requestAuthorization('whenInUse');
    return result === 'granted';
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission de localisation',
        message: 'L\'app a besoin d\'accéder à votre position pour le pointage.',
        buttonNeutral: 'Plus tard',
        buttonNegative: 'Annuler',
        buttonPositive: 'Autoriser',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
};

/**
 * Obtenir la position actuelle
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

/**
 * Calculer la distance entre deux points (en mètres)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
};

/**
 * Vérifier si on est dans la zone autorisée
 */
export const isWithinRange = (userLat, userLon, siteLat, siteLon, radiusMeters) => {
  const distance = calculateDistance(userLat, userLon, siteLat, siteLon);
  return {
    isWithin: distance <= radiusMeters,
    distance: Math.round(distance),
  };
};

export default {
  requestLocationPermission,
  getCurrentPosition,
  calculateDistance,
  isWithinRange,
};

