import { HomeTranslations } from '../types/home';
import { businessInfo, getFormattedDoctorInfo } from '../../config/business';

export const homeTranslations: Record<string, HomeTranslations> = {
  en: {
    hero: {
      title: "Expert Dermatological Care for Your Skin Health",
      subtitle: "Comprehensive skin treatments with advanced technology and personalized care plans",
      doctorTitle: `${businessInfo.doctor.name} - ${businessInfo.doctor.qualifications}`,
      experience: `${businessInfo.doctor.experience}+ Years Experience`,
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
  gu: {
    hero: {
      title: "તમારા ત્વચાની સ્વાસ્થ્ય માટે નિષ્ણાત ડર્મેટોલોજિકલ કેર",
      subtitle: "અદ્યતન ટેકનોલોજી અને વ્યક્તિગત કેર પ્લાન સાથે સંપૂર્ણ ત્વચાની સારવાર",
      doctorTitle: `${getFormattedDoctorInfo('gu').name} - ${getFormattedDoctorInfo('gu').qualifications}`,
      experience: `${getFormattedDoctorInfo('gu').experience}+ વર્ષનો અનુભવ`,
      advancedTreatments: "અદ્યતન સારવાર",
      expertCare: "નિષ્ણાત કેર",
      mrAppointmentCta: "મેડિકલ રિપ્રેઝેન્ટેટિવ એપોઈન્ટમેન્ટ",
      mrAppointmentNote: "ફાર્માસ્યુટિકલ અને મેડિકલ ડિવાઇસ પ્રતિનિધિઓ માટે"
    },
    stats: {
      yearsExperience: "વર્ષનો અનુભવ",
      experienceDesc: "ડર્મેટોલોજીમાં વિશ્વસનીય નિપુણતા",
      happyPatients: "ખુશ દર્દીઓ",
      patientsDesc: "અમારી સંભાળથી સંતુષ્ટ",
      treatments: "સારવાર",
      treatmentsDesc: "અદ્યતન પ્રક્રિયાઓ ઉપલબ્ધ",
      successRate: "સફળતા દર",
      successDesc: "સિદ્ધ સારવાર પરિણામો"
    }
  }
};