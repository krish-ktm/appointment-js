import { motion } from 'framer-motion';
import { Star, Award, Shield, Calendar } from 'lucide-react';
import React, { memo, useMemo } from 'react';

interface HeroSectionProps {
  t: {
    title: string;
    subtitle: string;
    doctorTitle: string;
    experience: string;
    advancedTreatments: string;
    expertCare: string;
    mrAppointmentCta: string;
    mrAppointmentNote: string;
  };
  disableAnimations?: boolean;
}

interface AnimatedComponentProps {
  children: React.ReactNode;
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  transition?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
}

// Create memoized features to prevent re-renders
const MemoizedFeature = memo(({ feature, index }: { 
  feature: { 
    icon: React.ElementType; 
    text: string; 
    color: string; 
  }; 
  index: number; 
}) => {
  const Icon = feature.icon;
  
  return (
    <div key={index} className="relative p-1">
      <div className="relative bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${feature.color}`} />
          <span className="text-sm font-medium text-white">
            {feature.text}
          </span>
        </div>
      </div>
    </div>
  );
});

// Main component wrapped with memo for optimization
export const HeroSection = memo(({ t, disableAnimations = false }: HeroSectionProps) => {
  // Helper function to conditionally wrap a component with motion
  const AnimatedComponent = useMemo(() => {
    const Component: React.FC<AnimatedComponentProps> = ({ 
      children, 
      initial = { opacity: 0, y: 20 }, 
      animate = { opacity: 1, y: 0 },
      transition = { duration: 0.5 }, 
      className = "",
      ...props
    }) => {
      if (disableAnimations) {
        return <div className={className} {...props}>{children}</div>;
      }
      
      return (
        <motion.div 
          initial={initial} 
          animate={animate}
          transition={transition}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      );
    };
    return Component;
  }, [disableAnimations]);

  // Pre-compute features array to reduce re-rendering
  const features = useMemo(() => [
    {
      icon: Star,
      text: t.experience,
      color: "text-emerald-400"
    },
    {
      icon: Award,
      text: t.advancedTreatments,
      color: "text-amber-400"
    },
    {
      icon: Shield,
      text: t.expertCare,
      color: "text-rose-400"
    }
  ], [t.experience, t.advancedTreatments, t.expertCare]);
  
  // Pre-load images to ensure they're rendered immediately
  React.useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    preloadImage('/gallery/doctor.png');
    preloadImage('/gallery/doctor-office.JPG');
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay - Desktop Only */}
      <div 
        className="absolute inset-0 hidden lg:block"
        style={{ 
          backgroundImage: 'url(/gallery/doctor-office.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90" />
      </div>

      {/* Mobile-only background (optimized for better performance) */}
      <div 
        className="absolute inset-0 lg:hidden"
        style={{ 
          backgroundImage: 'url(/gallery/doctor-office.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90" />
      </div>

      {/* Floating Shapes Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center pt-24 sm:pt-32 pb-12 sm:pb-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left lg:pr-12 mb-12 lg:mb-0">
            <AnimatedComponent
              className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Calendar className="h-5 w-5 text-blue-300 mr-2" />
              <span className="text-sm font-medium text-white">{t.doctorTitle}</span>
            </AnimatedComponent>

            <AnimatedComponent
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {t.title}
            </AnimatedComponent>

            <AnimatedComponent
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {t.subtitle}
            </AnimatedComponent>

            {/* Doctor Image - Visible only on mobile */}
            <AnimatedComponent
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:hidden mb-8"
            >
              {disableAnimations ? (
                <img
                  src="/gallery/doctor.png"
                  alt="Doctor"
                  className="w-full max-w-md mx-auto"
                  style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                  loading="eager"
                />
              ) : (
                <motion.img
                  src="/gallery/doctor.png"
                  alt="Doctor"
                  className="w-full max-w-md mx-auto"
                  style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                  loading="eager"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </AnimatedComponent>

            <AnimatedComponent
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <MemoizedFeature key={index} feature={feature} index={index} />
              ))}
            </AnimatedComponent>
          </div>

          {/* Doctor Image - Visible only on desktop */}
          <AnimatedComponent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block relative"
            style={{ 
              width: '500px',
              minHeight: '600px'
            }}
          >
            {disableAnimations ? (
              <div className="absolute right-0 bottom-0" style={{ zIndex: 1 }}>
                <img
                  src="/gallery/doctor.png"
                  alt="Doctor"
                  className="max-h-[650px] object-contain"
                  style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                  loading="eager"
                />
              </div>
            ) : (
              <motion.div 
                className="absolute right-0 bottom-0"
                style={{ zIndex: 1 }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src="/gallery/doctor.png"
                  alt="Doctor"
                  className="max-h-[650px] object-contain"
                  style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                  loading="eager"
                />
              </motion.div>
            )}
          </AnimatedComponent>
        </div>
      </div>
    </div>
  );
});
