'use client';

import { useState, useEffect, useCallback } from 'react';
import { PracticeHandler } from '@/handlers/practiceHandler';
import { PracticeQuestionViewModel, PracticeResultViewModel } from '@/dtos/practice/practiceViewModel';
import { categories, vimiumBindings } from '@/data/vimiumBindings';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';
import { Modal } from '@/components/Modal';

interface PracticeState {
  sessionId: string | null;
  currentQuestion: PracticeQuestionViewModel | null;
  result: PracticeResultViewModel | null;
  selectedCategory: string | null;
  isLoading: boolean;
  showResult: boolean;
  pressedKeys: string[];
  usedQuestions: string[];
  showAnswerModal: boolean;
  showResultModal: boolean;
  allResults: PracticeResultViewModel[];
  lastCorrectAnswer: string;
  lastQuestionDescription: string;
  timeRemaining: number;
  isTimerRunning: boolean;
}

export function PracticeClient() {
  const [state, setState] = useState<PracticeState>({
    sessionId: null,
    currentQuestion: null,
    result: null,
    selectedCategory: null,
    isLoading: false,
    showResult: false,
    pressedKeys: [],
    usedQuestions: [],
    showAnswerModal: false,
    showResultModal: false,
    allResults: [],
    lastCorrectAnswer: '',
    lastQuestionDescription: '',
    timeRemaining: 5,
    isTimerRunning: false,
  });

  const practiceHandler = new PracticeHandler();

  const handleKeyPress = (key: string) => {
    if (state.showResult || state.isLoading || !state.currentQuestion) return;
    
    const newPressedKeys = [...state.pressedKeys, key];
    const currentInput = newPressedKeys.join('');
    
    setState(prev => ({ ...prev, pressedKeys: newPressedKeys }));
    
    // 正解の文字数に達したら判定
    if (currentInput.length === state.currentQuestion.correctAnswer.length) {
      // すでに判定中でないことを確認
      setState(prev => ({ ...prev, isLoading: true, isTimerRunning: false }));
      setTimeout(() => {
        checkAnswer(currentInput);
      }, 300);
    }
  };

  const clearInput = () => {
    setState(prev => ({ ...prev, pressedKeys: [] }));
  };

  const checkAnswer = async (answer: string) => {
    if (!state.sessionId || !state.currentQuestion) return;
    
    try {
      const result = await practiceHandler.submitAnswer({
        sessionId: state.sessionId,
        bindingKey: state.currentQuestion.correctAnswer,
        description: state.currentQuestion.question,
        category: state.selectedCategory || 'All',
        selectedAnswer: answer,
      });

      setState(prev => ({
        ...prev,
        result,
        showResult: true,
        showAnswerModal: true,
        isLoading: false,
        allResults: [...prev.allResults, result],
        lastCorrectAnswer: prev.currentQuestion?.correctAnswer || '',
        lastQuestionDescription: prev.currentQuestion?.question || '',
      }));
    } catch (error) {
      console.error('回答送信エラー:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startPractice = async (category?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const sessionId = await practiceHandler.startPracticeSession({ category });
      const question = practiceHandler.getRandomQuestion(category);
      
      if (!question) {
        // 問題がない場合
        setState(prev => ({ ...prev, isLoading: false }));
        alert('選択したカテゴリに問題がありません');
        return;
      }
      
      setState(prev => ({
        ...prev,
        sessionId,
        currentQuestion: question,
        selectedCategory: category || null,
        isLoading: false,
        showResult: false,
        result: null,
        pressedKeys: [],
        usedQuestions: [question.correctAnswer],
        allResults: [],
        showAnswerModal: false,
        showResultModal: false,
        lastCorrectAnswer: '',
        lastQuestionDescription: '',
        timeRemaining: 5,
        isTimerRunning: true,
      }));
    } catch (error) {
      console.error('練習開始エラー:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };


  const nextQuestion = useCallback(() => {
    if (!state.sessionId) return;

    const question = practiceHandler.getRandomQuestion(
      state.selectedCategory || undefined,
      state.usedQuestions
    );
    
    if (!question) {
      // 全問題終了した場合
      setState(prev => ({ 
        ...prev, 
        showAnswerModal: false,
        showResultModal: true 
      }));
      return;
    }
    
    setState(prev => ({
      ...prev,
      currentQuestion: question,
      showResult: false,
      showAnswerModal: false,
      result: null,
      pressedKeys: [],
      usedQuestions: [...prev.usedQuestions, question.correctAnswer],
      timeRemaining: 5,
      isTimerRunning: true,
    }));
  }, [state.sessionId, state.selectedCategory, state.usedQuestions]);

  const resetPractice = () => {
    setState({
      sessionId: null,
      currentQuestion: null,
      result: null,
      selectedCategory: null,
      isLoading: false,
      showResult: false,
      pressedKeys: [],
      usedQuestions: [],
      showAnswerModal: false,
      showResultModal: false,
      allResults: [],
      lastCorrectAnswer: '',
      lastQuestionDescription: '',
      timeRemaining: 5,
      isTimerRunning: false,
    });
  };

  const finishPractice = () => {
    setState(prev => ({ ...prev, showResultModal: true }));
  };

  // タイマー処理
  useEffect(() => {
    if (state.isTimerRunning && state.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state.isTimerRunning && state.timeRemaining === 0) {
      // 時間切れ処理
      setState(prev => ({ ...prev, isTimerRunning: false }));
      checkAnswer(state.pressedKeys.join(''));
    }
  }, [state.isTimerRunning, state.timeRemaining, state.pressedKeys]);

  // Enterキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && state.showAnswerModal) {
        e.preventDefault();
        nextQuestion();
      }
    };

    if (state.showAnswerModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.showAnswerModal, nextQuestion]);


  if (state.isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!state.sessionId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">練習モードを選択</h2>
          <p className="text-gray-600">練習したいカテゴリを選んでください</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => startPractice()}
            className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-white">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">全てのショートカット</h3>
              <p className="text-sm opacity-90">全カテゴリから出題</p>
              <div className="mt-3 text-sm opacity-75">
                {vimiumBindings.length}個のショートカット
              </div>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
          </button>
          
          {categories.map((category) => {
            const categoryIcons: { [key: string]: string } = {
              'ページナビゲーション': '🧭',
              'リンク・ページ操作': '🔗',
              'URL・ブラウジング': '🌐',
              'タブ管理': '📑',
              '履歴': '📚',
              '検索': '🔍',
              'マーク': '📌',
            };
            const categoryCount = vimiumBindings.filter(b => b.category === category).length;
            
            return (
              <button
                key={category}
                onClick={() => startPractice(category)}
                className="group relative bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-gray-800">
                  <div className="text-4xl mb-3">{categoryIcons[category] || '📋'}</div>
                  <h3 className="text-lg font-bold mb-2">{category}</h3>
                  <div className="text-sm text-gray-500">
                    {categoryCount}個のショートカット
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity"></div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>キーボードショートカットを入力して回答してください</span>
          </div>
        </div>
      </div>
    );
  }

  if (state.currentQuestion && !state.showAnswerModal && !state.showResultModal) {
    const totalQuestions = state.selectedCategory 
      ? vimiumBindings.filter(b => b.category === state.selectedCategory).length
      : vimiumBindings.length;
    const currentQuestionNumber = state.usedQuestions.length;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {state.selectedCategory || '全カテゴリ'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600">
                  第{currentQuestionNumber}問
                </span>
                <span className="text-sm text-gray-400">
                  / {totalQuestions}問
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                state.timeRemaining <= 2 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">{state.timeRemaining}秒</span>
              </div>
              {state.allResults.length > 0 && (
                <span className="text-sm text-gray-500">
                  正解率: {Math.round((state.allResults.filter(r => r.isCorrect).length / state.allResults.length) * 100)}%
                </span>
              )}
            </div>
          </div>
          
          {/* プログレスバー */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            この機能のキーボードショートカットは？
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-lg text-blue-800 font-medium">
              {state.currentQuestion.question}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <VirtualKeyboard 
            onKeyPress={handleKeyPress}
            pressedKeys={state.pressedKeys}
            allowedKeys={state.currentQuestion.options.map(opt => opt.key)}
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            入力された文字: <span className="font-mono text-lg font-bold text-blue-600">
              {state.pressedKeys.join('')} ({state.pressedKeys.length}/{state.currentQuestion?.correctAnswer.length})
            </span>
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={clearInput}
            className="px-6 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            クリア
          </button>
          <button
            onClick={finishPractice}
            className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            練習を終了
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 回答結果モーダル */}
      <Modal 
        isOpen={state.showAnswerModal && state.result !== null}
        onClose={nextQuestion}
        size="sm"
      >
        {state.result && (
          <div className="text-center">
            <div className={`text-6xl mb-4 ${state.result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {state.result.isCorrect ? '✓' : '✗'}
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${state.result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {state.result.isCorrect ? '正解！' : '不正解'}
            </h2>
            {!state.result.isCorrect && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-600 mb-2">
                  <strong>問題:</strong> {state.lastQuestionDescription}
                </p>
                <p className="text-gray-600">
                  <strong>正解:</strong> <span className="font-mono font-bold text-blue-600">{state.lastCorrectAnswer}</span>
                </p>
              </div>
            )}
            <button
              onClick={nextQuestion}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              次の問題へ (Enter)
            </button>
          </div>
        )}
      </Modal>

      {/* 最終結果モーダル */}
      <Modal 
        isOpen={state.showResultModal}
        onClose={resetPractice}
        size="md"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">練習結果</h2>
          
          {state.allResults.length > 0 ? (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {state.allResults.length}
                    </div>
                    <div className="text-sm text-gray-600">総問題数</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {state.allResults.filter(r => r.isCorrect).length}
                    </div>
                    <div className="text-sm text-gray-600">正解数</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round((state.allResults.filter(r => r.isCorrect).length / state.allResults.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">正解率</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-700">カテゴリ: {state.selectedCategory || '全て'}</h3>
                <p className="text-gray-600">お疲れ様でした！全ての問題を出題しました。</p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mb-6">練習を中断しました。</p>
          )}

          <button
            onClick={resetPractice}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            練習を終了
          </button>
        </div>
      </Modal>
    </>
  );
}