import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Demander la permission de caméra
 */
export const requestCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    return true; // iOS gère automatiquement
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permission de caméra',
        message: 'L\'app a besoin d\'accéder à votre caméra pour le selfie de pointage.',
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
 * Prendre une photo selfie
 */
export const takeSelfie = async () => {
  const hasPermission = await requestCameraPermission();
  
  if (!hasPermission) {
    throw new Error('Permission de caméra refusée');
  }

  return new Promise((resolve, reject) => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false,
        saveToPhotos: false,
      },
      (response) => {
        if (response.didCancel) {
          reject(new Error('Photo annulée'));
        } else if (response.errorCode) {
          reject(new Error(response.errorMessage || 'Erreur caméra'));
        } else if (response.assets && response.assets.length > 0) {
          resolve({
            uri: response.assets[0].uri,
            fileName: response.assets[0].fileName,
            type: response.assets[0].type,
          });
        } else {
          reject(new Error('Aucune photo prise'));
        }
      }
    );
  });
};

export default {
  requestCameraPermission,
  takeSelfie,
};

