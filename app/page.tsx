import Link from 'next/link';
import { categories } from '@/data/vimiumBindings';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Vimium Trainer
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Vimiumブラウザ拡張機能のキーボードショートカットを効率的に習得しましょう。
            インタラクティブな練習問題で、すべてのショートカットをマスターできます。
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">効率的な学習</h3>
              <p className="text-gray-600">
                カテゴリ別の練習モードで、段階的にスキルを向上させることができます。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">進捗追跡</h3>
              <p className="text-gray-600">
                正解率や習熟度を追跡して、弱点を把握し重点的に練習できます。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">練習カテゴリ</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/practice"
            className="inline-block bg-blue-600 text-white text-xl font-semibold px-12 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            練習を始める
          </Link>
        </div>
      </div>
    </div>
  );
}
