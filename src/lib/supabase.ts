import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

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
