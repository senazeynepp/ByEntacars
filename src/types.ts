export interface Car {
  id: string;
  brand: string;
  model: string;
  type: string;
  range: number; // km
  battery: number; // kWh
  chargingTime: string;
  pricePerDay: number;
  image: string;
  passengers: string;
  luggage: string;
  transmission: string;
  fuelType: string;
  features: string[];
  locations: string[];
}

export interface ChargingStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'AC' | 'DC';
  address: string;
}

export interface Office {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  lat: number;
  lng: number;
}
