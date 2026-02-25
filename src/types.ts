export type Category = 'Organização' | 'Disciplina' | 'Desempenho';

export interface Student {
  id: number;
  name: string;
  points: number;
  categories: Record<Category, number>;
  attendance: string[];
}

export interface Level {
  name: string;
  color: string;
  emoji: string;
  starSize: number;
  starColor: string;
  starOpacity: number;
}
