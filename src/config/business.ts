export const businessInfo = {
  name: "Shubham Skin & Laser Clinic",
  doctor: {
    name: "Dr. Jemish A. Patel",
    qualifications: "MBBS, MD",
    specialization: "Dermatologist, Cosmetic Surgeon & Trichologist",
    university: "Saurashtra University (2008)",
    experience: 14
  },
  contact: {
    phone: "+91 99095 87003",
    email: "contact@shubhamskinlaser.com",
    address: "2nd Floor, Avi Square, Radhanpur Cir, Mehsana, Gujarat 384002"
  },
  hours: {
    weekday: {
      morning: "9:00 AM - 1:00 PM",
      evening: "4:00 PM - 6:30 PM"
    },
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#"
  }
};

const translateToGujaratiDigits = (text: string) => {
  const gujaratiDigits = {
    '0': '૦',
    '1': '૧',
    '2': '૨',
    '3': '૩',
    '4': '૪',
    '5': '૫',
    '6': '૬',
    '7': '૭',
    '8': '૮',
    '9': '૯'
  };
  
  // First translate the digits
  let translatedText = text.replace(/[0-9]/g, digit => gujaratiDigits[digit as keyof typeof gujaratiDigits]);
  
  // Then replace AM and PM with their Gujarati equivalents
  translatedText = translatedText.replace(/AM/g, "એએમ").replace(/PM/g, "પીએમ");
  
  return translatedText;
};

export const getFormattedHours = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    const morning = translateToGujaratiDigits(businessInfo.hours.weekday.morning);
    const evening = translateToGujaratiDigits(businessInfo.hours.weekday.evening);
    const saturday = translateToGujaratiDigits(businessInfo.hours.saturday);
    
    return {
      weekday: `સોમવાર - શુક્રવાર: સવારે ${morning} | સાંજે ${evening}`,
      saturday: `શનિવાર: સવારે ${saturday}`,
      sunday: `રવિવાર: ${businessInfo.hours.sunday}`
    };
  }

  return {
    weekday: `Monday - Friday: ${businessInfo.hours.weekday.morning} | ${businessInfo.hours.weekday.evening}`,
    saturday: `Saturday: ${businessInfo.hours.saturday}`,
    sunday: `Sunday: ${businessInfo.hours.sunday}`
  };
};

export const getFormattedAddress = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    const address = 'બીજો માળ, અવી સ્ક્વેર, રાધનપુર સર્કલ, મહેસાણા, ગુજરાત ૩૮૪૦૦૨';
    return translateToGujaratiDigits(address);
  }
  return businessInfo.contact.address;
};

export const getFormattedPhone = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    const phone = businessInfo.contact.phone;
    // Replace each digit with its Gujarati equivalent
    const gujaratiDigits = {
      '0': '૦',
      '1': '૧',
      '2': '૨',
      '3': '૩',
      '4': '૪',
      '5': '૫',
      '6': '૬',
      '7': '૭',
      '8': '૮',
      '9': '૯'
    };
    return phone.replace(/[0-9]/g, digit => gujaratiDigits[digit as keyof typeof gujaratiDigits]);
  }
  return businessInfo.contact.phone;
};

export const getFormattedDoctorInfo = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    return {
      name: 'ડૉ. જેમિશ એ. પટેલ',
      qualifications: 'એમબીબીએસ, એમડી',
      specialization: 'ડર્મેટોલોજિસ્ટ, કોસ્મેટિક સર્જન અને ટ્રાઇકોલોજિસ્ટ',
      university: 'સૌરાષ્ટ્ર યુનિવર્સિટી (૨૦૦૮)',
      experience: '૧૪'
    };
  }

  return {
    name: businessInfo.doctor.name,
    qualifications: businessInfo.doctor.qualifications,
    specialization: businessInfo.doctor.specialization,
    university: businessInfo.doctor.university,
    experience: businessInfo.doctor.experience.toString()
  };
};