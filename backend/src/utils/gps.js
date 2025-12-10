const geolib = require('geolib');

/**
 * Calculer la distance entre deux points GPS en mètres
 * @param {number} lat1 - Latitude du point 1
 * @param {number} lon1 - Longitude du point 1
 * @param {number} lat2 - Latitude du point 2
 * @param {number} lon2 - Longitude du point 2
 * @returns {number} Distance en mètres
 */
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  return geolib.getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );
};

/**
 * Vérifier si un point est dans une zone définie
 * @param {number} lat - Latitude du point
 * @param {number} lon - Longitude du point
 * @param {number} centerLat - Latitude du centre de la zone
 * @param {number} centerLon - Longitude du centre de la zone
 * @param {number} radiusMeters - Rayon de la zone en mètres
 * @returns {boolean} true si dans la zone
 */
exports.isWithinRadius = (lat, lon, centerLat, centerLon, radiusMeters) => {
  const distance = this.calculateDistance(lat, lon, centerLat, centerLon);
  return distance <= radiusMeters;
};

