import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Building2, Users, Phone, Briefcase } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, isWeekend, isSameDay, startOfToday, addDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

interface MRForm {
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: Date | null;
}

export function MRAppointment() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MRForm>({
    mr_name: '',
    company_name: '',
    division_name: '',
    contact_no: '',
    appointment_date: null
  });

  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    // Disable weekends (0 = Sunday, 6 = Saturday)
    return day === 0 || day === 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.appointment_date) {
        throw new Error('Please select an appointment date');
      }

      // Validate phone number (10 digits)
      if (!/^\d{10}$/.test(form.contact_no)) {
        throw new Error('Please enter a valid 10-digit contact number');
      }

      // Check if the selected date already has 5 appointments
      const { data: existingAppointments, error: countError } = await supabase
        .from('mr_appointments')
        .select('id')
        .eq('appointment_date', format(form.appointment_date, 'yyyy-MM-dd'))
        .eq('status', 'pending');

      if (countError) throw countError;

      if (existingAppointments && existingAppointments.length >= 5) {
        throw new Error('Maximum appointments reached for this date');
      }

      // Create the appointment
      const { error } = await supabase
        .from('mr_appointments')
        .insert({
          mr_name: form.mr_name,
          company_name: form.company_name,
          division_name: form.division_name,
          contact_no: form.contact_no,
          appointment_date: format(form.appointment_date, 'yyyy-MM-dd')
        });

      if (error) throw error;

      toast.success('Appointment booked successfully');
      setForm({
        mr_name: '',
        company_name: '',
        division_name: '',
        contact_no: '',
        appointment_date: null
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-32 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-2xl font-semibold text-white">MR Appointment Booking</h1>
            <p className="text-blue-100 mt-1">Schedule your meeting with the doctor</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Fields */}
              <div className="space-y-4 lg:order-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MR Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.mr_name}
                      onChange={(e) => setForm({ ...form, mr_name: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Enter MR name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.division_name}
                      onChange={(e) => setForm({ ...form, division_name: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Enter division name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={form.contact_no}
                      onChange={(e) => setForm({ ...form, contact_no: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Enter 10-digit contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Date Picker */}
              <div className="lg:order-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date *
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <DatePicker
                    selected={form.appointment_date}
                    onChange={(date) => setForm({ ...form, appointment_date: date })}
                    minDate={new Date()}
                    filterDate={(date) => !isDateDisabled(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select appointment date"
                    required
                    inline
                    calendarClassName="!bg-transparent !border-0 !shadow-none"
                    dayClassName={(date) => 
                      `!rounded-lg hover:!bg-blue-50 ${
                        isSameDay(date, form.appointment_date || new Date()) 
                          ? '!bg-blue-600 !text-white hover:!bg-blue-700'
                          : ''
                      }`
                    }
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Note: Appointments are not available on weekends
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}