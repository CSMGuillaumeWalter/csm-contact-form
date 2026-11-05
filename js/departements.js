/**
 * Correspondance département → région (codes SVG fr.svg)
 * Utilisé pour l'affectation automatique via code postal.
 */
export const DEPARTEMENT_TO_REGION = {
  '01': 'FRARA', '02': 'FRHDF', '03': 'FRARA', '04': 'FRPAC', '05': 'FRPAC',
  '06': 'FRPAC', '07': 'FRARA', '08': 'FRGES', '09': 'FROCC', '10': 'FRGES',
  '11': 'FROCC', '12': 'FROCC', '13': 'FRPAC', '14': 'FRNOR', '15': 'FRARA',
  '16': 'FRNAQ', '17': 'FRNAQ', '18': 'FRCVL', '19': 'FRNAQ', '21': 'FRBFC',
  '22': 'FRBRE', '23': 'FRNAQ', '24': 'FRNAQ', '25': 'FRBFC', '26': 'FRARA',
  '27': 'FRNOR', '28': 'FRCVL', '29': 'FRBRE', '2A': 'FR20R', '2B': 'FR20R',
  '30': 'FROCC', '31': 'FROCC', '32': 'FROCC', '33': 'FRNAQ', '34': 'FROCC',
  '35': 'FRBRE', '36': 'FRCVL', '37': 'FRCVL', '38': 'FRARA', '39': 'FRBFC',
  '40': 'FRNAQ', '41': 'FRCVL', '42': 'FRARA', '43': 'FRARA', '44': 'FRPDL',
  '45': 'FRCVL', '46': 'FROCC', '47': 'FRNAQ', '48': 'FROCC', '49': 'FRPDL',
  '50': 'FRNOR', '51': 'FRGES', '52': 'FRGES', '53': 'FRPDL', '54': 'FRGES',
  '55': 'FRGES', '56': 'FRBRE', '57': 'FRGES', '58': 'FRBFC', '59': 'FRHDF',
  '60': 'FRHDF', '61': 'FRNOR', '62': 'FRHDF', '63': 'FRARA', '64': 'FRNAQ',
  '65': 'FROCC', '66': 'FROCC', '67': 'FRGES', '68': 'FRGES', '69': 'FRARA',
  '70': 'FRBFC', '71': 'FRBFC', '72': 'FRPDL', '73': 'FRARA', '74': 'FRARA',
  '75': 'FRIDF', '76': 'FRNOR', '77': 'FRIDF', '78': 'FRIDF', '79': 'FRNAQ',
  '80': 'FRHDF', '81': 'FROCC', '82': 'FROCC', '83': 'FRPAC', '84': 'FRPAC',
  '85': 'FRPDL', '86': 'FRNAQ', '87': 'FRNAQ', '88': 'FRGES', '89': 'FRBFC',
  '90': 'FRBFC', '91': 'FRIDF', '92': 'FRIDF', '93': 'FRIDF', '94': 'FRIDF',
  '95': 'FRIDF',
};

export const REGION_LABELS = {
  FRHDF: 'Hauts-de-France',
  FRNOR: 'Normandie',
  FRBRE: 'Bretagne',
  FRPDL: 'Pays de la Loire',
  FRCVL: 'Centre-Val de Loire',
  FRIDF: 'Île-de-France',
  FRGES: 'Grand Est',
  FRBFC: 'Bourgogne-Franche-Comté',
  FRARA: 'Auvergne-Rhône-Alpes',
  FRNAQ: 'Nouvelle-Aquitaine',
  FROCC: 'Occitanie',
  FRPAC: "Provence-Alpes-Côte d'Azur",
  FR20R: 'Corse',
};

/**
 * Code postal représentatif (préfecture / métropole) par région.
 * Évite d'affecter le code postal de domicile du commercial s'il habite une autre région
 * ou partage plusieurs régions (ex: PACA, Occitanie, Corse).
 */
export const REGION_REPRESENTATIVE_POSTAL = {
  FRHDF: '59000', // Lille
  FRNOR: '76000', // Rouen
  FRBRE: '35000', // Rennes
  FRPDL: '44000', // Nantes
  FRCVL: '45000', // Orléans
  FRIDF: '75001', // Paris
  FRGES: '67000', // Strasbourg
  FRBFC: '21000', // Dijon
  FRARA: '69000', // Lyon
  FRNAQ: '33000', // Bordeaux
  FROCC: '31000', // Toulouse
  FRPAC: '13000', // Marseille
  FR20R: '20000', // Ajaccio
};

/**
 * Extrait le département à partir d'un code postal français (5 chiffres).
 */
export function getDepartementFromPostalCode(postalCode) {
  const cp = String(postalCode || '').trim();
  if (!/^\d{5}$/.test(cp)) return null;

  if (cp.startsWith('20')) {
    const corseNum = parseInt(cp.slice(0, 3), 10);
    return corseNum >= 202 ? '2B' : '2A';
  }

  const dept = cp.slice(0, 2);
  if (dept === '97') return cp.slice(0, 3);
  return dept;
}

export function getRegionFromPostalCode(postalCode) {
  const dept = getDepartementFromPostalCode(postalCode);
  if (!dept) return null;
  return DEPARTEMENT_TO_REGION[dept] || null;
}
