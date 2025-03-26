import { Building2, Users, Phone, Briefcase } from 'lucide-react';
import { MRForm, TimeSlot } from './types';
import { MRTimeSlotSelector } from './TimeSlotSelector';

interface MRAppointmentFormTranslations {
  mrName: string;
  companyName: string;
  divisionName: string;
  contactNo: string;
  timeSlot: string;
  slotAvailable: string;
  noTimeSlots: string;
  selectAnotherDate: string;
  [key: string]: string | Record<string, string>;
}

interface MRAppointmentFormProps {
  form: MRForm;
  onChange: (form: MRForm) => void;
  timeSlots: TimeSlot[];
  t: MRAppointmentFormTranslations;
}

export function MRAppointmentForm({ form, onChange, timeSlots, t }: MRAppointmentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.mrName} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            required
            value={form.mr_name}
            onChange={(e) => onChange({ ...form, mr_name: e.target.value })}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder={t.mrName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.companyName} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            required
            value={form.company_name}
            onChange={(e) => onChange({ ...form, company_name: e.target.value })}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder={t.companyName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.divisionName} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            required
            value={form.division_name}
            onChange={(e) => onChange({ ...form, division_name: e.target.value })}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder={t.divisionName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.contactNo} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            value={form.contact_no}
            onChange={(e) => onChange({ ...form, contact_no: e.target.value })}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder={t.contactNo}
          />
        </div>
      </div>

      {form.appointment_date && (
        <MRTimeSlotSelector
          slots={timeSlots}
          selectedTime={form.appointment_time}
          onSelectTime={(time) => onChange({ ...form, appointment_time: time })}
          t={t}
        />
      )}
    </div>
  );
}