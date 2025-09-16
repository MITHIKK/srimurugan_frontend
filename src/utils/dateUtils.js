// Tamil Months - Correctly mapped to English months
const tamilMonths = [
  'மார்கழி (Margazhi)',  // December-January
  'தை (Thai)',          // January-February
  'மாசி (Maasi)',        // February-March
  'பங்குனி (Panguni)',   // March-April
  'சித்திரை (Chithirai)', // April-May
  'வைகாசி (Vaikasi)',    // May-June
  'ஆனி (Aani)',          // June-July
  'ஆடி (Aadi)',          // July-August
  'ஆவணி (Aavani)',       // August-September
  'புரட்டாசி (Purattasi)', // September-October
  'ஐப்பசி (Aippasi)',     // October-November
  'கார்த்திகை (Karthigai)' // November-December
];

// Tamil Month Names (Short) - Correctly mapped
const tamilMonthsShort = [
  'மார்கழி',   // December-January
  'தை',       // January-February
  'மாசி',      // February-March
  'பங்குனி',   // March-April
  'சித்திரை',  // April-May
  'வைகாசி',    // May-June
  'ஆனி',       // June-July
  'ஆடி',       // July-August
  'ஆவணி',      // August-September
  'புரட்டாசி',  // September-October
  'ஐப்பசி',    // October-November
  'கார்த்திகை' // November-December
];

// Tamil Days
const tamilDays = [
  'ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'
];

export const getTamilMonth = (month, year) => {
  return tamilMonths[month];
};

export const getTamilMonthShort = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Tamil months typically change around 14-16 of English months
  // If day is less than 15, show previous Tamil month
  let tamilMonthIndex = month;
  if (day < 15) {
    tamilMonthIndex = (month - 1 + 12) % 12;
  }
  
  return tamilMonthsShort[tamilMonthIndex];
};

export const getTamilDateNumber = (date) => {
  // This is a simplified calculation for Tamil date
  // In reality, Tamil calendar has complex calculations
  const day = date.getDate();
  
  // Tamil months typically start around 14-15 of English months
  let tamilDate = day;
  if (day < 15) {
    // If before 15th, it's previous Tamil month's latter dates
    tamilDate = day + 15;
  } else {
    // If after 15th, it's current Tamil month's beginning dates
    tamilDate = day - 14;
  }
  
  return tamilDate;
};

export const getTamilDate = (date) => {
  const dayIndex = date.getDay();
  return tamilDays[dayIndex];
};

export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
