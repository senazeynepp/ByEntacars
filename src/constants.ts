import { Car, ChargingStation, Office } from './types';

export const CARS: Car[] = [
  {
    id: '1',
    brand: 'Opel',
    model: 'Frontera Electric',
    type: 'Eco Konfor',
    range: 400,
    battery: 54,
    chargingTime: '30 dk (%80)',
    pricePerDay: 1850,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    passengers: '4+1 Kişi',
    luggage: '3 Bagaj',
    transmission: 'Otomatik',
    fuelType: 'Elektrik',
    features: ['Geri Görüş Kamerası', 'Şerit Takip Sistemi', 'Hız Sabitleyici', 'Apple CarPlay'],
    locations: ['İstanbul Havalimanı', 'Sabiha Gökçen', 'Ankara Şehir Ofis']
  },
  {
    id: '2',
    brand: 'Citroen',
    model: 'e-C4 X',
    type: 'Suv',
    range: 360,
    battery: 50,
    chargingTime: '30 dk (%80)',
    pricePerDay: 1950,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    passengers: '4+1 Kişi',
    luggage: '4 Bagaj',
    transmission: 'Otomatik',
    fuelType: 'Elektrik',
    features: ['Panoramik Tavan', 'Kör Nokta Uyarı', 'Isıtmalı Koltuklar'],
    locations: ['İstanbul Havalimanı', 'Bodrum Milas', 'Çekmeköy Merkez']
  },
  {
    id: '3',
    brand: 'Peugeot',
    model: 'e-2008',
    type: 'Suv',
    range: 345,
    battery: 50,
    chargingTime: '30 dk (%80)',
    pricePerDay: 2100,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    passengers: '4+1 Kişi',
    luggage: '3 Bagaj',
    transmission: 'Otomatik',
    fuelType: 'Elektrik',
    features: ['i-Cockpit', '3D Navigasyon', 'Park Asistanı'],
    locations: ['İstanbul Havalimanı', 'Sabiha Gökçen', 'Ankara Esenboğa']
  },
  {
    id: '4',
    brand: 'Opel',
    model: 'Corsa-e',
    type: 'Eco Konfor',
    range: 330,
    battery: 50,
    chargingTime: '30 dk (%80)',
    pricePerDay: 1650,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
    passengers: '4+1 Kişi',
    luggage: '2 Bagaj',
    transmission: 'Otomatik',
    fuelType: 'Elektrik',
    features: ['Matris LED Farlar', 'Trafik İşareti Tespit', 'Dijital Panel'],
    locations: ['Çekmeköy Merkez', 'Ankara Şehir Ofis']
  },
  {
    id: '5',
    brand: 'Renault',
    model: 'Zoe (Clio E-Tech)',
    type: 'Eco Konfor',
    range: 395,
    battery: 52,
    chargingTime: '65 dk (%80)',
    pricePerDay: 1550,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    passengers: '4+1 Kişi',
    luggage: '2 Bagaj',
    transmission: 'Otomatik',
    fuelType: 'Elektrik',
    features: ['Eco Modu', 'Eller Serbest Park', 'Bose Ses Sistemi'],
    locations: ['Sabiha Gökçen', 'Bodrum Milas']
  },
  {
    id: '6',
    brand: 'Dacia',
    model: 'Spring (Duster EV)',
    type: 'Suv',
    range: 230,
    battery: 26.8,
    chargingTime: '56 dk (%80)',
    pricePerDay: 1350,
    image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800',
    passengers: '4+1 Kişi',
    luggage: '2 Bagaj',
    transmission: 'Otomatik',
    fuelType: 'Elektrik',
    features: ['Kompakt Tasarım', 'Yüksek Yerden Yükseklik', 'Ekonomik Sürüş'],
    locations: ['Ankara Şehir Ofis', 'Çekmeköy Merkez']
  }
];

