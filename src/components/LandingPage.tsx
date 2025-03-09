import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Notice, AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType, TimeSlot, Language } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { Star, Award, Users, Clock } from 'lucide-react';
import { AppointmentForm } from './AppointmentForm';
import { BookingDetails } from './BookingDetails';
import { translations } from '../translations';
import { generateTimeSlots, validateBookingRequest } from '../utils';
import { toast } from 'react-hot-toast';

export function LandingPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  
  // Get today's date in IST
  const today = new Date();
  const istToday = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const istTodayStr = istToday.toISOString().split('T')[0];

  const [form, setForm] = useState<AppointmentFormType>({
    name: '',
    phone: '',
    age: '',
    city: '',
    date: istTodayStr,
    timeSlot: ''
  });

  useEffect(() => {
    loadNotices();
  }, []);

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (form.date) {
        const slots = await generateTimeSlots(form.date);
        setTimeSlots(slots);
      } else {
        setTimeSlots([]);
      }
    };

    loadTimeSlots();
  }, [form.date]);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('active', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (newForm: AppointmentFormType) => {
    setForm(newForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);

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
      setForm({
        name: '',
        phone: '',
        age: '',
        city: '',
        date: istTodayStr,
        timeSlot: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const services = [
    {
      title: 'General Dermatology',
      description: 'Comprehensive skin health examinations and treatment for various conditions.',
      icon: Star
    },
    {
      title: 'Cosmetic Procedures',
      description: "Advanced treatments to enhance your skin's appearance and health.",
      icon: Award
    },
    {
      title: 'Skin Cancer Screening',
      description: 'Early detection and prevention of skin cancer through thorough screenings.',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />

      {/* Hero Section with Appointment Form */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                ✨ Your Journey to Radiant Skin Starts Here
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
              >
                Expert Skin Care for Your Health & Beauty
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-purple-100 mb-8"
              >
                Professional dermatological care with personalized treatment plans for all your skin concerns.
              </motion.p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
              <AppointmentForm
                form={form}
                setForm={handleFormChange}
                timeSlots={timeSlots}
                t={translations.en}
                onSubmit={handleSubmit}
                success={success}
                loading={bookingLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of dermatological services to help you achieve and maintain healthy, beautiful skin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-200"
                >
                  <div className="bg-gradient-to-br from-violet-100 to-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notice Board */}
      <div className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Latest Updates
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed about our latest services, special offers, and important announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 hover:border-purple-200 transition-all duration-300"
              >
                {notice.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={notice.image_url}
                      alt={notice.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {notice.title}
                  </h3>
                  {notice.content && (
                    <p className="text-gray-600 text-sm">{notice.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {notices.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No updates available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">10+</div>
              <div className="text-purple-100 text-lg">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">15k+</div>
              <div className="text-purple-100 text-lg">Happy Patients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">50+</div>
              <div className="text-purple-100 text-lg">Treatments</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">99%</div>
              <div className="text-purple-100 text-lg">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {bookingDetails && (
        <BookingDetails
          booking={bookingDetails}
          onClose={() => setBookingDetails(null)}
          t={translations.en}
        />
      )}

      <Footer />
    </div>
  );
}