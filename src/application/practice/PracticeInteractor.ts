import {
  IStartPracticeSessionUseCase,
  StartPracticeSessionInput,
  StartPracticeSessionOutput,
  IGetRandomQuestionUseCase,
  GetRandomQuestionInput,
  GetRandomQuestionOutput,
  ISubmitAnswerUseCase,
  SubmitAnswerInput,
  SubmitAnswerOutput,
} from './IPracticeUseCase';
import { ISessionRepository } from '@/repositories/ISessionRepository';
import { IPracticeRepository } from '@/repositories/IPracticeRepository';
import { Session } from '@/domain/session/session';
import { SessionId } from '@/domain/session/sessionId';
import { Practice } from '@/domain/practice/practice';
import { PracticeId } from '@/domain/practice/practiceId';
import { KeyBinding } from '@/domain/practice/keyBinding';
import { vimiumBindings } from '@/data/vimiumBindings';

export class StartPracticeSessionInteractor implements IStartPracticeSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: StartPracticeSessionInput): Promise<StartPracticeSessionOutput> {
    const sessionId = SessionId.generate();
    const session: Session = {
      sessionId: sessionId.getValue(),
      startedAt: new Date(),
      totalQuestions: 0,
      correctAnswers: 0,
      category: input.category,
    };

    await this.sessionRepository.save(session);

    return {
      sessionId: session.sessionId,
    };
  }
}

export class GetRandomQuestionInteractor implements IGetRandomQuestionUseCase {
  execute(input: GetRandomQuestionInput): GetRandomQuestionOutput {
    let availableBindings = vimiumBindings;

    if (input.category) {
      availableBindings = availableBindings.filter(b => b.category === input.category);
    }

    if (input.excludeKeys && input.excludeKeys.length > 0) {
      availableBindings = availableBindings.filter(b => !input.excludeKeys!.includes(b.key));
    }

    if (availableBindings.length === 0) {
      throw new Error('全ての問題を出題しました');
    }

    const randomIndex = Math.floor(Math.random() * availableBindings.length);
    const correctBinding = availableBindings[randomIndex];
    const answer = new KeyBinding(correctBinding.key, correctBinding.description, correctBinding.category);

    const wrongOptions = this.getRandomWrongOptions(correctBinding.key, input.category);
    const options = this.shuffleArray([answer, ...wrongOptions]);

    return {
      question: correctBinding.description,
      answer,
      options,
    };
  }

  private getRandomWrongOptions(correctKey: string, category?: string): KeyBinding[] {
    let pool = vimiumBindings.filter(b => b.key !== correctKey);
    
    if (category) {
      const sameCategoryPool = pool.filter(b => b.category === category);
      if (sameCategoryPool.length >= 3) {
        pool = sameCategoryPool;
      }
    }

    const wrongOptions: KeyBinding[] = [];
    const usedKeys = new Set<string>();

    while (wrongOptions.length < 3 && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const binding = pool[randomIndex];
      
      if (!usedKeys.has(binding.key)) {
        wrongOptions.push(new KeyBinding(binding.key, binding.description, binding.category));
        usedKeys.add(binding.key);
      }
      
      pool.splice(randomIndex, 1);
    }

    return wrongOptions;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export class SubmitAnswerInteractor implements ISubmitAnswerUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly practiceRepository: IPracticeRepository
  ) {}

  async execute(input: SubmitAnswerInput): Promise<SubmitAnswerOutput> {
    const session = await this.sessionRepository.findById(input.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.totalQuestions += 1;
    if (input.isCorrect) {
      session.correctAnswers += 1;
    }

    await this.sessionRepository.update(session);

    const practices = await this.practiceRepository.findAll();
    let practice = practices.find(p => p.bindingKey === input.bindingKey);

    if (!practice) {
      const practiceId = PracticeId.generate();
      practice = {
        practiceId: practiceId.getValue(),
        bindingKey: input.bindingKey,
        description: input.description,
        category: input.category,
        attempts: 0,
        correctAttempts: 0,
      };
    }

    practice.attempts += 1;
    if (input.isCorrect) {
      practice.correctAttempts += 1;
    }
    practice.lastAttemptAt = new Date();

    if (practices.find(p => p.bindingKey === input.bindingKey)) {
      await this.practiceRepository.update(practice);
    } else {
      await this.practiceRepository.save(practice);
    }

    const accuracy = session.totalQuestions > 0 
      ? (session.correctAnswers / session.totalQuestions) * 100 
      : 0;

    return {
      isCorrect: input.isCorrect,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      accuracy: Math.round(accuracy),
    };
  }
}