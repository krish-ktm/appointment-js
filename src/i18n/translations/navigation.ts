import { NavigationTranslations } from '../types/navigation';
import { businessInfo } from '../../config/business';

export const navigationTranslations: Record<string, NavigationTranslations> = {
  en: {
    home: "Home",
    about: `About ${businessInfo.doctor.name}`,
    services: "Our Services",
    gallery: "Gallery",
    appointment: "Book Appointment",
    mrAppointment: "MR Appointment"
  },
  gu: {
    home: "હોમ",
    about: "ડૉ. જેમિશ એ. પટેલ વિશે",
    services: "અમારી સેવાઓ",
    gallery: "ગેલેરી",
    appointment: "એપોઈન્ટમેન્ટ બુક કરો",
    mrAppointment: "એમઆર એપોઈન્ટમેન્ટ"
  }
};