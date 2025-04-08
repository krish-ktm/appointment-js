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
    
    // Doctor profile section
    doctorName: businessInfo.doctor.name,
    doctorQualification: `${businessInfo.doctor.qualifications} - ${businessInfo.doctor.university}`,
    doctorSpecialization: businessInfo.doctor.specialization,
    
    // Expertise section
    expertise: {
      title: "Areas of Expertise",
      items: [
        "Advanced Skin Treatments",
        "Hair Restoration Therapies",
        "Laser Treatments",
        "Cosmetic Dermatology",
        "Surgical Dermatology",
        "Skin Cancer Screening"
      ]
    },
    
    // Education section
    education: {
      title: "Education & Training",
      items: [
        {
          degree: businessInfo.doctor.qualifications,
          institution: businessInfo.doctor.university,
          year: "2007-2010"
        },
        {
          degree: "MBBS",
          institution: "B.J. Medical College, Ahmedabad",
          year: "2000-2006"
        },
        {
          degree: "Fellowship in Cosmetic Dermatology",
          institution: "National Skin Institute",
          year: "2010-2011"
        }
      ]
    },
    
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
      "Gender-neutral restroom",
      "Modern equipment",
      "Comfortable waiting area",
      "Digital payment accepted",
      "Lift availability"
    ],
    cta: {
      title: "Ready to Transform Your Skin Health?",
      description: "Experience personalized dermatological care with cutting-edge treatments tailored to your needs.",
      bookButton: "Book an Appointment",
      contactButton: "Contact Us"
    }
  },
  gu: {
    title: getFormattedDoctorInfo('gu').name,
    subtitle: getFormattedDoctorInfo('gu').specialization,
    experience: `${getFormattedDoctorInfo('gu').experience} વર્ષની શ્રેષ્ઠતા`,
    qualification: `${getFormattedDoctorInfo('gu').qualifications} - ${getFormattedDoctorInfo('gu').university}`,
    yearsExperience: `હેલ્થકેરમાં ${getFormattedDoctorInfo('gu').experience} વર્ષ`,
    specialization: "ડર્મેટોલોજી અને કોસ્મેટિક સર્જરી",
    
    // Doctor profile section
    doctorName: getFormattedDoctorInfo('gu').name,
    doctorQualification: `${getFormattedDoctorInfo('gu').qualifications} - ${getFormattedDoctorInfo('gu').university}`,
    doctorSpecialization: getFormattedDoctorInfo('gu').specialization,
    
    // Expertise section
    expertise: {
      title: "નિપુણતાના ક્ષેત્રો",
      items: [
        "અદ્યતન ત્વચા ઉપચારો",
        "વાળ પુનઃસ્થાપન થેરેપી",
        "લેસર ઉપચારો",
        "કોસ્મેટિક ડર્મેટોલોજી",
        "સર્જિકલ ડર્મેટોલોજી",
        "ત્વચા કેન્સર સ્ક્રીનિંગ"
      ]
    },
    
    // Education section
    education: {
      title: "શિક્ષણ અને તાલીમ",
      items: [
        {
          degree: getFormattedDoctorInfo('gu').qualifications,
          institution: getFormattedDoctorInfo('gu').university,
          year: "૨૦૦૭-૨૦૧૦"
        },
        {
          degree: "એમબીબીએસ",
          institution: "બી.જે. મેડિકલ કોલેજ, અમદાવાદ",
          year: "૨૦૦૦-૨૦૦૬"
        },
        {
          degree: "કોસ્મેટિક ડર્મેટોલોજીમાં ફેલોશિપ",
          institution: "નેશનલ સ્કિન ઈન્સ્ટિટ્યુટ",
          year: "૨૦૧૦-૨૦૧૧"
        }
      ]
    },
    
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
      "જેન્ડર-ન્યૂટ્રલ રેસ્ટરૂમ",
      "આધુનિક ઉપકરણો",
      "આરામદાયક વેઇટિંગ એરિયા",
      "ડિજિટલ પેમેન્ટ સ્વીકાર્ય",
      "લિફ્ટ ઉપલબ્ધતા"
    ],
    cta: {
      title: "તમારી ત્વચાના સ્વાસ્થ્યને બદલવા માટે તૈયાર છો?",
      description: "તમારી જરૂરિયાતો અનુસાર કટ-એજ ટ્રીટમેન્ટ્સ સાથે વ્યક્તિગત ડર્મેટોલોજિકલ કેર અનુભવો.",
      bookButton: "એપોઈન્ટમેન્ટ બુક કરો",
      contactButton: "અમારો સંપર્ક કરો"
    }
  }
};