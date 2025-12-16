export interface Feature {
  code: string;
  label: string;
  value: boolean;
}

export interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
  phone?: number;
}
