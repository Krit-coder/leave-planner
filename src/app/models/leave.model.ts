export interface Leave {
  userId: string;
  date: string; // yyyy-mm-dd
  type: 'PLANNED' | 'UNPLANNED';
}
