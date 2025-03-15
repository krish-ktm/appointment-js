import { MRAppointmentTranslations } from '../types/mr-appointment';

export const mrAppointmentTranslations: Record<string, MRAppointmentTranslations> = {
  en: {
    title: "MR Appointment Booking",
    subtitle: "Schedule your meeting with the doctor",
    success: "Appointment booked successfully",
    form: {
      mrName: "MR Name",
      companyName: "Company Name",
      divisionName: "Division Name",
      contactNo: "Contact Number",
      appointmentDate: "Appointment Date",
      submit: "Book Appointment",
      submitting: "Booking...",
      dateRequired: "Please select an appointment date",
      invalidPhone: "Please enter a valid 10-digit contact number",
      maxAppointments: "Maximum appointments reached for this date",
      weekendsNotAvailable: "Appointments not available on weekends",
      selectDate: "Select appointment date",
      availableWeekdays: "Appointments available on weekdays only",
      availableDates: "Available dates",
      unavailableDates: "Weekends & past dates (not available)"
    },
    confirmation: {
      title: "Appointment Confirmed",
      subtitle: "Your MR appointment has been scheduled successfully",
      appointmentDate: "Appointment Date",
      mrDetails: "MR Details",
      mrName: "MR Name",
      companyName: "Company Name",
      divisionName: "Division Name",
      contactNo: "Contact Number",
      bookingId: "Booking ID",
      notes: {
        title: "Important Notes",
        arrival: "Please arrive 10 minutes before your appointment time",
        id: "Bring your company ID card and visiting card",
        mask: "Wear a mask during your visit"
      },
      scheduleAnother: "Schedule Another",
      done: "Done"
    }
  },
  gu: {
    title: "એમઆર એપોઈન્ટમેન્ટ બુકિંગ",
    subtitle: "ડૉક્ટર સાથે તમારી મીટિંગ શેડ્યૂલ કરો",
    success: "એપોઈન્ટમેન્ટ સફળતાપૂર્વક બુક થઈ ગઈ છે",
    form: {
      mrName: "એમઆર નામ",
      companyName: "કંપનીનું નામ",
      divisionName: "ડિવિઝનનું નામ",
      contactNo: "સંપર્ક નંબર",
      appointmentDate: "એપોઈન્ટમેન્ટની તારીખ",
      submit: "એપોઈન્ટમેન્ટ બુક કરો",
      submitting: "બુક થઈ રહ્યું છે...",
      dateRequired: "કૃપા કરી એપોઈન્ટમેન્ટની તારીખ પસંદ કરો",
      invalidPhone: "કૃપા કરી માન્ય 10-અંકનો સંપર્ક નંબર દાખલ કરો",
      maxAppointments: "આ તારીખ માટે મહત્તમ એપોઈન્ટમેન્ટ્સ પૂર્ણ થઈ ગઈ છે",
      weekendsNotAvailable: "સપ્તાહના અંતે એપોઈન્ટમેન્ટ ઉપલબ્ધ નથી",
      selectDate: "એપોઈન્ટમેન્ટની તારીખ પસંદ કરો",
      availableWeekdays: "એપોઈન્ટમેન્ટ માત્ર કામકાજના દિવસોમાં ઉપલબ્ધ",
      availableDates: "ઉપલબ્ધ તારીખો",
      unavailableDates: "સપ્તાહના અંત અને ભૂતકાળની તારીખો (ઉપલબ્ધ નથી)"
    },
    confirmation: {
      title: "એપોઈન્ટમેન્ટની પુષ્ટિ થઈ",
      subtitle: "તમારી એમઆર એપોઈન્ટમેન્ટ સફળતાપૂર્વક શેડ્યૂલ થઈ ગઈ છે",
      appointmentDate: "એપોઈન્ટમેન્ટની તારીખ",
      mrDetails: "એમઆર વિગતો",
      mrName: "એમઆર નામ",
      companyName: "કંપનીનું નામ",
      divisionName: "ડિવિઝનનું નામ",
      contactNo: "સંપર્ક નંબર",
      bookingId: "બુકિંગ ID",
      notes: {
        title: "મહત્વપૂર્ણ નોંધ",
        arrival: "કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો",
        id: "તમારું કંપની ID કાર્ડ અને વિઝિટિંગ કાર્ડ લાવો",
        mask: "તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"
      },
      scheduleAnother: "બીજી એપોઈન્ટમેન્ટ",
      done: "પૂર્ણ"
    }
  }
};