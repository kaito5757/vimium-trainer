import { IPracticePresenter } from './IPracticePresenter';
import { GetRandomQuestionOutput, SubmitAnswerOutput } from '@/application/practice/IPracticeUseCase';
import { PracticeQuestionViewModel, PracticeResultViewModel } from '@/dtos/practice/practiceViewModel';

export class PracticePresenter implements IPracticePresenter {
  presentQuestion(output: GetRandomQuestionOutput): PracticeQuestionViewModel {
    return {
      question: output.question,
      options: output.options.map(option => ({
        key: option.key,
        description: option.description,
        isCorrect: option.equals(output.answer),
      })),
      correctAnswer: output.answer.key,
    };
  }

  presentResult(output: SubmitAnswerOutput): PracticeResultViewModel {
    return {
      isCorrect: output.isCorrect,
      totalQuestions: output.totalQuestions,
      correctAnswers: output.correctAnswers,
      accuracy: output.accuracy,
      message: output.isCorrect ? '正解！' : '不正解',
    };
  }
}