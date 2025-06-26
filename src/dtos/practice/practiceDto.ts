export interface StartPracticeDto {
  category?: string;
}

export interface AnswerDto {
  sessionId: string;
  bindingKey: string;
  description: string;
  category: string;
  selectedAnswer: string;
}