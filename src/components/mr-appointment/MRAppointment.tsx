import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ResponsiveHeader } from '../headers/ResponsiveHeader';
import { Footer } from '../Footer';
import { MRForm, TimeSlot } from './types';
import { MRAppointmentForm } from './MRAppointmentForm';
import { MRAppointmentCalendar } from './MRAppointmentCalendar';
import { MRAppointmentConfirmation } from './MRAppointmentConfirmation';
import { useTranslation } from '../../i18n/useTranslation';
import { validateMRAppointment } from '../../utils/mrAppointments';
import { fetchTimeSlots } from './MRTimeSlotFetcher';

interface MRAppointmentDetails {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  appointment_time?: string;
  created_at: string;
}

export function MRAppointment() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<MRAppointmentDetails | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<MRForm>({
    mr_name: '',
    company_name: '',
    division_name: '',
    contact_no: '',
    appointment_date: null,
    appointment_time: undefined
  });

  useEffect(() => {
    if (form.appointment_date) {
      loadTimeSlots();
    } else {
      setTimeSlots([]);
    }
  }, [form.appointment_date]);

  const loadTimeSlots = async () => {
    if (!form.appointment_date) return;
    
    try {
      const slots = await fetchTimeSlots(form.appointment_date);
      setTimeSlots(slots);
      
      // If current time slot is no longer available, reset it
      if (form.appointment_time) {
        const currentSlot = slots.find(slot => slot.time === form.appointment_time);
        if (!currentSlot || (currentSlot.currentBookings !== undefined && 
            currentSlot.currentBookings >= currentSlot.maxBookings)) {
          setForm(prev => ({ ...prev, appointment_time: undefined }));
        }
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load available time slots');
    }
  };

  const resetForm = () => {
    setForm({
      mr_name: '',
      company_name: '',
      division_name: '',
      contact_no: '',
      appointment_date: null,
      appointment_time: undefined
    });
    setAppointmentDetails(null);
    setTimeSlots([]);
    setCalendarKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const newErrors: FormErrors = {};
    
    if (!form.mr_name?.trim()) {
      newErrors.mr_name = "Medical Representative Name is required";
    }
    
    if (!form.company_name?.trim()) {
      newErrors.company_name = "Company Name is required";
    }
    
    if (!form.division_name?.trim()) {
      newErrors.division_name = "Division Name is required";
    }
    
    if (!form.contact_no) {
      newErrors.contact_no = "Contact Number is required";
    } else if (!/^\d{10}$/.test(form.contact_no)) {
      newErrors.contact_no = "Please enter a valid 10-digit phone number";
    }

    if (!form.appointment_date) {
      newErrors.appointment_date = "Please select an appointment date";
    }

    if (!form.appointment_time) {
      newErrors.appointment_time = "Please select a time slot";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Validate appointment date
      if (!form.appointment_date) {
        throw new Error("Please select an appointment date");
      }
      
      const { isValid, error: validationError } = await validateMRAppointment(form.appointment_date);
      if (!isValid) {
        throw new Error(validationError);
      }

      // Check if the selected time slot is still available
      const currentSlot = timeSlots.find(slot => slot.time === form.appointment_time);
      if (!currentSlot) {
        throw new Error("Please select a time slot");
      }
      
      if (currentSlot.currentBookings !== undefined && 
          currentSlot.currentBookings >= currentSlot.maxBookings) {
        throw new Error(`This time slot is no longer available. Please select another time.`);
      }

      // Create the appointment
      const { data: appointment, error } = await supabase
        .from('mr_appointments')
        .insert({
          mr_name: form.mr_name,
          company_name: form.company_name,
          division_name: form.division_name,
          contact_no: form.contact_no,
          appointment_date: form.appointment_date ? format(form.appointment_date, 'yyyy-MM-dd') : '',
          appointment_time: form.appointment_time
        })
        .select()
        .single();

      if (error) throw error;

      setAppointmentDetails(appointment);
      toast.success(t.mrAppointment.success);
      
      // Force calendar refresh by updating the key
      setCalendarKey(prev => prev + 1);
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to book appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <ResponsiveHeader />
      
      <main className="flex-grow pt-20 sm:pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">{t.mrAppointment.title}</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">{t.mrAppointment.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-2">
                  <MRAppointmentForm 
                    form={form}
                    onChange={setForm}
                    timeSlots={timeSlots}
                    t={t.mrAppointment.form}
                    errors={errors as Record<string, string>}
                  />
                </div>

                <div className="lg:order-1">
                  <MRAppointmentCalendar
                    key={calendarKey}
                    selectedDate={form.appointment_date}
                    onDateChange={(date) => setForm({ ...form, appointment_date: date, appointment_time: undefined })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !form.appointment_date || !form.appointment_time}
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                  loading || !form.appointment_date || !form.appointment_time 
                    ? 'opacity-70 cursor-not-allowed' 
                    : ''
                }`}
              >
                {loading ? t.mrAppointment.form.submitting : t.mrAppointment.form.submit}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      {appointmentDetails && (
        <MRAppointmentConfirmation
          appointment={appointmentDetails}
          onClose={handleClose}
          onScheduleAnother={resetForm}
          t={t.mrAppointment}
        />
      )}

      <Footer />
    </div>
  );
}

interface FormErrors {
  mr_name?: string;
  company_name?: string;
  division_name?: string;
  contact_no?: string;
  appointment_date?: string;
  appointment_time?: string;
}