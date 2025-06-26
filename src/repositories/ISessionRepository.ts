import { Session } from '@/domain/session/session';

export interface ISessionRepository {
  save(session: Session): Promise<void>;
  findById(id: string): Promise<Session | null>;
  findAll(): Promise<Session[]>;
  update(session: Session): Promise<void>;
}