import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
  }).format(price);
}

export const ALGERIA_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", 
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", 
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", 
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", 
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", 
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", 
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", 
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "M'Ghair", "El Meniaa"
];

export const ENGINE_STATES = [
  { value: 'perfect', label: 'ما ينقص (Perfect)' },
  { value: 'consumes_little', label: 'ينقص شوي' },
  { value: 'consumes', label: 'ينقص' },
  { value: 'heats', label: 'يسخن' },
];

export const BODY_TERMS = [
  "نقية (صافية)",
  "معاودة (صبغة)",
  "فوال على نظافة",
  "فيها بروتال",
  "رونجروو",
  "فيها راكور",
  "خبشات على برة",
  "كابو محطوط",
  "بيبان محطوطة",
  "فيها صدمة خفيفة",
];

export const CAR_BRANDS = [
  { name: "Toyota", models: ["Hilux", "Corolla", "Yaris", "Land Cruiser", "Prado"] },
  { name: "Volkswagen", models: ["Golf 1", "Golf 2", "Golf 3", "Golf 4", "Golf 5", "Golf 6", "Golf 7", "Golf 8", "Polo", "Passat", "Tiguan", "Caddy"] },
  { name: "Renault", models: ["Clio 1", "Clio 2", "Clio 3", "Clio 4", "Clio 5", "Symbol", "Megane", "Kangoo", "Master", "Laguna"] },
  { name: "Peugeot", models: ["206", "207", "208", "301", "307", "308", "406", "407", "508", "Partner", "Expert"] },
  { name: "Hyundai", models: ["Accent", "Atos", "i10", "i20", "i30", "Tucson", "Santa Fe", "H1"] },
  { name: "Dacia", models: ["Logan", "Sandero", "Stepway", "Duster", "Dokker"] },
  { name: "Kia", models: ["Picanto", "Rio", "Sportage", "Sorento", "K2700"] },
  { name: "Seat", models: ["Ibiza", "Leon", "Arona", "Ateca"] },
  { name: "Suzuki", models: ["Alto", "Swift", "Celerio", "Dzire", "Jimny"] },
];

export const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
