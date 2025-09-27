// Tamil calendar utility functions with accurate date calculations

const tamilMonths = [
  'சித்திரை', // Chithirai (April 14 - May 14)
  'வைகாசி', // Vaikasi (May 15 - June 14)
  'ஆனி', // Aani (June 15 - July 16)
  'ஆடி', // Aadi (July 17 - August 16)
  'ஆவணி', // Aavani (August 17 - September 16)
  'புரட்டாசி', // Purattasi (September 17 - October 17)
  'ஐப்பசி', // Aippasi (October 18 - November 16)
  'கார்த்திகை', // Karthigai (November 17 - December 16)
  'மார்கழி', // Margazhi (December 17 - January 14)
  'தை', // Thai (January 15 - February 13)
  'மாசி', // Maasi (February 14 - March 15)
  'பங்குனி' // Panguni (March 16 - April 13)
];

const tamilDays = [
  'ஞாயிறு', // Sunday
  'திங்கள்', // Monday
  'செவ்வாய்', // Tuesday
  'புதன்', // Wednesday
  'வியாழன்', // Thursday
  'வெள்ளி', // Friday
  'சனி' // Saturday
];

const tamilNumbers = [
  '௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'
];

// Convert English number to Tamil number
export const convertToTamilNumber = (number) => {
  return number.toString().split('').map(digit => tamilNumbers[parseInt(digit)]).join('');
};

// Accurate Tamil month calculation based on solar calendar
export const getTamilMonth = (date) => {
  const month = date.getMonth() + 1; // 1-based month
  const day = date.getDate();
  
  // Tamil months start on specific dates (approximate solar calendar)
  if ((month === 4 && day >= 14) || (month === 5 && day <= 14)) return tamilMonths[0]; // Chithirai
  if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) return tamilMonths[1]; // Vaikasi
  if ((month === 6 && day >= 15) || (month === 7 && day <= 16)) return tamilMonths[2]; // Aani
  if ((month === 7 && day >= 17) || (month === 8 && day <= 16)) return tamilMonths[3]; // Aadi
  if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) return tamilMonths[4]; // Aavani
  if ((month === 9 && day >= 17) || (month === 10 && day <= 17)) return tamilMonths[5]; // Purattasi
  if ((month === 10 && day >= 18) || (month === 11 && day <= 16)) return tamilMonths[6]; // Aippasi
  if ((month === 11 && day >= 17) || (month === 12 && day <= 16)) return tamilMonths[7]; // Karthigai
  if ((month === 12 && day >= 17) || (month === 1 && day <= 14)) return tamilMonths[8]; // Margazhi
  if ((month === 1 && day >= 15) || (month === 2 && day <= 13)) return tamilMonths[9]; // Thai
  if ((month === 2 && day >= 14) || (month === 3 && day <= 15)) return tamilMonths[10]; // Maasi
  if ((month === 3 && day >= 16) || (month === 4 && day <= 13)) return tamilMonths[11]; // Panguni
  
  // Fallback
  return tamilMonths[0];
};

// Get Tamil day of week
export const getTamilDay = (date) => {
  return tamilDays[date.getDay()];
};

// Calculate Tamil date (day of the month) based on solar calendar
export const getTamilDate = (date) => {
  const month = date.getMonth() + 1; // 1-based month
  const day = date.getDate();
  
  // Calculate Tamil date based on month start dates
  if ((month === 4 && day >= 14) || (month === 5 && day <= 14)) {
    return month === 4 ? day - 13 : day + 17; // Chithirai
  }
  if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) {
    return month === 5 ? day - 14 : day + 16; // Vaikasi
  }
  if ((month === 6 && day >= 15) || (month === 7 && day <= 16)) {
    return month === 6 ? day - 14 : day + 16; // Aani
  }
  if ((month === 7 && day >= 17) || (month === 8 && day <= 16)) {
    return month === 7 ? day - 16 : day + 15; // Aadi
  }
  if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) {
    return month === 8 ? day - 16 : day + 15; // Aavani
  }
  if ((month === 9 && day >= 17) || (month === 10 && day <= 17)) {
    return month === 9 ? day - 16 : day + 14; // Purattasi
  }
  if ((month === 10 && day >= 18) || (month === 11 && day <= 16)) {
    return month === 10 ? day - 17 : day + 14; // Aippasi
  }
  if ((month === 11 && day >= 17) || (month === 12 && day <= 16)) {
    return month === 11 ? day - 16 : day + 14; // Karthigai
  }
  if ((month === 12 && day >= 17) || (month === 1 && day <= 14)) {
    return month === 12 ? day - 16 : day + 15; // Margazhi
  }
  if ((month === 1 && day >= 15) || (month === 2 && day <= 13)) {
    return month === 1 ? day - 14 : day + 17; // Thai
  }
  if ((month === 2 && day >= 14) || (month === 3 && day <= 15)) {
    return month === 2 ? day - 13 : day + 15; // Maasi
  }
  if ((month === 3 && day >= 16) || (month === 4 && day <= 13)) {
    return month === 3 ? day - 15 : day + 16; // Panguni
  }
  
  return day; // Fallback
};

// Format full Tamil date with accurate calculations
export const formatTamilDate = (date) => {
  const tamilMonth = getTamilMonth(date);
  const tamilDay = getTamilDay(date);
  const tamilDate = getTamilDate(date);
  const tamilDateInTamilNumbers = convertToTamilNumber(tamilDate);
  
  return {
    month: tamilMonth,
    date: tamilDate,
    day: tamilDay,
    fullDate: `${tamilDateInTamilNumbers} ${tamilMonth} - ${tamilDay}`
  };
};
