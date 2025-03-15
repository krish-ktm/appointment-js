import { CommonTranslations } from './common';
import { NavigationTranslations } from './navigation';
import { HomeTranslations } from './home';
import { AppointmentTranslations } from './appointment';
import { ServicesTranslations } from './services';
import { MRAppointmentTranslations } from './mr-appointment';
import { AboutTranslations } from './about';
import { FooterTranslations } from './footer';

export interface LanguageContent {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  home: HomeTranslations;
  appointment: AppointmentTranslations;
  services: ServicesTranslations;
  mrAppointment: MRAppointmentTranslations;
  about: AboutTranslations;
  footer: FooterTranslations;
}

export * from './common';
export * from './navigation';
export * from './home';
export * from './appointment';
export * from './services';
export * from './mr-appointment';
export * from './about';
export * from './footer';