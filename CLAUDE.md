# CLAUDE.md

## Language Instructions

- 必ず日本語でやりとりしてください

## Project Status

vimium-trainer は、Vimium ブラウザ拡張機能のキーボードショートカットを練習するためのプロジェクトです。

## Development Guidelines

### ビルドコマンド
- `pnpm build` - プロダクションビルド
- `pnpm dev` - 開発サーバー起動
- `pnpm start` - プロダクションサーバー起動
- `pnpm lint` - ESLint実行（未設定）

### テストコマンド
- テストフレームワークは未設定

### 開発サーバーの起動方法
```bash
pnpm dev
```

### プロジェクトの主要な構造とアーキテクチャ

**Clean Architecture（resume-crafterを参考）**

```
app/
├── page.tsx                    🟦 ホームページ（Server Component）
└── practice/
    ├── page.tsx                🟦 練習ページ（Server Component）
    ├── PracticeClient.tsx      🟦 クライアントコンポーネント
    └── action.ts               🟦 Server Action

src/
├── domain/
│   ├── practice/
│   │   ├── practice.ts         🟥 Entity
│   │   ├── practiceId.ts       🟥 Value Object
│   │   └── keyBinding.ts       🟥 Value Object
│   └── session/
│       ├── session.ts          🟥 Entity
│       └── sessionId.ts        🟥 Value Object
├── application/
│   └── practice/
│       ├── IPracticeUseCase.ts 🟧 UseCase 抽象
│       └── PracticeInteractor.ts 🟧 UseCase 実装
├── repositories/
│   ├── ISessionRepository.ts   🟩 Repository 抽象
│   └── IPracticeRepository.ts  🟩 Repository 抽象
├── presenters/
│   └── practice/
│       ├── IPracticePresenter.ts 🟩 Presenter 抽象
│       └── PracticePresenter.ts  🟩 Presenter 実装
├── handlers/
│   └── practiceHandler.ts      🟩 Handler
├── schemas/
│   └── practiceSchema.ts       🟦 Validation Schema（zod）
├── dtos/
│   └── practice/
│       ├── practiceDto.ts      🟩 Input DTO
│       └── practiceViewModel.ts 🟩 Output DTO
├── infrastructure/
│   └── repository/
│       ├── sessionRepository.ts 🟦 Repository 実装（LocalStorage）
│       └── practiceRepository.ts 🟦 Repository 実装（LocalStorage）
└── data/
    └── vimiumBindings.ts       🟦 Vimiumキーバインディングデータ
```

### 技術スタック
- Next.js 15.3.4 + TypeScript
- Tailwind CSS 4.1.11
- Zod 3.25.67（バリデーション）
- LocalStorage（データ永続化）
