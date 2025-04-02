import { Notice } from '../../types';
import { background, text, gradients } from '../../theme/colors';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMarkdown } from '../../utils/markdown';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

const NoticeItem = ({ 
  notice, 
  formatDate, 
  getLocalizedContent 
}: { 
  notice: Notice; 
  formatDate: (date?: string) => string;
  getLocalizedContent: (content: string | { en: string; gu: string }) => string;
}) => {
  return (
    <div className="flex-[0_0_100%] min-w-0">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-4 border border-gray-100">
        {notice.images && notice.images.length > 0 && (
          <div className="relative w-full aspect-[2/1] overflow-hidden bg-gray-100">
            <img
              src={notice.images[0]}
              alt={getLocalizedContent(notice.title)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                New Update
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(notice.created_at)}
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {getLocalizedContent(notice.title)}
          </h3>

          {notice.content && (
            <div 
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formatMarkdown(getLocalizedContent(notice.content)) 
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  const { language } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        emblaApi.scrollTo(emblaApi.selectedScrollSnap());
      };
      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const date = utcToZonedTime(new Date(dateStr), 'Asia/Kolkata');
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const getLocalizedContent = (content: string | { en: string; gu: string }) => {
    if (typeof content === 'string') return content;
    return content[language] || content.en;
  };

  if (loading) {
    return (
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (notices.length === 0) {
    return null;
  }

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Important Updates</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            Latest Announcements
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed about important updates, schedule changes, and announcements from our clinic.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {notices.map((notice) => (
                <NoticeItem 
                  key={notice.id} 
                  notice={notice} 
                  formatDate={formatDate}
                  getLocalizedContent={getLocalizedContent}
                />
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {notices.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    emblaApi?.selectedScrollSnap() === index
                      ? 'bg-blue-600 w-4'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}