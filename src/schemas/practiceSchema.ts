import { z } from 'zod';

export const startPracticeSchema = z.object({
  category: z.string().optional(),
});

export const answerSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  bindingKey: z.string().min(1, 'Binding key is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  selectedAnswer: z.string().min(1, 'Selected answer is required'),
});

export type StartPracticeSchema = z.infer<typeof startPracticeSchema>;
export type AnswerSchema = z.infer<typeof answerSchema>;