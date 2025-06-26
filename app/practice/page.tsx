import { PracticeClient } from './PracticeClient';

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Vimium キーボードショートカット練習
          </h1>
          
          <PracticeClient />
        </div>
      </div>
    </div>
  );
}