// Add these interfaces to your existing types.ts file

export interface TimeSlot {
  time: string;
  maxBookings: number;
}

export interface WorkingHour {
  id: string;
  day: string;
  is_working: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
  slot_interval: number;
  slots: TimeSlot[];
  created_at: string;
  updated_at: string;
}