import { StartPracticeDto, AnswerDto } from '@/dtos/practice/practiceDto';
import { PracticeQuestionViewModel, PracticeResultViewModel } from '@/dtos/practice/practiceViewModel';
import { 
  StartPracticeSessionInteractor, 
  GetRandomQuestionInteractor, 
  SubmitAnswerInteractor 
} from '@/application/practice/PracticeInteractor';
import { PracticePresenter } from '@/presenters/practice/PracticePresenter';
import { SessionRepository } from '@/infrastructure/repository/sessionRepository';
import { PracticeRepository } from '@/infrastructure/repository/practiceRepository';

export class PracticeHandler {
  private readonly sessionRepository = new SessionRepository();
  private readonly practiceRepository = new PracticeRepository();
  private readonly presenter = new PracticePresenter();

  async startPracticeSession(dto: StartPracticeDto): Promise<string> {
    const interactor = new StartPracticeSessionInteractor(this.sessionRepository);
    const result = await interactor.execute({ category: dto.category });
    return result.sessionId;
  }

  getRandomQuestion(category?: string, excludeKeys?: string[]): PracticeQuestionViewModel | null {
    const interactor = new GetRandomQuestionInteractor();
    try {
      const result = interactor.execute({ category, excludeKeys });
      return this.presenter.presentQuestion(result);
    } catch (error) {
      // 全問題出題済みの場合
      console.log('全ての問題を出題しました');
      return null;
    }
  }

  async submitAnswer(dto: AnswerDto): Promise<PracticeResultViewModel> {
    const interactor = new SubmitAnswerInteractor(this.sessionRepository, this.practiceRepository);
    const isCorrect = dto.selectedAnswer === dto.bindingKey;
    
    const result = await interactor.execute({
      sessionId: dto.sessionId,
      bindingKey: dto.bindingKey,
      description: dto.description,
      category: dto.category,
      isCorrect,
    });

    return this.presenter.presentResult(result);
  }
}