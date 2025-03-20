import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';
import { WorkingHour } from '../../../types';
import { WorkingHourCard } from './WorkingHourCard';

export function WorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, Record<string, string>>>({});
  const [savingDay, setSavingDay] = useState<string | null>(null);

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('day');

      if (error) throw error;
      setWorkingHours(data || []);
    } catch (error) {
      console.error('Error loading working hours:', error);
      toast.error('Failed to load working hours');
    } finally {
      setLoading(false);
    }
  };

  const validateWorkingHours = (day: WorkingHour): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (day.is_working) {
      // Morning validation
      if (day.morning_start && day.morning_end) {
        if (day.morning_end <= day.morning_start) {
          errors.morning = 'Morning end time must be after start time';
        }
      }

      // Evening validation (except Saturday)
      if (day.day !== 'Saturday' && day.evening_start && day.evening_end) {
        if (day.evening_end <= day.evening_start) {
          errors.evening = 'Evening end time must be after start time';
        }
      }

      // Slots validation
      if (!day.slots || day.slots.length === 0) {
        errors.slots = 'At least one time slot is required';
      }
    }

    return errors;
  };

  const handleWorkingHoursUpdate = async (day: string) => {
    try {
      setSavingDay(day);
      const dayData = workingHours.find(wh => wh.day === day);
      if (!dayData) return;

      // Validate before saving
      const errors = validateWorkingHours(dayData);
      if (Object.keys(errors).length > 0) {
        setFormErrors({ ...formErrors, [day]: errors });
        toast.error('Please fix the validation errors before saving');
        return;
      }

      const { error } = await supabase
        .from('working_hours')
        .update(dayData)
        .eq('day', day);

      if (error) throw error;
      toast.success('Working hours updated successfully');
      setFormErrors({ ...formErrors, [day]: {} });
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('Failed to update working hours');
    } finally {
      setSavingDay(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Working Hours</h2>
            <p className="text-sm text-gray-500 mt-1">Configure clinic working hours and time slots</p>
          </div>
        </div>

        <div className="space-y-3">
          {workingHours.map((day) => (
            <WorkingHourCard
              key={day.day}
              day={day}
              isExpanded={expandedDay === day.day}
              onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              onUpdate={(updates) => {
                setWorkingHours(workingHours.map(wh =>
                  wh.day === day.day ? { ...wh, ...updates } : wh
                ));
              }}
              onSave={() => handleWorkingHoursUpdate(day.day)}
              formErrors={formErrors}
              isSaving={savingDay === day.day}
            />
          ))}
        </div>
      </div>
    </div>
  );
}