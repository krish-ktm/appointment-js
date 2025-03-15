import { LanguageContent } from './types';

export const translations: Record<string, LanguageContent> = {
  en: {
    common: {
      bookAppointment: "Book Appointment",
      close: "Close",
      loading: "Loading...",
      success: "Success",
      error: "Error",
      required: "Required",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      yes: "Yes",
      no: "No",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      done: "Done"
    },
    navigation: {
      home: "Home",
      about: "About",
      services: "Services",
      mrAppointment: "MR Appointment"
    },
    home: {
      hero: {
        title: "Expert Dermatological Care for Your Skin Health",
        subtitle: "Comprehensive skin treatments with advanced technology and personalized care plans",
        doctorTitle: "Dr. Jemish A. Patel - MBBS, MD",
        experience: "14+ Years Experience",
        advancedTreatments: "Advanced Treatments",
        expertCare: "Expert Care",
        mrAppointmentCta: "Medical Representative Appointment",
        mrAppointmentNote: "For pharmaceutical and medical device representatives"
      },
      stats: {
        yearsExperience: "Years Experience",
        happyPatients: "Happy Patients",
        treatments: "Treatments",
        successRate: "Success Rate",
        experienceDesc: "Trusted expertise in dermatology",
        patientsDesc: "Satisfied with our care",
        treatmentsDesc: "Advanced procedures available",
        successDesc: "Proven treatment outcomes"
      }
    },
    appointment: {
      title: "Book Your Appointment",
      form: {
        name: "Full Name",
        phone: "Phone Number",
        age: "Age",
        city: "City",
        date: "Appointment Date",
        timeSlot: "Time Slot",
        submit: "Book Appointment",
        selectTime: "Select Time",
        bookingFull: "Booking Full",
        noSlots: "No Time Slots Available",
        selectDate: "Please select a date",
        success: "Appointment booked successfully!"
      },
      confirmation: {
        title: "Appointment Confirmation",
        subtitle: "Your appointment has been confirmed",
        bookingId: "Booking ID",
        date: "Date",
        time: "Time",
        patientDetails: "Patient Details",
        scheduleAnother: "Schedule Another",
        notes: {
          title: "Important Notes",
          arrival: "Please arrive 10 minutes before your appointment time",
          records: "Bring any relevant medical records or previous prescriptions",
          mask: "Wear a mask during your visit"
        }
      }
    },
    mrAppointment: {
      title: "MR Appointment Booking",
      subtitle: "Schedule your meeting with the doctor",
      form: {
        mrName: "MR Name",
        companyName: "Company Name",
        divisionName: "Division Name",
        contactNo: "Contact Number",
        appointmentDate: "Appointment Date",
        submit: "Book Appointment"
      }
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive dermatological care with advanced treatments",
      categories: {
        treatments: "Treatments",
        facial: "Facial Services",
        aesthetic: "Aesthetic Services",
        surgical: "Surgical Procedures",
        hair: "Hair Services",
        diagnostic: "Diagnostic Services"
      },
      cta: {
        title: "Ready to Get Started?",
        subtitle: "Experience our expert dermatological care today",
        button: "Book an Appointment"
      }
    }
  },
  gu: {
    // Gujarati translations will be added later
    common: {},
    navigation: {},
    home: {
      hero: {},
      stats: {}
    },
    appointment: {
      title: "",
      form: {},
      confirmation: {
        notes: {}
      }
    },
    mrAppointment: {
      form: {}
    },
    services: {
      categories: {}
    }
  }
};