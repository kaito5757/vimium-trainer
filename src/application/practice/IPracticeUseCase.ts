import { KeyBinding } from '@/domain/practice/keyBinding';

// Start Practice Session
export interface IStartPracticeSessionUseCase {
  execute(input: StartPracticeSessionInput): Promise<StartPracticeSessionOutput>;
}

export interface StartPracticeSessionInput {
  category?: string;
}

export interface StartPracticeSessionOutput {
  sessionId: string;
}

// Get Random Question
export interface IGetRandomQuestionUseCase {
  execute(input: GetRandomQuestionInput): GetRandomQuestionOutput;
}

export interface GetRandomQuestionInput {
  category?: string;
  excludeKeys?: string[];
}

export interface GetRandomQuestionOutput {
  question: string;
  answer: KeyBinding;
  options: KeyBinding[];
}

// Submit Answer
export interface ISubmitAnswerUseCase {
  execute(input: SubmitAnswerInput): Promise<SubmitAnswerOutput>;
}

export interface SubmitAnswerInput {
  sessionId: string;
  bindingKey: string;
  description: string;
  category: string;
  isCorrect: boolean;
}

export interface SubmitAnswerOutput {
  isCorrect: boolean;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}