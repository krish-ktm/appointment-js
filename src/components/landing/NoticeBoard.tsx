import { motion } from 'framer-motion';
import { Notice } from '../../types';
import { background, text, border, gradients } from '../../theme/colors';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  return (
    <div className={`py-20 bg-gradient-to-b ${background.light}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.primary}`}>
            Latest Updates
          </h2>
          <p className={`text-lg ${text.secondary} max-w-2xl mx-auto`}>
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
              className={`bg-white/80 rounded-2xl shadow-md overflow-hidden ${border.accent} ${border.accentHover} transition-all duration-300 backdrop-blur-sm`}
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
                <h3 className={`text-xl font-semibold ${text.primary} mb-2`}>
                  {notice.title}
                </h3>
                {notice.content && (
                  <p className={`${text.secondary} text-sm`}>{notice.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {notices.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className={text.muted}>No updates available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}