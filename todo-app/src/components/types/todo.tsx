export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type filterType = 'all' | 'active' | 'completed';

export type sortType = 'new' | 'old';
