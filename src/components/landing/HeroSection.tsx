import { AppointmentForm } from '../appointment/AppointmentForm';
import { AppointmentFormType, TimeSlot } from '../../types';
import { translations } from '../../translations';
import { text } from '../../theme/colors';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Star, Award, Shield } from 'lucide-react';

interface HeroSectionProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  handleSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
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
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50/50 to-white will-change-transform">
      <div 
        className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }} 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center pt-24 sm:pt-40 pb-12 sm:pb-32 lg:pb-40">
          <div 
            className="text-center max-w-3xl mx-auto"
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          >
            <div className="relative group mb-4 sm:mb-6 inline-block">
              <div className="relative bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium shadow-md border border-gray-100 m-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">✨</span>
                  <span className="text-blue-900">{t.doctorTitle}</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-blue-950">
              {t.title}
            </h1>

            <p className="text-lg sm:text-xl text-blue-800 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              {t.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  icon: Star,
                  text: t.experience,
                  color: "text-emerald-600"
                },
                {
                  icon: Award,
                  text: t.advancedTreatments,
                  color: "text-amber-600"
                },
                {
                  icon: Shield,
                  text: t.expertCare,
                  color: "text-rose-600"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="relative p-1"
                  style={{ contain: 'content' }}
                >
                  <div className="relative bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <feature.icon className={`h-4 w-4 ${feature.color}`} />
                      <span className={`text-sm font-medium ${feature.color}`}>
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="w-full max-w-5xl mt-8 sm:mt-12 appointment-form-section" 
            id="appointment-form"
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)',
              contain: 'content'
            }}
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
                  success={success}
                  loading={loading}
                  loadingSlots={loadingSlots}
                />
              </div>
            </div>
          </div>

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
                <span>{t.mrAppointmentCta}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="mt-2 text-xs text-gray-500">
                {t.mrAppointmentNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}