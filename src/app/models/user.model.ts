export interface User {
  id: string;
  name: string;
  role: 'MEMBER' | 'MANAGER';
}