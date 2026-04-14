import { ImageSourcePropType } from 'react-native';

const imageMap: Record<string, ImageSourcePropType> = {
  // Phase 1
  'P1-01': require('../assets/images/P1-01.jpg'),
  'P1-02': require('../assets/images/P1-02.jpg'),
  'P1-03': require('../assets/images/P1-03.jpg'),
  'P1-04': require('../assets/images/P1-04.jpg'),
  'P1-05': require('../assets/images/P1-05.jpg'),
  'P1-06': require('../assets/images/P1-06.jpg'),
  'P1-07': require('../assets/images/P1-07.jpg'),
  'P1-08': require('../assets/images/P1-08.jpg'),
  'P1-09': require('../assets/images/P1-09.jpg'),
  // Phase 2
  'P2-01': require('../assets/images/P2-01.jpg'),
  'P2-02': require('../assets/images/P2-02.jpg'),
  'P2-03': require('../assets/images/P2-03.jpg'),
  'P2-04': require('../assets/images/P2-04.jpg'),
  'P2-05': require('../assets/images/P2-05.jpg'),
  'P2-06': require('../assets/images/P2-06.jpg'),
  'P2-07': require('../assets/images/P2-07.jpg'),
  // Phase 3
  'P3-01': require('../assets/images/P3-01.jpg'),
  'P3-02': require('../assets/images/P3-02.jpg'),
  'P3-03': require('../assets/images/P3-03.jpg'),
  'P3-04': require('../assets/images/P3-04.jpg'),
  'P3-05': require('../assets/images/P3-05.jpg'),
  'P3-06': require('../assets/images/P3-06.jpg'),
  'P3-07': require('../assets/images/P3-07.jpg'),
  // Phase 4
  'P4-01': require('../assets/images/P4-01.jpg'),
  'P4-02': require('../assets/images/P4-02.jpg'),
  'P4-03': require('../assets/images/P4-03.jpg'),
  'P4-04': require('../assets/images/P4-04.jpg'),
  'P4-05': require('../assets/images/P4-05.jpg'),
  'P4-06': require('../assets/images/P4-06.jpg'),
  // Extra / Fokus
  'EX-01': require('../assets/images/EX-01.jpg'),
  'EX-02': require('../assets/images/EX-02.jpg'),
  'EX-03': require('../assets/images/EX-03.jpg'),
  'EX-04': require('../assets/images/EX-04.jpg'),
  'EX-05': require('../assets/images/EX-05.jpg'),
  'EX-06': require('../assets/images/EX-06.jpg'),
  // Fokus / "Beispiel-Übungen" szenen (eigene Motive, keine EX-Aliases!)
  'F-01': require('../assets/images/F-01.jpg'), // Parkszene
  'F-02': require('../assets/images/F-02.jpg'), // Küchenszene
  'F-03': require('../assets/images/F-03.jpg'), // Marktszene
  'F-04': require('../assets/images/F-04.jpg'), // Wohnzimmerszene
  'F-05': require('../assets/images/F-05.jpg'), // Klassenzimmerszene
  'F-06': require('../assets/images/F-06.jpg'), // Café-Szene
};

const fallback = require('../assets/images/P1-01.jpg');

export function getImage(id: string): ImageSourcePropType {
  return imageMap[id] || fallback;
}
