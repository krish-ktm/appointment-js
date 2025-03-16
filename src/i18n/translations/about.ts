import { AboutTranslations } from '../types/about';
import { businessInfo, getFormattedDoctorInfo, getFormattedAddress, getFormattedPhone, getFormattedHours } from '../../config/business';

export const aboutTranslations: Record<string, AboutTranslations> = {
  en: {
    title: businessInfo.doctor.name,
    subtitle: businessInfo.doctor.specialization,
    experience: `${businessInfo.doctor.experience} Years of Excellence`,
    qualification: `${businessInfo.doctor.qualifications} - ${businessInfo.doctor.university}`,
    yearsExperience: `${businessInfo.doctor.experience} Years in Healthcare`,
    specialization: "Dermatology & Cosmetic Surgery",
    expertise: "Skin, Hair & Laser Treatments",
    clinicName: businessInfo.name,
    clinicDescription: "State-of-the-art dermatology and cosmetic surgery center",
    location: "Location",
    address: businessInfo.contact.address,
    contact: "Contact",
    phone: businessInfo.contact.phone,
    openingHours: "Opening Hours",
    weekdayHours: getFormattedHours('en').weekday,
    saturdayHours: getFormattedHours('en').saturday,
    sundayHours: getFormattedHours('en').sunday,
    amenities: "Amenities & Accessibility",
    amenitiesList: [
      "Wheelchair accessible entrance",
      "Wheelchair accessible restroom",
      "Gender-neutral restroom",
      "Modern equipment",
      "Comfortable waiting area",
      "Digital payment accepted"
    ],
    cta: {
      title: "Ready to Transform Your Skin Health?",
      description: "Experience personalized dermatological care with cutting-edge treatments tailored to your needs.",
      button: "Book an Appointment"
    }
  },
  gu: {
    title: getFormattedDoctorInfo('gu').name,
    subtitle: getFormattedDoctorInfo('gu').specialization,
    experience: `${getFormattedDoctorInfo('gu').experience} વર્ષની શ્રેષ્ઠતા`,
    qualification: `${getFormattedDoctorInfo('gu').qualifications} - ${getFormattedDoctorInfo('gu').university}`,
    yearsExperience: `હેલ્થકેરમાં ${getFormattedDoctorInfo('gu').experience} વર્ષ`,
    specialization: "ડર્મેટોલોજી અને કોસ્મેટિક સર્જરી",
    expertise: "ત્વચા, વાળ અને લેસર ટ્રીટમેન્ટ્સ",
    clinicName: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક",
    clinicDescription: "અત્યાધુનિક ડર્મેટોલોજી અને કોસ્મેટિક સર્જરી સેન્ટર",
    location: "સ્થળ",
    address: getFormattedAddress('gu'),
    contact: "સંપર્ક",
    phone: getFormattedPhone('gu'),
    openingHours: "ખુલવાનો સમય",
    weekdayHours: getFormattedHours('gu').weekday,
    saturdayHours: getFormattedHours('gu').saturday,
    sundayHours: getFormattedHours('gu').sunday,
    amenities: "સુવિધાઓ અને પ્રવેશક્ષમતા",
    amenitiesList: [
      "વ્હીલચેર પ્રવેશક્ષમ પ્રવેશદ્વાર",
      "વ્હીલચેર પ્રવેશક્ષમ રેસ્ટરૂમ",
      "જેન્ડર-ન્યૂટ્રલ રેસ્ટરૂમ",
      "આધુનિક ઉપકરણો",
      "આરામદાયક વેઇટિંગ એરિયા",
      "ડિજિટલ પેમેન્ટ સ્વીકાર્ય"
    ],
    cta: {
      title: "તમારી ત્વચાના સ્વાસ્થ્યને બદલવા માટે તૈયાર છો?",
      description: "તમારી જરૂરિયાતો અનુસાર કટ-એજ ટ્રીટમેન્ટ્સ સાથે વ્યક્તિગત ડર્મેટોલોજિકલ કેર અનુભવો.",
      button: "એપોઈન્ટમેન્ટ બુક કરો"
    }
  }
};