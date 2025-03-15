import { Calendar as CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format, isWeekend, isSameDay, startOfToday, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from '../../i18n/useTranslation';

interface MRAppointmentCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const TIMEZONE = 'Asia/Kolkata';

export function MRAppointmentCalendar({ selectedDate, onDateChange }: MRAppointmentCalendarProps) {
  const { t } = useTranslation();
  
  const isDateDisabled = (date: Date) => {
    const today = startOfToday();
    return isWeekend(date) || isBefore(date, today);
  };

  const formatSelectedDate = (date: Date) => {
    const istDate = utcToZonedTime(date, TIMEZONE);
    const dayName = t.mrAppointment.form.days[format(istDate, 'EEEE').toLowerCase() as keyof typeof t.mrAppointment.form.days];
    const monthName = t.mrAppointment.form.months[format(istDate, 'MMMM').toLowerCase() as keyof typeof t.mrAppointment.form.months];
    const day = format(istDate, 'd');
    const year = format(istDate, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t.mrAppointment.form.appointmentDate} *
      </label>
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className={`p-2 rounded-lg transition-colors ${
            selectedDate 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-50 text-blue-600'
          }`}>
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              selectedDate
                ? 'text-blue-600'
                : 'text-gray-900'
            }`}>
              {selectedDate
                ? formatSelectedDate(selectedDate)
                : t.mrAppointment.form.selectDate}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.mrAppointment.form.availableWeekdays}
            </p>
          </div>
        </div>
        
        <div className="w-full">
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            minDate={startOfToday()}
            filterDate={(date) => !isDateDisabled(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText={t.mrAppointment.form.selectDate}
            required
            inline
            calendarClassName="!bg-transparent !border-0 !shadow-none w-full"
            dayClassName={date => {
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isDisabled = isDateDisabled(date);
              const isToday = isSameDay(date, new Date());
              
              if (isDisabled) {
                return "!text-gray-300 hover:!bg-transparent cursor-not-allowed opacity-50";
              }
              if (isSelected) {
                return "!bg-blue-600 !text-white hover:!bg-blue-700 ring-4 ring-blue-100";
              }
              if (isToday) {
                return "!bg-blue-50/50 !text-blue-600 font-medium hover:!bg-blue-100";
              }
              return "!text-gray-700 hover:!bg-blue-50 hover:!text-blue-600 transition-all duration-200";
            }}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled
            }) => {
              const monthName = t.mrAppointment.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.mrAppointment.form.months];
              const year = format(date, 'yyyy');
              
              return (
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {`${monthName} ${year}`}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      className={`p-2 rounded-lg transition-colors ${
                        prevMonthButtonDisabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      ←
                    </button>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      className={`p-2 rounded-lg transition-colors ${
                        nextMonthButtonDisabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      →
                    </button>
                  </div>
                </div>
              );
            }}
          />
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            {t.mrAppointment.form.availableDates}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            {t.mrAppointment.form.unavailableDates}
          </div>
        </div>
      </div>
    </div>
  );
}