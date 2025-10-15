import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Listing {
  id: string;
  title: string;
  price: string;
  location: string;
  size: string;
  bhk: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  status: 'Available' | 'Closed';
  property_type: 'Rental' | 'Purchase' | 'Commercial Rental';
  sort_order: number;
  neighborhood?: string | null;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export const getPropertyTypeDisplay = (type: string): string => {
  switch (type) {
    case 'Rental':
      return 'To Rent';
    case 'Purchase':
      return 'For Sale';
    case 'Commercial Rental':
      return 'Commercial Rental';
    default:
      return type;
  }
};
