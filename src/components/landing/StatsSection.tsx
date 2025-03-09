import { motion } from 'framer-motion';
import { gradients, text } from '../../theme/colors';

export function StatsSection() {
  return (
    <div className={`bg-gradient-to-r ${gradients.primary.dark} ${text.light} py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.secondary}`}>10+</div>
            <div className="text-violet-100 text-lg">Years Experience</div>
          </div>
          <div>
            <div className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.secondary}`}>15k+</div>
            <div className="text-violet-100 text-lg">Happy Patients</div>
          </div>
          <div>
            <div className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.secondary}`}>50+</div>
            <div className="text-violet-100 text-lg">Treatments</div>
          </div>
          <div>
            <div className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.secondary}`}>99%</div>
            <div className="text-violet-100 text-lg">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}