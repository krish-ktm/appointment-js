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
    phone: "+91 79471 31573",
    email: "contact@shubhamskinlaser.com",
    address: "Mehsana Industrial Estate, Mehsana, Gujarat"
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

export const getFormattedHours = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    return {
      weekday: `સોમવાર - શુક્રવાર: સવારે ${businessInfo.hours.weekday.morning} | સાંજે ${businessInfo.hours.weekday.evening}`,
      saturday: `શનિવાર: સવારે ${businessInfo.hours.saturday}`,
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
  return language === 'gu' 
    ? 'મહેસાણા ઇન્ડસ્ટ્રીયલ એસ્ટેટ, મહેસાણા, ગુજરાત'
    : businessInfo.contact.address;
};

export const getFormattedPhone = (language: 'en' | 'gu') => {
  return language === 'gu'
    ? businessInfo.contact.phone.replace(/\+91/, '+૯૧')
    : businessInfo.contact.phone;
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