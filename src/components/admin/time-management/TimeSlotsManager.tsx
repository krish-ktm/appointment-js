import { useState } from 'react';
import { Settings, Plus, Minus, Trash2 } from 'lucide-react';
import { WorkingHour, TimeSlot } from '../../../types';
import { format } from 'date-fns';

interface TimeSlotsManagerProps {
  day: WorkingHour;
  onGenerateSlots: () => void;
  onSlotIntervalChange: (interval: number) => void;
  onMaxBookingsChange: (index: number, maxBookings: number) => void;
  onDeleteSlot: (index: number) => void;
  onDefaultMaxBookingsChange: (maxBookings: number) => void;
}

export function TimeSlotsManager({ 
  day, 
  onGenerateSlots, 
  onSlotIntervalChange,
  onMaxBookingsChange,
  onDeleteSlot,
  onDefaultMaxBookingsChange
}: TimeSlotsManagerProps) {
  const [defaultMaxBookings, setDefaultMaxBookings] = useState(3);

  // Function to convert 24h time to 12h time for display
  const to12HourFormat = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'hh:mm aa');
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <h4 className="font-medium text-gray-900">Time Slots Settings</h4>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Interval:</label>
            <select
              value={day.slot_interval}
              onChange={(e) => onSlotIntervalChange(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Default Max Bookings:</label>
            <select
              value={defaultMaxBookings}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setDefaultMaxBookings(value);
                onDefaultMaxBookingsChange(value);
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button
            onClick={onGenerateSlots}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Generate Slots
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {day.slots.map((slot: TimeSlot, index: number) => (
          <div
            key={index}
            className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{to12HourFormat(slot.time)}</span>
              <div className="flex items-center">
                <button
                  onClick={() => onDeleteSlot(index)}
                  className="p-1 mr-1 rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1">
                  <button
                    onClick={() => onMaxBookingsChange(index, Math.max(1, slot.maxBookings - 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-3 w-3 text-gray-500" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[20px] text-center">
                    {slot.maxBookings}
                  </span>
                  <button
                    onClick={() => onMaxBookingsChange(index, slot.maxBookings + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Max Bookings</p>
          </div>
        ))}
      </div>
    </div>
  );
}