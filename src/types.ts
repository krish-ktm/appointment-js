export interface TimeSlot {
  time: string;
  maxBookings: number;
  currentBookings: number;
}

export interface AppointmentForm {
  name: string;
  phone: string;
  age: string;
  city: string;
  date: string;
  timeSlot: string;
}

export interface BookingDetails {
  id: string;
  name: string;
  phone: string;
  age: number;
  city: string;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  age: number;
  city: string;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export type Language = 'en' | 'gu';

export interface Translations {
  title: string;
  name: string;
  phone: string;
  age: string;
  city: string;
  date: string;
  timeSlot: string;
  submit: string;
  required: string;
  selectTime: string;
  bookingFull: string;
  success: string;
  languageSelect: string;
  english: string;
  gujarati: string;
  bookingDetails: string;
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  close: string;
}

export interface User {
  id: string;
  email: string;
  role: 'superadmin' | 'receptionist';
  name: string;
  created_at: string;
  last_login: string | null;
  status: 'active' | 'inactive';
}

export interface LoginCredentials {
  email: string;
  password: string;
}