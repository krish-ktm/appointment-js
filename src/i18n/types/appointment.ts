export interface AppointmentTranslations {
  title: string;
  form: {
    subtitle: string;
    name: string;
    phone: string;
    age: string;
    city: string;
    date: string;
    timeSlot: string;
    submit: string;
    booking: string;
    selectTime: string;
    bookingFull: string;
    noSlots: string;
    noSlotsAvailable: string;
    selectDate: string;
    success: string;
    successNote: string;
    personalInfo: string;
    showingSlots: string;
    slotsLeft: string;
    days: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
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