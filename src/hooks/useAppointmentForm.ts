import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { AppointmentForm, BookingDetails, TimeSlot } from '../types';
import { generateTimeSlots, validateBookingRequest } from '../utils';

const TIMEZONE = 'Asia/Kolkata';

export function useAppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  
  // Get today's date in IST
  const today = new Date();
  const istToday = utcToZonedTime(today, TIMEZONE);
  const istTodayStr = format(istToday, 'yyyy-MM-dd');

  const initialForm = {
    name: '',
    phone: '',
    age: '',
    city: '',
    date: istTodayStr,
    timeSlot: ''
  };

  const [form, setForm] = useState<AppointmentForm>(initialForm);

  useEffect(() => {
    if (form.date) {
      loadTimeSlots();
    }
  }, [form.date]);

  const loadTimeSlots = async () => {
    if (!form.date) return;
    
    setLoadingSlots(true);
    try {
      const slots = await generateTimeSlots(form.date);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load available time slots');
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const resetForm = () => {
    // Reset form to initial state
    setForm(initialForm);
    // Reset success state
    setSuccess(false);
    // Reset booking details
    setBookingDetails(null);
    // Reset time slots
    setTimeSlots([]);
    // Load time slots for the initial date
    loadTimeSlots();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, error } = await validateBookingRequest(
        form.phone,
        form.date,
        form.timeSlot
      );

      if (!isValid) {
        throw new Error(error);
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          name: form.name,
          phone: form.phone,
          age: parseInt(form.age),
          city: form.city,
          appointment_date: form.date,
          appointment_time: form.timeSlot,
          status: 'pending'
        })
        .select()
        .single();

      if (appointmentError) throw new Error(appointmentError.message);

      setSuccess(true);
      setBookingDetails(appointment);
      // Reset form and time slots
      setForm(initialForm);
      setTimeSlots([]);
      // Load fresh time slots for the initial date
      loadTimeSlots();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeBookingDetails = () => {
    // Reset everything when closing the modal
    resetForm();
  };

  return {
    form,
    setForm,
    loading,
    loadingSlots,
    success,
    timeSlots,
    bookingDetails,
    handleSubmit,
    resetForm,
    closeBookingDetails
  };
}