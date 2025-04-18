// Haversine formülü ile iki nokta arasındaki mesafeyi hesaplar (km cinsinden)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function calculateTotalDistance(locations: { lat: number; lng: number }[]): number {
  if (locations.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < locations.length - 1; i++) {
    const loc1 = locations[i];
    const loc2 = locations[i + 1];
    
    totalDistance += calculateDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
  }
  
  return Math.round(totalDistance);
}

export function getDistanceIcon(distance: number) {
  if (distance > 1000) return 'plane';
  if (distance > 100) return 'car';
  return 'walking';
}

export function getDistanceText(distance: number) {
  if (distance > 1000) return 'Uçakla seyahat edilebilecek mesafe';
  if (distance > 100) return 'Araçla seyahat edilebilecek mesafe';
  return 'Yürüyerek kat edilebilecek mesafe';
} 