'use server';

import { PracticeHandler } from '@/handlers/practiceHandler';
import { startPracticeSchema, answerSchema } from '@/schemas/practiceSchema';

export async function startPracticeAction(formData: FormData) {
  try {
    const rawData = {
      category: formData.get('category') as string | null,
    };

    const validatedData = startPracticeSchema.parse({
      category: rawData.category || undefined,
    });

    const practiceHandler = new PracticeHandler();
    const sessionId = await practiceHandler.startPracticeSession(validatedData);

    return { success: true, sessionId };
  } catch (error) {
    console.error('Start practice error:', error);
    return { success: false, error: 'Failed to start practice session' };
  }
}

export async function submitAnswerAction(formData: FormData) {
  try {
    const rawData = {
      sessionId: formData.get('sessionId') as string,
      bindingKey: formData.get('bindingKey') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      selectedAnswer: formData.get('selectedAnswer') as string,
    };

    const validatedData = answerSchema.parse(rawData);

    const practiceHandler = new PracticeHandler();
    const result = await practiceHandler.submitAnswer(validatedData);

    return { success: true, result };
  } catch (error) {
    console.error('Submit answer error:', error);
    return { success: false, error: 'Failed to submit answer' };
  }
}