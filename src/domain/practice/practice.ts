export interface Practice {
  practiceId: string;
  bindingKey: string;
  description: string;
  category: string;
  attempts: number;
  correctAttempts: number;
  lastAttemptAt?: Date;
}