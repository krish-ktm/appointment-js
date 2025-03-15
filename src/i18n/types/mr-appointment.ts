export interface MRAppointmentTranslations {
  title: string;
  subtitle: string;
  success: string;
  form: {
    mrName: string;
    companyName: string;
    divisionName: string;
    contactNo: string;
    appointmentDate: string;
    submit: string;
    submitting: string;
    dateRequired: string;
    invalidPhone: string;
    maxAppointments: string;
    weekendsNotAvailable: string;
    selectDate: string;
    availableWeekdays: string;
    availableDates: string;
    unavailableDates: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    appointmentDate: string;
    mrDetails: string;
    mrName: string;
    companyName: string;
    divisionName: string;
    contactNo: string;
    bookingId: string;
    notes: {
      title: string;
      arrival: string;
      id: string;
      mask: string;
    };
    scheduleAnother: string;
    done: string;
  };
}