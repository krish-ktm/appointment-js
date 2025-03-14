export interface AppointmentTranslations {
  title: string;
  form: {
    name: string;
    phone: string;
    age: string;
    city: string;
    date: string;
    timeSlot: string;
    submit: string;
    selectTime: string;
    bookingFull: string;
    noSlots: string;
    selectDate: string;
    success: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    bookingId: string;
    date: string;
    time: string;
    patientDetails: string;
    scheduleAnother: string;
    notes: {
      title: string;
      arrival: string;
      records: string;
      mask: string;
    };
  };
}