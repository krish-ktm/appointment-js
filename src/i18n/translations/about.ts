import { AboutTranslations } from '../types/about';
import { businessInfo, getFormattedDoctorInfo } from '../../config/business';

export const aboutTranslations: Record<string, AboutTranslations> = {
  en: {
    title: "About Our Clinic",
    subtitle: "Dedicated to providing exceptional dermatological care with advanced treatments and personalized attention",
    experience: "14+ Years Experience",
    qualification: "MBBS, MD (Dermatology)",
    yearsExperience: "14+ Years Experience",
    specialization: "Dermatologist & Cosmetic Surgeon",
    
    doctorName: businessInfo.doctor.name,
    doctorQualification: businessInfo.doctor.qualifications,
    doctorSpecialization: businessInfo.doctor.specialization,
    
    expertise: {
      title: "Areas of Expertise",
      items: [
        "Medical Dermatology",
        "Cosmetic Dermatology",
        "Laser Treatments",
        "Hair Restoration",
        "Skin Cancer Screening",
        "Advanced Skincare"
      ]
    },
    
    education: {
      title: "Education & Training",
      items: [
        {
          degree: "MD in Dermatology",
          institution: "Saurashtra University",
          year: "2008"
        },
        {
          degree: "MBBS",
          institution: "B.J. Medical College",
          year: "2004"
        },
        {
          degree: "Advanced Training in Cosmetic Dermatology",
          institution: "National Skin Institute",
          year: "2010"
        }
      ]
    },

    professional: {
      title: "Professional Memberships & Achievements",
      subtitle: "Recognition and affiliations in the field of dermatology",
      memberships: {
        title: "Professional Memberships",
        items: [
          "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
          "Association of Cutaneous Surgeons of India (ACSI)",
          "Indian Medical Association (IMA)",
          "Cosmetic Dermatology Society of India (CDSI)",
          "International Society of Dermatology (ISD)"
        ]
      },
      achievements: {
        title: "Achievements & Recognition",
        items: [
          {
            title: "Best Dermatologist Award",
            description: "Recognized for excellence in dermatological care",
            year: "2022"
          },
          {
            title: "Research Publication",
            description: "Published research on advanced laser treatments in the Indian Journal of Dermatology",
            year: "2020"
          },
          {
            title: "Clinical Excellence Award",
            description: "Awarded for outstanding patient care and treatment outcomes",
            year: "2019"
          }
        ]
      }
    },

    clinicName: "Shubham Skin & Laser Clinic",
    clinicDescription: "A state-of-the-art dermatology clinic equipped with the latest technology and staffed by experienced professionals",
    amenities: "Clinic Amenities",
    amenitiesList: [
      "Advanced Laser Equipment",
      "Sterile Treatment Rooms",
      "Comfortable Waiting Area",
      "Modern Consultation Rooms",
      "Digital Patient Records",
      "Convenient Parking"
    ],

    cta: {
      title: "Ready to Transform Your Skin?",
      description: "Schedule your consultation today and take the first step towards healthier, more beautiful skin.",
      bookButton: "Book Appointment",
      contactButton: "Contact Us"
    }
  },
  gu: {
    title: "અમારી ક્લિનિક વિશે",
    subtitle: "અદ્યતન સારવાર અને વ્યક્તિગત ધ્યાન સાથે અસાધારણ ડર્મેટોલોજિકલ સંભાળ પ્રદાન કરવા માટે સમર્પિત",
    experience: "૧૪+ વર્ષનો અનુભવ",
    qualification: "એમબીબીએસ, એમડી (ડર્મેટોલોજી)",
    yearsExperience: "૧૪+ વર્ષનો અનુભવ",
    specialization: "ડર્મેટોલોજિસ્ટ અને કોસ્મેટિક સર્જન",
    
    doctorName: getFormattedDoctorInfo('gu').name,
    doctorQualification: getFormattedDoctorInfo('gu').qualifications,
    doctorSpecialization: getFormattedDoctorInfo('gu').specialization,
    
    expertise: {
      title: "નિપુણતાના ક્ષેત્રો",
      items: [
        "મેડિકલ ડર્મેટોલોજી",
        "કોસ્મેટિક ડર્મેટોલોજી",
        "લેસર ટ્રીટમેન્ટ્સ",
        "વાળની સારવાર",
        "ત્વચાના કેન્સરની તપાસ",
        "અદ્યતન સ્કિનકેર"
      ]
    },
    
    education: {
      title: "શિક્ષણ અને તાલીમ",
      items: [
        {
          degree: "એમડી ઇન ડર્મેટોલોજી",
          institution: "સૌરાષ્ટ્ર યુનિવર્સિટી",
          year: "૨૦૦૮"
        },
        {
          degree: "એમબીબીએસ",
          institution: "બી.જે. મેડિકલ કોલેજ",
          year: "૨૦૦૪"
        },
        {
          degree: "કોસ્મેટિક ડર્મેટોલોજીમાં એડવાન્સ્ડ ટ્રેનિંગ",
          institution: "નેશનલ સ્કિન ઇન્સ્ટિટ્યૂટ",
          year: "૨૦૧૦"
        }
      ]
    },

    professional: {
      title: "વ્યાવસાયિક સભ્યપદ અને સિદ્ધિઓ",
      subtitle: "ડર્મેટોલોજીના ક્ષેત્રમાં માન્યતા અને જોડાણો",
      memberships: {
        title: "વ્યાવસાયિક સભ્યપદ",
        items: [
          "ઈન્ડિયન એસોસિએશન ઓફ ડર્મેટોલોજિસ્ટ્સ, વેનેરોલોજિસ્ટ્સ એન્ડ લેપ્રોલોજિસ્ટ્સ (IADVL)",
          "એસોસિએશન ઓફ ક્યુટેનિયસ સર્જન્સ ઓફ ઈન્ડિયા (ACSI)",
          "ઈન્ડિયન મેડિકલ એસોસિએશન (IMA)",
          "કોસ્મેટિક ડર્મેટોલોજી સોસાયટી ઓફ ઈન્ડિયા (CDSI)",
          "ઈન્ટરનેશનલ સોસાયટી ઓફ ડર્મેટોલોજી (ISD)"
        ]
      },
      achievements: {
        title: "સિદ્ધિઓ અને માન્યતા",
        items: [
          {
            title: "શ્રેષ્ઠ ડર્મેટોલોજિસ્ટ એવોર્ડ",
            description: "ડર્મેટોલોજિકલ સંભાળમાં શ્રેષ્ઠતા માટે માન્યતા",
            year: "૨૦૨૨"
          },
          {
            title: "રિસર્ચ પબ્લિકેશન",
            description: "ઈન્ડિયન જર્નલ ઓફ ડર્મેટોલોજીમાં એડવાન્સ્ડ લેસર ટ્રીટમેન્ટ્સ પર સંશોધન પ્રકાશિત",
            year: "૨૦૨૦"
          },
          {
            title: "ક્લિનિકલ એક્સેલન્સ એવોર્ડ",
            description: "ઉત્કૃષ્ટ દર્દી સંભાળ અને સારવાર પરિણામો માટે સન્માનિત",
            year: "૨૦૧૯"
          }
        ]
      }
    },

    clinicName: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક",
    clinicDescription: "નવીનતમ ટેકનોલોજી અને અનુભવી વ્યાવસાયિકો સાથે સજ્જ અત્યાધુનિક ડર્મેટોલોજી ક્લિનિક",
    amenities: "ક્લિનિક સુવિધાઓ",
    amenitiesList: [
      "અદ્યતન લેસર ઉપકરણો",
      "જંતુમુક્ત ટ્રીટમેન્ટ રૂમ્સ",
      "આરામદાયક વેઇટિંગ એરિયા",
      "આધુનિક કન્સલ્ટેશન રૂમ્સ",
      "ડિજિટલ પેશન્ટ રેકોર્ડ્સ",
      "સુવિધાજનક પાર્કિંગ"
    ],

    cta: {
      title: "તમારી ત્વચાનું પરિવર્તન કરવા તૈયાર છો?",
      description: "આજે જ તમારી કન્સલ્ટેશન શેડ્યૂલ કરો અને વધુ સ્વસ્થ, વધુ સુંદર ત્વચા તરફ પ્રથમ પગલું ભરો.",
      bookButton: "એપોઇન્ટમેન્ટ બુક કરો",
      contactButton: "અમારો સંપર્ક કરો"
    }
  }
};