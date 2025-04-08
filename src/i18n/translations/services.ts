import { ServicesTranslations } from '../types/services';
import { businessInfo } from '../../config/business';

export const servicesTranslations: Record<string, ServicesTranslations> = {
  en: {
    title: `Services at ${businessInfo.name}`,
    subtitle: `Comprehensive dermatological care with ${businessInfo.doctor.experience}+ years of expertise`,
    expertCare: "Expert Care",
    viewAll: "View All Services",
    categories: {
      medical: "Medical Therapy",
      hair: "Hair Treatment",
      diagnostic: "Diagnostic Facility",
      skinGlow: "Skin Glow Therapy",
      scar: "Scar Therapy",
      tattoo: "Tattoo Removal",
      laser: "Laser Therapy",
      surgery: "Surgery",
      ear: "Ear Lobe Repair"
    },
    lists: {
      medical: [
        "All types of skin problems",
        "Nail problems",
        "Skin problems of children",
        "Drug reactions"
      ],
      hair: [
        "All type of hair loss",
        "Alopecia areata",
        "Androgenetic alopecia"
      ],
      diagnostic: [
        "Dermatoscopy",
        "Skin Biopsy",
        "Woods lamp"
      ],
      skinGlow: [
        "Medifacial",
        "Carbon peeling",
        "Chemical peels",
        "Hydra facial",
        "Laser toning",
        "Mesotherapy"
      ],
      scar: [
        "For acne scars",
        "Accidental scar",
        "Chicken pox scars"
      ],
      tattoo: [
        "Tattoo removal"
      ],
      laser: [
        "Freckles",
        "Moles",
        "Cysts",
        "Corn",
        "Skin tags"
      ],
      surgery: [
        "Surgery for leukoderma (white spots)"
      ],
      ear: [
        "Ear lobe repair"
      ]
    },
    cta: {
      title: "Ready to Get Started?",
      subtitle: "Experience our expert dermatological care today",
      button: "Book an Appointment"
    }
  },
  gu: {
    title: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિકની સેવાઓ",
    subtitle: "૧૪+ વર્ષના અનુભવ સાથે વ્યાપક ડર્મેટોલોજિકલ સંભાળ",
    expertCare: "નિષ્ણાત સંભાળ",
    viewAll: "બધી સેવાઓ જુઓ",
    categories: {
      medical: "મેડિકલ ટરેપી",
      hair: "વાળ ટરેપી",
      diagnostic: "નિદાન ફેશિકલ",
      skinGlow: "ત્વચા ગોલ ટરેપી",
      scar: "નિશાન ટરેપી",
      tattoo: "ટાટો દૂર કરવા",
      laser: "લેસર ટરેપી",
      surgery: "સર્જિકલ",
      ear: "શરીર વાળ વાળ વાળ"
    },
    lists: {
      medical: [
        "બધા પ્રકારના ત્વચા સમસ્યાઓ",
        "નાલ સમસ્યાઓ",
        "શરીર સમસ્યાઓ બાળકો",
        "દર્દ પ્રતિક્રિયાઓ"
      ],
      hair: [
        "બધા પ્રકારના વાળ ખરવા",
        "એલોપેસિયા એરિયાટા",
        "એન્ડ્રોજેનેટિક એલોપેસિયા"
      ],
      diagnostic: [
        "ડર્મોસ્કોપી",
        "ત્વચા બિઓપ્સી",
        "વૉસ્ લામ્"
      ],
      skinGlow: [
        "મેડિફેશિયલ",
        "કાર્બન પીલ",
        "કેમિકલ પીલ",
        "હયરા ફેશિયલ",
        "લેસર ટોનિંગ",
        "મેસોથેરી"
      ],
      scar: [
        "એકનામાન નિશાન",
        "અપરિયાત નિશાન",
        "ચિકની પોક્સ નિશાન"
      ],
      tattoo: [
        "ટાટો દૂર કરવા"
      ],
      laser: [
        "ફ્રેકલ્સ",
        "મોલ્સ",
        "સિસ્ટ્સ",
        "કોર્ન",
        "ત્વચા ટેગ્સ"
      ],
      surgery: [
        "સર્જિકલ લુકોડર્મા (સફાઈ સ્પોટ્સ)"
      ],
      ear: [
        "શરીર વાળ વાળ"
      ]
    },
    cta: {
      title: "શરૂ કરવા માટે તૈયાર છો?",
      subtitle: "આજે જ અમારી નિષ્ણાત ડર્મેટોલોજિકલ કેર અનુભવો",
      button: "એપોઈન્ટમેન્ટ બુક કરો"
    }
  }
};