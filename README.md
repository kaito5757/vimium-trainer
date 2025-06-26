# Vimium Trainer

Vimium ブラウザ拡張機能のキーボードショートカットを練習するためのWebアプリケーションです。

## 特徴

- 🎯 **44種類のVimiumショートカット**を7つのカテゴリに分けて学習
- ⌨️ **実際のキーボード入力**による練習システム
- 🎨 **バーチャルキーボードUI**でリアルタイム入力確認
- 📊 **進捗追跡**と正解率表示
- 📱 **モダンなUI/UX**（モーダル、プログレスバー等）
- 🔄 **重複問題回避**機能
- 🏗️ **クリーンアーキテクチャ**採用

## 技術スタック

- **Next.js 15.3.4** (App Router)
- **TypeScript**
- **Tailwind CSS 4.1.11**
- **Zod** (バリデーション)
- **pnpm** (パッケージマネージャー)

## アーキテクチャ

```
src/
├── domain/           # ドメイン層
├── application/      # アプリケーション層
├── presenters/       # プレゼンター層
├── infrastructure/   # インフラストラクチャー層
├── handlers/         # ハンドラー層
├── components/       # UIコンポーネント
└── data/            # データ定義
```

## カテゴリ

1. **ページナビゲーション** - スクロール、移動系
2. **リンク・ページ操作** - リンク操作、ページ制御
3. **URL・ブラウジング** - URL操作、ナビゲーション
4. **タブ管理** - タブの作成、切り替え、操作
5. **履歴** - 履歴の前進、後退
6. **検索** - ページ内検索、検索機能
7. **マーク** - ブックマーク、マーク機能

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/kaito5757/vimium-trainer.git
cd vimium-trainer

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 使い方

1. トップページでカテゴリを選択（または全てのショートカットを選択）
2. 問題が表示されたら、該当するキーボードショートカットを入力
3. 正解・不正解がモーダルで表示
4. Enterキーで次の問題に進む
5. 全問題終了後、結果を確認

## 開発者向け

### コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# 型チェック
pnpm type-check

# Lint
pnpm lint
```

### プロジェクト構造

- `app/` - Next.js App Router ページ
- `src/domain/` - ビジネスロジック
- `src/application/` - ユースケース
- `src/infrastructure/` - データ永続化
- `src/components/` - 再利用可能コンポーネント

## ライセンス

MIT License
