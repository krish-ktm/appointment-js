import { CommonTranslations } from './common';
import { NavigationTranslations } from './navigation';
import { HomeTranslations } from './home';
import { AppointmentTranslations } from './appointment';
import { ServicesTranslations } from './services';
import { MRAppointmentTranslations } from './mr-appointment';

export interface LanguageContent {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  home: HomeTranslations;
  appointment: AppointmentTranslations;
  services: ServicesTranslations;
  mrAppointment: MRAppointmentTranslations;
}

export * from './common';
export * from './navigation';
export * from './home';
export * from './appointment';
export * from './services';
export * from './mr-appointment';