export const CHARGING_STATIONS: ChargingStation[] = [
  { id: 's1', name: 'ZES İstanbul Havalimanı', lat: 41.275, lng: 28.751, type: 'DC', address: 'Terminal Otoparkı' },
  { id: 's2', name: 'Eşarj Çekmeköy', lat: 41.033, lng: 29.174, type: 'AC', address: 'Merkez Ofis Yanı' },
  { id: 's3', name: 'ZES Zorlu Center', lat: 41.066, lng: 29.017, type: 'DC', address: 'Beşiktaş, Zorlu Center Otopark P1' },
  { id: 's4', name: 'Eşarj Akasya AVM', lat: 41.002, lng: 29.055, type: 'DC', address: 'Üsküdar, Akasya AVM Otopark' },
  { id: 's5', name: 'Trugo Galataport', lat: 41.026, lng: 28.984, type: 'DC', address: 'Karaköy, Galataport Otopark' },
  { id: 's6', name: 'ZES Mall of Istanbul', lat: 41.063, lng: 28.808, type: 'DC', address: 'Başakşehir, MOI Otopark' },
  { id: 's7', name: 'Eşarj Viaport Asia', lat: 40.928, lng: 29.323, type: 'DC', address: 'Pendik, Viaport Otopark' },
  { id: 's8', name: 'ZES İstinye Park', lat: 41.111, lng: 29.034, type: 'DC', address: 'Sarıyer, İstinye Park Otopark' },
  { id: 's9', name: 'ZES Ankara Esenboğa', lat: 40.128, lng: 32.995, type: 'DC', address: 'Geliş Terminali' },
  { id: 's10', name: 'Trugo Bodrum', lat: 37.034, lng: 27.430, type: 'DC', address: 'Milas Havalimanı Yolu' },
  { id: 's11', name: 'Eşarj İzmir', lat: 38.423, lng: 27.142, type: 'DC', address: 'Alsancak Otopark' }
];

export const RENTAL_CONDITIONS = [
  'En az 2 yıllık ehliyet sahibi olmak.',
  '21 yaşını doldurmuş olmak.',
  'Kredi kartı ile provizyon işlemi.',
  'Araçların şarj seviyesi %20 altına düşürülmemelidir.',
  'Günlük 300 km sınır bulunmaktadır.'
];

export const OFFICES: Office[] = [
  {
    id: 'o1',
    name: 'İstanbul Havalimanı Ofisi',
    city: 'İstanbul',
    address: 'İstanbul Havalimanı Gelen Yolcu Terminali, Arnavutköy',
    phone: '+90 212 444 0 538',
    email: 'ist@entacars.com',
    workingHours: '7/24 Açık',
    lat: 41.275,
    lng: 28.751
  },
  {
    id: 'o2',
    name: 'Sabiha Gökçen Ofisi',
    city: 'İstanbul',
    address: 'Sabiha Gökçen Havalimanı Gelen Yolcu Terminali, Pendik',
    phone: '+90 216 444 0 538',
    email: 'saw@entacars.com',
    workingHours: '7/24 Açık',
    lat: 40.898,
    lng: 29.309
  },
  {
    id: 'o3',
    name: 'Çekmeköy Merkez Ofis',
    city: 'İstanbul',
    address: 'Merkez Mah. Çavuşbaşı Cad. No:142, Çekmeköy',
    phone: '+90 216 538 15 00',
    email: 'cekmekoy@entacars.com',
    workingHours: '09:00 - 19:00',
    lat: 41.033,
    lng: 29.174
  },
  {
    id: 'o4',
    name: 'Ankara Esenboğa Ofisi',
    city: 'Ankara',
    address: 'Esenboğa Havalimanı İç Hatlar Gelen Yolcu, Akyurt',
    phone: '+90 312 444 0 538',
    email: 'esb@entacars.com',
    workingHours: '7/24 Açık',
    lat: 40.128,
    lng: 32.995
  },
  {
    id: 'o5',
    name: 'Bodrum Milas Ofisi',
    city: 'Muğla',
    address: 'Milas-Bodrum Havalimanı İç Hatlar Gelen Yolcu',
    phone: '+90 252 444 0 538',
    email: 'bjv@entacars.com',
    workingHours: '08:00 - 23:00',
    lat: 37.250,
    lng: 27.664
  },
  {
    id: 'o6',
    name: 'İzmir Adnan Menderes Ofisi',
    city: 'İzmir',
    address: 'Adnan Menderes Havalimanı İç Hatlar Gelen Yolcu',
    phone: '+90 232 444 0 538',
    email: 'adb@entacars.com',
    workingHours: '08:00 - 23:00',
    lat: 38.292,
    lng: 27.156
  }
];
