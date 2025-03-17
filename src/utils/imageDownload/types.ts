export interface AppointmentDetails {
  id: string;
  [key: string]: any;
}

export interface PatientDetails {
  name: string;
  phone: string;
  age: number;
  city: string;
}

export interface MRDetails {
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
}

export interface AppointmentTranslations {
  confirmation: {
    title: string;
    subtitle: string;
    notes: {
      title: string;
      arrival: string;
      records?: string;
      mask: string;
      id?: string;
    };
  };
  form: {
    name: string;
    phone: string;
    age: string;
    city: string;
    mrName?: string;
    companyName?: string;
    divisionName?: string;
    contactNo?: string;
  };
}