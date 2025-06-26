export interface PracticeQuestionViewModel {
  question: string;
  options: {
    key: string;
    description: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
}

export interface PracticeResultViewModel {
  isCorrect: boolean;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  message: string;
}