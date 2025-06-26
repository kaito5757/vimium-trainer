export interface Session {
  sessionId: string;
  startedAt: Date;
  endedAt?: Date;
  totalQuestions: number;
  correctAnswers: number;
  category?: string;
}