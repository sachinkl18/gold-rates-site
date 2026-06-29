// lib/cities.js
// Shared list of major Indian cities used to generate static routes for
// gold-rates/[city] and silver-rates/[city] pages.

export const CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Surat',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Patna',
  'Vadodara',
  'Coimbatore',
  'Kochi',
  'Visakhapatnam',
  'Madurai',
  'Nashik',
  'Ranchi',
  'Guwahati',
  'Mysore',
  'Vijayawada',
  'Thiruvananthapuram',
  'Raipur',
  'Dehradun',
  'Amritsar',
];

export function citySlug(city) {
  return city.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCity(slug) {
  const match = CITIES.find((c) => citySlug(c) === slug);
  return match || null;
}
