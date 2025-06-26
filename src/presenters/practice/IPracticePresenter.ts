import { GetRandomQuestionOutput, SubmitAnswerOutput } from '@/application/practice/IPracticeUseCase';
import { PracticeQuestionViewModel, PracticeResultViewModel } from '@/dtos/practice/practiceViewModel';

export interface IPracticePresenter {
  presentQuestion(output: GetRandomQuestionOutput): PracticeQuestionViewModel;
  presentResult(output: SubmitAnswerOutput): PracticeResultViewModel;
}