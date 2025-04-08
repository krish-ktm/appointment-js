import { AboutTranslations } from '../types/about';
import { businessInfo, getFormattedDoctorInfo, getFormattedAddress, getFormattedPhone, getFormattedHours } from '../../config/business';

export const aboutTranslations: Record<string, AboutTranslations> = {
  en: {
    title: businessInfo.doctor.name,
    subtitle: "MBBS, MD (Skin-VD)",
    experience: `${businessInfo.doctor.experience} Years of Excellence`,
    qualification: "MBBS, MD (Skin-VD) - Reg.No. G-16930",
    yearsExperience: `${businessInfo.doctor.experience} Years in Healthcare`,
    specialization: "Dermatology & Cosmetic Surgery",
    
    // Doctor profile section
    doctorName: businessInfo.doctor.name,
    doctorQualification: "MBBS, MD (Skin-VD) - Reg.No. G-16930",
    doctorSpecialization: businessInfo.doctor.specialization,
    
    // Expertise section
    expertise: {
      title: "Professional Memberships & Achievements",
      items: [
        "Member of IMA",
        "Member of IADVL",
        "Member of ACSI",
        "Pioneer in introducing CO2 Laser Treatment in Mehsana (2008)",
        "First to introduce Vitiligo Surgery in Mehsana (2008)",
        "First to introduce Medifacial in Mehsana (2008)",
        "First to introduce Diode Hair Removal Therapy in Mehsana (2013)"
      ]
    },
    
    // Education section
    education: {
      title: "Education & Training",
      items: [
        {
          degree: "MBBS",
          institution: "PDU Medical College, Rajkot",
          year: "2004"
        },
        {
          degree: "MD (Skin-VD)",
          institution: "M P Shah Medical College, Jamnagar",
          year: "2008"
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
    subtitle: "એમબીબીએસ, એમડી (સ્કિન-વીડી)",
    experience: `${getFormattedDoctorInfo('gu').experience} વર્ષની શ્રેષ્ઠતા`,
    qualification: "એમબીબીએસ, એમડી (સ્કિન-વીડી) - રજી. નં. જી-૧૬૯૩૦",
    yearsExperience: `હેલ્થકેરમાં ${getFormattedDoctorInfo('gu').experience} વર્ષ`,
    specialization: "ડર્મેટોલોજી અને કોસ્મેટિક સર્જરી",
    
    // Doctor profile section
    doctorName: getFormattedDoctorInfo('gu').name,
    doctorQualification: "એમબીબીએસ, એમડી (સ્કિન-વીડી) - રજી. નં. જી-૧૬૯૩૦",
    doctorSpecialization: getFormattedDoctorInfo('gu').specialization,
    
    // Expertise section
    expertise: {
      title: "વ્યાવસાયિક સભ્યપદ અને સિદ્ધિઓ",
      items: [
        "આઈએમએના સભ્ય",
        "આઈએડીવીએલના સભ્ય",
        "એસીએસઆઈના સભ્ય",
        "મહેસાણામાં સીઓ૨ લેસર ટ્રીટમેન્ટના પ્રથમ પ્રવર્તક (૨૦૦૮)",
        "મહેસાણામાં વિટિલિગો સર્જરીના પ્રથમ પ્રવર્તક (૨૦૦૮)",
        "મહેસાણામાં મેડિફેશિયલના પ્રથમ પ્રવર્તક (૨૦૦૮)",
        "મહેસાણામાં ડાયોડ હેર રિમુવલ થેરેપીના પ્રથમ પ્રવર્તક (૨૦૧૩)"
      ]
    },
    
    // Education section
    education: {
      title: "શિક્ષણ અને તાલીમ",
      items: [
        {
          degree: "એમબીબીએસ",
          institution: "પીડીયુ મેડિકલ કોલેજ, રાજકોટ",
          year: "૨૦૦૪"
        },
        {
          degree: "એમડી (સ્કિન-વીડી)",
          institution: "એમ પી શાહ મેડિકલ કોલેજ, જામનગર",
          year: "૨૦૦૮"
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