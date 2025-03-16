import { NavigationTranslations } from '../types/navigation';
import { businessInfo } from '../../config/business';

export const navigationTranslations: Record<string, NavigationTranslations> = {
  en: {
    home: "Home",
    about: `About ${businessInfo.doctor.name}`,
    services: "Our Services",
    mrAppointment: "MR Appointment"
  },
  gu: {
    home: "હોમ",
    about: "ડૉ. જેમિશ એ. પટેલ વિશે",
    services: "અમારી સેવાઓ",
    mrAppointment: "એમઆર એપોઈન્ટમેન્ટ"
  }
};