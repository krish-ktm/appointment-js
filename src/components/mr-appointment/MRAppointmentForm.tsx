import { Building2, Users, Phone, Briefcase } from 'lucide-react';
import { MRForm } from './types';

interface MRAppointmentFormProps {
  form: MRForm;
  onChange: (form: MRForm) => void;
}

export function MRAppointmentForm({ form, onChange }: MRAppointmentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          MR Name *
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
            placeholder="Enter MR name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
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
            placeholder="Enter company name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Division Name *
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
            placeholder="Enter division name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number *
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
            placeholder="Enter 10-digit contact number"
          />
        </div>
      </div>
    </div>
  );
}