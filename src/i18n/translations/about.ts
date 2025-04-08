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
    doctorQualification: "MBBS, MD (Skin-VD)",
    doctorSpecialization: businessInfo.doctor.specialization,
    doctorRegistration: "Reg. No. G-16930",
    
    expertise: {
      title: "Areas of Expertise",
      items: [
        "CO2 Laser Treatment",
        "Vitiligo Surgery",
        "Medifacial",
        "Diode Hair Removal Therapy",
        "Medical Dermatology",
        "Cosmetic Dermatology"
      ]
    },
    
    education: {
      title: "Education & Training",
      items: [
        {
          degree: "MD in Dermatology",
          institution: "M P SHAH Medical College, Jamnagar",
          year: "2008"
        },
        {
          degree: "MBBS",
          institution: "PDU Medical College, Rajkot",
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
          "Indian Medical Association (IMA)",
          "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
          "Association of Cutaneous Surgeons of India (ACSI)"
        ]
      },
      achievements: {
        title: "Achievements & Recognition",
        items: [
          {
            title: "Started Private Practice",
            description: "Started private practice in Mehsana",
            year: "2008"
          },
          {
            title: "First to Introduce CO2 Laser Treatment",
            description: "First time introduced CO2 laser treatment, vitiligo surgery and medifacial in Mehsana",
            year: "2008"
          },
          {
            title: "First to Introduce Diode Hair Removal Therapy",
            description: "First to introduce diode hair removal therapy in Mehsana",
            year: "2013"
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
    doctorQualification: "એમબીબીએસ, એમડી (સ્કિન-વીડી)",
    doctorSpecialization: getFormattedDoctorInfo('gu').specialization,
    doctorRegistration: "રજી. નં. જી-૧૬૯૩૦",
    
    expertise: {
      title: "નિપુણતાના ક્ષેત્રો",
      items: [
        "CO2 લેસર ટ્રીટમેન્ટ",
        "વિટિલિગો સર્જરી",
        "મેડિફેશિયલ",
        "ડાયોડ હેર રિમુવલ થેરાપી",
        "મેડિકલ ડર્મેટોલોજી",
        "કોસ્મેટિક ડર્મેટોલોજી"
      ]
    },
    
    education: {
      title: "શિક્ષણ અને તાલીમ",
      items: [
        {
          degree: "એમડી ઇન ડર્મેટોલોજી",
          institution: "એમ પી શાહ મેડિકલ કોલેજ, જામનગર",
          year: "૨૦૦૮"
        },
        {
          degree: "એમબીબીએસ",
          institution: "પીડીયુ મેડિકલ કોલેજ, રાજકોટ",
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
          "ઈન્ડિયન મેડિકલ એસોસિએશન (IMA)",
          "ઈન્ડિયન એસોસિએશન ઓફ ડર્મેટોલોજિસ્ટ્સ, વેનેરોલોજિસ્ટ્સ એન્ડ લેપ્રોલોજિસ્ટ્સ (IADVL)",
          "એસોસિએશન ઓફ ક્યુટેનિયસ સર્જન્સ ઓફ ઈન્ડિયા (ACSI)"
        ]
      },
      achievements: {
        title: "સિદ્ધિઓ અને માન્યતા",
        items: [
          {
            title: "ખાનગી પ્રેક્ટિસ શરૂ કરી",
            description: "મહેસાણામાં ખાનગી પ્રેક્ટિસ શરૂ કરી",
            year: "૨૦૦૮"
          },
          {
            title: "CO2 લેસર ટ્રીટમેન્ટ શરૂ કર્યું",
            description: "મહેસાણામાં પ્રથમ વખત CO2 લેસર ટ્રીટમેન્ટ, વિટિલિગો સર્જરી અને મેડિફેશિયલ શરૂ કર્યું",
            year: "૨૦૦૮"
          },
          {
            title: "ડાયોડ હેર રિમુવલ થેરાપી શરૂ કરી",
            description: "મહેસાણામાં ડાયોડ હેર રિમુવલ થેરાપી શરૂ કરનાર પ્રથમ",
            year: "૨૦૧૩"
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