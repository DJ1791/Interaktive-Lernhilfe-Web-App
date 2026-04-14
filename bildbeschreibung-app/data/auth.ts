export interface User {
  id: number;
  username: string;
  password: string;
  displayName: string;
}

export const users: User[] = [
  { id: 1, username: 'aldijana', password: 'AR1', displayName: 'Aldijana' },
  { id: 2, username: 'cristian', password: 'CC2', displayName: 'Cristian' },
  { id: 3, username: 'emin', password: 'EK3', displayName: 'Emin' },
  { id: 4, username: 'emre', password: 'ES4', displayName: 'Emre' },
  { id: 5, username: 'ibrahim', password: 'IO5', displayName: 'Ibrahim' },
  { id: 6, username: 'jorge', password: 'JVC6', displayName: 'Jorge' },
  { id: 7, username: 'luana', password: 'LC7', displayName: 'Luana' },
  { id: 8, username: 'noam', password: 'NM8', displayName: 'Noam' },
  { id: 9, username: 'talal', password: 'TED9', displayName: 'Talal' },
  { id: 10, username: 'davis', password: 'DK17', displayName: 'Davis' },
  { id: 11, username: 'abdullah', password: 'AÖ11', displayName: 'Abdullah' },
  { id: 12, username: 'serhii', password: 'SP12', displayName: 'Serhii' },
  { id: 13, username: 'oleksandr', password: 'OK13', displayName: 'Oleksandr' },
  { id: 14, username: 'ube', password: 'UT14', displayName: 'Ube' },
  { id: 15, username: 'nouhaila', password: 'NT15', displayName: 'Nouhaila' },
  { id: 16, username: 'kuan', password: 'KH16', displayName: 'Kuan' },
  { id: 99, username: 'lehrkraft', password: 'TEACH99', displayName: 'Lehrkraft' },
];

export const TEACHER_USERNAME = 'lehrkraft';

export function isTeacher(username: string): boolean {
  return username === TEACHER_USERNAME;
}
