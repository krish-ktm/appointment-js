import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { homeTranslations } from './home';
import { appointmentTranslations } from './appointment';
import { servicesTranslations } from './services';
import { mrAppointmentTranslations } from './mr-appointment';
import { aboutTranslations } from './about';
import { LanguageContent } from '../types';

export const translations: Record<string, LanguageContent> = {
  en: {
    common: commonTranslations.en,
    navigation: navigationTranslations.en,
    home: homeTranslations.en,
    appointment: appointmentTranslations.en,
    services: servicesTranslations.en,
    mrAppointment: mrAppointmentTranslations.en,
    about: aboutTranslations.en
  },
  gu: {
    common: commonTranslations.gu,
    navigation: navigationTranslations.gu,
    home: homeTranslations.gu,
    appointment: appointmentTranslations.gu,
    services: servicesTranslations.gu,
    mrAppointment: mrAppointmentTranslations.gu,
    about: aboutTranslations.gu
  }
};