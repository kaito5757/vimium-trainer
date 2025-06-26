import { ISessionRepository } from '@/repositories/ISessionRepository';
import { Session } from '@/domain/session/session';

export class SessionRepository implements ISessionRepository {
  private readonly STORAGE_KEY = 'vimium-trainer-sessions';

  async save(session: Session): Promise<void> {
    const sessions = await this.findAll();
    sessions.push(session);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  async findById(id: string): Promise<Session | null> {
    const sessions = await this.findAll();
    return sessions.find(s => s.sessionId === id) || null;
  }

  async findAll(): Promise<Session[]> {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    try {
      return JSON.parse(data) as Session[];
    } catch {
      return [];
    }
  }

  async update(session: Session): Promise<void> {
    const sessions = await this.findAll();
    const index = sessions.findIndex(s => s.sessionId === session.sessionId);
    
    if (index !== -1) {
      sessions[index] = session;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    }
  }
}