import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { homeTranslations } from './home';
import { appointmentTranslations } from '../../components/appointment/i18n/translations/appointment';
import { servicesTranslations } from './services';
import { mrAppointmentTranslations } from './mr-appointment';
import { aboutTranslations } from './about';
import { footerTranslations } from './footer';
import { headerTranslations } from './header';
import { LanguageContent } from '../types';

export const translations: Record<string, LanguageContent> = {
  en: {
    common: commonTranslations.en,
    navigation: navigationTranslations.en,
    home: homeTranslations.en,
    appointment: appointmentTranslations.en,
    services: servicesTranslations.en,
    mrAppointment: mrAppointmentTranslations.en,
    about: aboutTranslations.en,
    footer: footerTranslations.en,
    header: headerTranslations.en
  },
  gu: {
    common: commonTranslations.gu,
    navigation: navigationTranslations.gu,
    home: homeTranslations.gu,
    appointment: appointmentTranslations.gu,
    services: servicesTranslations.gu,
    mrAppointment: mrAppointmentTranslations.gu,
    about: aboutTranslations.gu,
    footer: footerTranslations.gu,
    header: headerTranslations.gu
  }
};