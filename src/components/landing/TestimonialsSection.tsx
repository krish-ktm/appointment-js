import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { QuoteIcon } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  avatar?: string;
  rating: number;
}

// Accept optional translation prop
interface TestimonialsSectionProps {
  t?: any;
}

export const TestimonialsSection = ({ t }: TestimonialsSectionProps = {}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Fallback testimonials if translations aren't available
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Rahul Patel',
      title: 'Acne Treatment Patient',
      quote: 'After struggling with acne for years, Dr. Jemish provided a treatment plan that finally cleared my skin. His expertise and compassionate care made all the difference.',
      avatar: '/gallery/testimonial-1.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Sharma',
      title: 'Skin Care Patient',
      quote: 'The personalized attention I received was exceptional. Dr. Patel took the time to understand my skin concerns and provided solutions that worked perfectly for me.',
      avatar: '/gallery/testimonial-2.jpg',
      rating: 5
    },
    {
      id: 3,
      name: 'Amit Singh',
      title: 'Hair Treatment Patient',
      quote: 'I have seen remarkable improvement in my hair growth after following Dr. Patel\'s treatment. The clinic\'s advanced procedures and professional staff made my experience comfortable.',
      avatar: '/gallery/testimonial-3.jpg',
      rating: 4
    },
    {
      id: 4,
      name: 'Aishwarya Desai',
      title: 'Aesthetic Procedure Patient',
      quote: 'The results of my treatment exceeded my expectations. Dr. Jemish has an artistic eye and delivers natural-looking results. I couldn\'t be happier with the care I received.',
      avatar: '/gallery/testimonial-4.jpg',
      rating: 5
    }
  ];

  const onSelect = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  // Generate stars for ratings
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg 
        key={i}
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t?.title || "What Our Patients Say"}
          </h2>
          <p className="text-lg text-gray-600">
            {t?.subtitle || "Real stories from our patients about their experience at our clinic"}
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex-[0_0_100%] min-w-0 pl-4 md:pl-8"
                >
                  <motion.div 
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <QuoteIcon className="h-10 w-10 text-blue-100 absolute top-6 right-6" />
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      {testimonial.avatar && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7986cb&color=fff`;
                            }}
                          />
                        </div>
                      )}
                      
                      {!testimonial.avatar && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {testimonial.name.split(' ').map(name => name[0]).join('')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {renderStars(testimonial.rating)}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-blue-600 text-sm mb-4">{testimonial.title}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-lg leading-relaxed mt-6">"{testimonial.quote}"</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center mt-8 gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;