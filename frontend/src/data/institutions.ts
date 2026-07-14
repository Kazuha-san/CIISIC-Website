export interface Institution {
  initials: string;
  name: string;
  city: 'Indore' | 'Bhopal';
}

export const INDORE_INSTITUTIONS: Institution[] = [
  { initials: 'Vikrant', name: 'Vikrant Institute', city: 'Indore' },
  { initials: 'IPS', name: 'IPS', city: 'Indore' },
  { initials: 'Symbiosis', name: 'Symbiosis', city: 'Indore' },
  { initials: 'SVVV', name: 'Shri Vaishnav Vidyapeeth Vishwavidyalaya', city: 'Indore' },
  { initials: 'IPSA', name: 'IPS Academy', city: 'Indore' },
  { initials: 'SVIM', name: 'Shri Vaishnav Institute of Management', city: 'Indore' },
  { initials: 'Jaipuria', name: 'Jaipuria Institute of Management', city: 'Indore' },
  { initials: 'IIT Indore', name: 'Indian Institute of Technology (IIT), Indore', city: 'Indore' },
  { initials: 'MIST', name: 'Malwa Institute of Science & Technology', city: 'Indore' },
  { initials: 'Medi-Caps', name: 'Medi Caps University', city: 'Indore' },
  { initials: 'SGSITS', name: 'SGSITS', city: 'Indore' },
  { initials: 'Jaipuria', name: 'Jaipuria', city: 'Indore' },
  { initials: 'AITR', name: 'Acropolis Institute of Technology & Research', city: 'Indore' },
  { initials: 'IIM Indore', name: 'Indian Institute of Management (IIM), Indore', city: 'Indore' },
  { initials: 'PIMR', name: 'Prestige Institute of Management & Research', city: 'Indore' },
  { initials: 'SUAS', name: 'Symbiosis University of Applied Sciences', city: 'Indore' },
  { initials: 'PIEMR', name: 'Prestige Institute of Engineering Management & Research', city: 'Indore' },
  { initials: 'IITI Drishti', name: 'IITI Drishti CPS Foundation', city: 'Indore' },
  { initials: 'SAGE', name: 'Sage University', city: 'Indore' },
  { initials: 'DCBM', name: 'Daly College of Business Management', city: 'Indore' },
];

export const BHOPAL_INSTITUTIONS: Institution[] = [
  { initials: 'JLU', name: 'Jagran Lakecity University', city: 'Bhopal' },
  { initials: 'IES', name: 'Infotech Education Society University', city: 'Bhopal' },
  { initials: 'Career', name: 'Career College', city: 'Bhopal' },
  { initials: 'OIST', name: 'Oriental Institute of Science & Technology', city: 'Bhopal' },
  { initials: 'RNTU', name: 'Rabindranath Tagore University (RNTU)', city: 'Bhopal' },
  { initials: 'CRISP', name: 'Centre for Research & Industrial Staff Performance (CRISP)', city: 'Bhopal' },
  { initials: 'IHM', name: 'Institute of Hotel Management (IHM)', city: 'Bhopal' },
  { initials: 'IPER', name: 'Institute of Professional Education & Research (IPER)', city: 'Bhopal' },
  { initials: 'Vidhyapeeth', name: 'Vidhyapeeth Group of Institutions', city: 'Bhopal' },
  { initials: 'LNCT', name: 'Lakshmi Narain College of Technology', city: 'Bhopal' },
  { initials: 'IIFM', name: 'Indian Institute of Forest Management (IIFM)', city: 'Bhopal' },
  { initials: 'MPU', name: 'Madhyanchal Professional University', city: 'Bhopal' },
  { initials: 'RGI', name: 'Ravishankar Group of Institutes', city: 'Bhopal' },
  { initials: 'BSSS-IAS', name: 'BSSS Institute of Advanced Studies', city: 'Bhopal' },
  { initials: 'NID', name: 'National Institute of Design', city: 'Bhopal' },
  { initials: 'MKP', name: 'MK Ponda College of Business and Management', city: 'Bhopal' },
];

export const ALL_INSTITUTIONS: Institution[] = [...INDORE_INSTITUTIONS, ...BHOPAL_INSTITUTIONS];
