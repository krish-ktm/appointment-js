import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { AppointmentForm } from '../appointment/AppointmentForm';
import { AppointmentFormType, TimeSlot } from '../../types';

interface HeroSectionProps {
  form?: AppointmentFormType;
  setForm?: (form: AppointmentFormType) => void;
  timeSlots?: TimeSlot[];
  handleSubmit?: (e: React.FormEvent) => void;
  success?: boolean;
  loading?: boolean;
  loadingSlots?: boolean;
  t: any;
}

export function HeroSection({ 
  form, 
  setForm, 
  timeSlots, 
  handleSubmit, 
  success, 
  loading, 
  loadingSlots = false,
  t 
}: HeroSectionProps) {
  return (
    <div className="container mx-auto md:px-4 pt-16 md:pt-28 lg:pt-32">
      <div className="md:rounded-[2rem] bg-[#2B5C4B] overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 bottom-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <path d="M0,0 Q50,50 100,0 T200,0" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          <div className="absolute right-0 top-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <path d="M0,100 Q50,50 100,100 T200,100" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-160px)]">
            {/* Left Content */}
            <div className="pt-12 md:pt-13 lg:pt-0 pb-12 md:pb-16 lg:pb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 md:space-y-8"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.2]">
                  {t.title || "Comprehensive care for your skin's health and beauty"}
                </h1>

                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
                  {t.subtitle || "At our clinic, we believe in creating personalized solutions that drive real-world impact. From advanced treatments to cutting-edge care."}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 text-base font-medium group border border-white/30 backdrop-blur-sm"
                  >
                    {t.viewServices || "View Our Services"}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/appointment"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-[#2B5C4B] rounded-xl hover:bg-white/90 transition-all duration-300 text-base font-medium shadow-lg shadow-black/10"
                  >
                    {t.bookAppointment || "Book Appointment"}
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative block lg:block mb-12 lg:mb-0"
            >
              <img
                src="https://t3.ftcdn.net/jpg/06/86/67/50/360_F_686675090_RiGX4mnam2uOTITQWNNrGRRU7LO4eMzL.jpg"
                alt="Beautiful woman"
                className="w-full lg:max-w-[120%] object-contain relative z-10"
              />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Conditionally render appointment form if props are provided */}
      {form && setForm && timeSlots && handleSubmit !== undefined && (
        <div 
          className="w-full max-w-5xl mt-8 sm:mt-12 mx-auto appointment-form-section" 
          id="appointment-form"
        >
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl text-center sm:text-2xl font-semibold text-white">{t.title}</h2>
            </div>
            <div className="p-4 sm:p-6">
              <AppointmentForm
                form={form}
                setForm={setForm}
                timeSlots={timeSlots}
                onSubmit={handleSubmit}
                success={success || false}
                loading={loading || false}
                loadingSlots={loadingSlots}
              />
            </div>
          </div>
        </div>
      )}

      {/* MR Appointment Link */}
      <div className="mt-12 sm:mt-16 border-t border-gray-100 pt-8 text-center">
        <div className="inline-flex flex-col items-center">
          <div className="bg-gray-50 px-4 py-2 rounded-lg mb-3">
            <Building2 className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-2">For Medical Representatives</h3>
          <Link
            to="/mr-appointment"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all duration-300 text-sm"
          >
            <span>{t.mrAppointmentCta || "Schedule MR Appointment"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="mt-2 text-xs text-gray-500">
            {t.mrAppointmentNote || "For pharmaceutical and medical equipment representatives"}
          </p>
        </div>
      </div>
    </div>
  );
}