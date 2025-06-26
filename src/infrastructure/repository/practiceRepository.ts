import { IPracticeRepository } from '@/repositories/IPracticeRepository';
import { Practice } from '@/domain/practice/practice';

export class PracticeRepository implements IPracticeRepository {
  private readonly STORAGE_KEY = 'vimium-trainer-practices';

  async findAll(): Promise<Practice[]> {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    try {
      return JSON.parse(data) as Practice[];
    } catch {
      return [];
    }
  }

  async findByCategory(category: string): Promise<Practice[]> {
    const practices = await this.findAll();
    return practices.filter(p => p.category === category);
  }

  async save(practice: Practice): Promise<void> {
    const practices = await this.findAll();
    practices.push(practice);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(practices));
  }

  async update(practice: Practice): Promise<void> {
    const practices = await this.findAll();
    const index = practices.findIndex(p => p.practiceId === practice.practiceId);
    
    if (index !== -1) {
      practices[index] = practice;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(practices));
    }
  }
}