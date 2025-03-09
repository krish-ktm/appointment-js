import { motion } from 'framer-motion';
import { Notice } from '../../types';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  return (
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
  );
}