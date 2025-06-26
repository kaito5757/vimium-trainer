import { Practice } from '@/domain/practice/practice';

export interface IPracticeRepository {
  findAll(): Promise<Practice[]>;
  findByCategory(category: string): Promise<Practice[]>;
  save(practice: Practice): Promise<void>;
  update(practice: Practice): Promise<void>;
}