import { AppointmentTranslations } from '../types/appointment';

export const appointmentTranslations: Record<string, AppointmentTranslations> = {
  en: {
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
  gu: {
    title: "તમારી એપોઈન્ટમેન્ટ બુક કરો",
    form: {
      name: "પૂરું નામ",
      phone: "ફોન નંબર",
      age: "ઉંમર",
      city: "શહેર",
      date: "એપોઈન્ટમેન્ટની તારીખ",
      timeSlot: "સમય",
      submit: "એપોઈન્ટમેન્ટ બુક કરો",
      selectTime: "સમય પસંદ કરો",
      bookingFull: "બુકિંગ ભરાઈ ગયું છે",
      noSlots: "કોઈ સમય ઉપલબ્ધ નથી",
      selectDate: "કૃપા કરી તારીખ પસંદ કરો",
      success: "એપોઈન્ટમેન્ટ સફળતાપૂર્વક બુક થઈ ગઈ છે!"
    },
    confirmation: {
      title: "એપોઈન્ટમેન્ટ પુષ્ટિ",
      subtitle: "તમારી એપોઈન્ટમેન્ટની પુષ્ટિ થઈ ગઈ છે",
      bookingId: "બુકિંગ ID",
      date: "તારીખ",
      time: "સમય",
      patientDetails: "દર્દીની વિગતો",
      scheduleAnother: "બીજી એપોઈન્ટમેન્ટ",
      notes: {
        title: "મહત્વપૂર્ણ નોંધ",
        arrival: "કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો",
        records: "કોઈપણ સંબંધિત મેડિકલ રેકોર્ડ્સ અથવા અગાઉની પ્રિસ્ક્રિપ્શન લાવો",
        mask: "તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"
      }
    }
  }
};