import { TravelType } from './enums';

export interface Country {
  name: string;
  code: string;
}

export interface City {
  name: string;
  country: string;
  region?: string;
}

// ... rest of your existing types ...