import { AppointmentForm } from '../AppointmentForm';
import { AppointmentFormType, TimeSlot } from '../../types';
import { translations } from '../../translations';
import { text } from '../../theme/colors';

interface HeroSectionProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  handleSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
}

export function HeroSection({ form, setForm, timeSlots, handleSubmit, success, loading }: HeroSectionProps) {
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
        <div className="flex flex-col items-center pt-32 sm:pt-40 pb-12 sm:pb-32 lg:pb-40">
          <div 
            className="text-center max-w-3xl mx-auto"
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          >
            <div className="relative group mb-4 sm:mb-6 inline-block">
              <div className="relative bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium shadow-md border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">✨</span>
                  <span className="text-blue-900">
                    Your Journey to Radiant Skin Starts Here
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-blue-950">
              Expert Skin Care for Your Health & Beauty
            </h1>

            <p className="text-lg sm:text-xl text-blue-800 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Professional dermatological care with personalized treatment plans for all your skin concerns.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                {
                  icon: "h-2 w-2 rounded-full bg-emerald-400",
                  text: "Expert Dermatologists",
                  color: "text-emerald-600"
                },
                {
                  icon: "h-2 w-2 rounded-full bg-amber-400",
                  text: "Advanced Treatments",
                  color: "text-amber-600"
                },
                {
                  icon: "h-2 w-2 rounded-full bg-rose-400",
                  text: "Personalized Care",
                  color: "text-rose-600"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="relative"
                  style={{ contain: 'content' }}
                >
                  <div className="relative bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`${feature.icon}`} />
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
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl">
              <AppointmentForm
                form={form}
                setForm={setForm}
                timeSlots={timeSlots}
                t={translations.en}
                onSubmit={handleSubmit}
                success={success}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}