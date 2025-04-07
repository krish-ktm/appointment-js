export interface AboutTranslations {
  title: string;
  subtitle: string;
  experience: string;
  qualification: string;
  yearsExperience: string;
  specialization: string;
  
  // New doctor profile section
  doctorName: string;
  doctorQualification: string;
  doctorSpecialization: string;
  
  // Expanded expertise section
  expertise: {
    title: string;
    items: string[];
  };
  
  // Education section
  education: {
    title: string;
    items: {
      degree: string;
      institution: string;
      year: string;
    }[];
  };
  
  clinicName: string;
  clinicDescription: string;
  location: string;
  address: string;
  contact: string;
  phone: string;
  openingHours: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  amenities: string;
  amenitiesList: string[];
  
  // Updated CTA section
  cta: {
    title: string;
    description: string;
    bookButton: string;
    contactButton: string;
  };
}