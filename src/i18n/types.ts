export interface LanguageContent {
  common: {
    bookAppointment: string;
    close: string;
    loading: string;
    success: string;
    error: string;
    required: string;
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    yes: string;
    no: string;
    confirm: string;
    back: string;
    next: string;
    done: string;
  };
  navigation: {
    home: string;
    about: string;
    services: string;
    mrAppointment: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      doctorTitle: string;
      experience: string;
      advancedTreatments: string;
      expertCare: string;
      mrAppointmentCta: string;
      mrAppointmentNote: string;
    };
    stats: {
      yearsExperience: string;
      happyPatients: string;
      treatments: string;
      successRate: string;
      experienceDesc: string;
      patientsDesc: string;
      treatmentsDesc: string;
      successDesc: string;
    };
  };
  appointment: {
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
  };
  mrAppointment: {
    title: string;
    subtitle: string;
    form: {
      mrName: string;
      companyName: string;
      divisionName: string;
      contactNo: string;
      appointmentDate: string;
      submit: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    categories: {
      treatments: string;
      facial: string;
      aesthetic: string;
      surgical: string;
      hair: string;
      diagnostic: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
}