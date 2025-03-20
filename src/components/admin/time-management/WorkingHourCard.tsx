import { useState } from 'react';
import { Calendar, ChevronDown, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkingHour } from '../../../types';
import { WorkingHoursForm } from './WorkingHoursForm';
import { TimeSlotsManager } from './TimeSlotsManager';
import { format } from 'date-fns';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface WorkingHourCardProps {
  day: WorkingHour;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<WorkingHour>) => void;
  onSave: () => void;
  formErrors: Record<string, any>;
  isSaving: boolean;
}

export function WorkingHourCard({
  day,
  isExpanded,
  onToggle,
  onUpdate,
  onSave,
  formErrors,
  isSaving
}: WorkingHourCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  // Function to convert 24h time to 12h time for display
  const to12HourFormat = (time24: string | null): string => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'hh:mm aa');
  };

  const handleGenerateSlots = () => {
    // Generate time slots based on working hours
    const newSlots = [];
    const interval = day.slot_interval || 30;

    if (day.morning_start && day.morning_end) {
      let time = day.morning_start;
      while (time <= day.morning_end) {
        newSlots.push({ time, maxBookings: 3 });
        // Add interval minutes to time
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + interval;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        time = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      }
    }

    if (day.evening_start && day.evening_end) {
      let time = day.evening_start;
      while (time <= day.evening_end) {
        newSlots.push({ time, maxBookings: 3 });
        // Add interval minutes to time
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + interval;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        time = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      }
    }

    onUpdate({ slots: newSlots });
  };

  const handleToggleWorking = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isToggling) return; // Prevent multiple toggles while processing
    
    setIsToggling(true);
    const newIsWorking = e.target.checked;

    try {
      // Update the database first - only update is_working status
      const { error } = await supabase
        .from('working_hours')
        .update({ is_working: newIsWorking })
        .eq('day', day.day);

      if (error) throw error;

      // If successful, update the local state
      onUpdate({ is_working: newIsWorking });
      toast.success(`${day.day} ${newIsWorking ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling working day:', error);
      toast.error('Failed to update working hours');
      // Revert the checkbox state on error
      onUpdate({ is_working: !newIsWorking });
    } finally {
      setIsToggling(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only toggle if the click is not on the checkbox or its label
    if (!(e.target as HTMLElement).closest('label')) {
      onToggle();
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <div
        onClick={handleCardClick}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <h3 className="font-medium text-gray-900">{day.day}</h3>
            {day.is_working && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {day.morning_start && day.morning_end
                    ? `${to12HourFormat(day.morning_start)} - ${to12HourFormat(day.morning_end)}`
                    : 'No morning hours'
                  }
                  {day.evening_start && day.evening_end
                    ? ` | ${to12HourFormat(day.evening_start)} - ${to12HourFormat(day.evening_end)}`
                    : ' | No evening hours'
                  }
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={day.is_working}
              onChange={handleToggleWorking}
              disabled={isToggling}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {isToggling ? '...' : (day.is_working ? 'Working' : 'Closed')}
            </span>
          </label>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && day.is_working && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              <WorkingHoursForm
                day={day}
                onUpdate={onUpdate}
                formErrors={formErrors[day.day] || {}}
              />

              <div className="mt-6">
                <TimeSlotsManager
                  day={day}
                  onGenerateSlots={handleGenerateSlots}
                  onSlotIntervalChange={(interval) => onUpdate({ slot_interval: interval })}
                  onMaxBookingsChange={(index, maxBookings) => {
                    const newSlots = [...day.slots];
                    newSlots[index] = { ...newSlots[index], maxBookings };
                    onUpdate({ slots: newSlots });
                  }}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
