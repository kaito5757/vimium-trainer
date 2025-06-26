export interface VimiumBinding {
  key: string;
  description: string;
  category: string;
}

export const vimiumBindings: VimiumBinding[] = [
  // ページナビゲーション
  { key: 'h', description: '左にスクロール', category: 'ページナビゲーション' },
  { key: 'j', description: '下にスクロール', category: 'ページナビゲーション' },
  { key: 'k', description: '上にスクロール', category: 'ページナビゲーション' },
  { key: 'l', description: '右にスクロール', category: 'ページナビゲーション' },
  { key: 'gg', description: 'ページの最上部へスクロール', category: 'ページナビゲーション' },
  { key: 'G', description: 'ページの最下部へスクロール', category: 'ページナビゲーション' },
  { key: 'd', description: 'ページの半分下にスクロール', category: 'ページナビゲーション' },
  { key: 'u', description: 'ページの半分上にスクロール', category: 'ページナビゲーション' },
  { key: 'zH', description: '一番左端までスクロール', category: 'ページナビゲーション' },
  { key: 'zL', description: '一番右端までスクロール', category: 'ページナビゲーション' },

  // リンク・ページ操作
  { key: 'f', description: '現在のタブでリンクを開く', category: 'リンク・ページ操作' },
  { key: 'F', description: '新しいタブでリンクを開く', category: 'リンク・ページ操作' },
  { key: '<a-f>', description: '複数のリンクを新しいタブで開く', category: 'リンク・ページ操作' },
  { key: 'gi', description: '最初のテキスト入力ボックスにフォーカス', category: 'リンク・ページ操作' },
  { key: 'r', description: 'ページを再読み込み', category: 'リンク・ページ操作' },
  { key: 'R', description: 'ページを強制再読み込み（キャッシュを無視）', category: 'リンク・ページ操作' },
  { key: 'gs', description: 'ページのソースを表示', category: 'リンク・ページ操作' },

  // URL・ブラウジング
  { key: 'o', description: 'URL、ブックマーク、履歴を開く', category: 'URL・ブラウジング' },
  { key: 'O', description: 'URLを新しいタブで開く', category: 'URL・ブラウジング' },
  { key: 'b', description: 'ブックマークを開く', category: 'URL・ブラウジング' },
  { key: 'B', description: 'ブックマークを新しいタブで開く', category: 'URL・ブラウジング' },
  { key: 'gu', description: 'URLの一つ上の階層に移動', category: 'URL・ブラウジング' },
  { key: 'gU', description: 'URLのルートに移動', category: 'URL・ブラウジング' },
  { key: 'ge', description: '現在のURLを編集', category: 'URL・ブラウジング' },
  { key: 'gE', description: '現在のURLを新しいタブで編集', category: 'URL・ブラウジング' },

  // タブ管理
  { key: 'J', description: '左のタブに移動', category: 'タブ管理' },
  { key: 'gT', description: '左のタブに移動', category: 'タブ管理' },
  { key: 'K', description: '右のタブに移動', category: 'タブ管理' },
  { key: 'gt', description: '右のタブに移動', category: 'タブ管理' },
  { key: 'g0', description: '最初のタブに移動', category: 'タブ管理' },
  { key: 'g$', description: '最後のタブに移動', category: 'タブ管理' },
  { key: '^', description: '前に開いていたタブに移動', category: 'タブ管理' },
  { key: 't', description: '新しいタブを作成', category: 'タブ管理' },
  { key: 'yt', description: '現在のタブを複製', category: 'タブ管理' },
  { key: 'x', description: '現在のタブを閉じる', category: 'タブ管理' },
  { key: 'X', description: '閉じたタブを復元', category: 'タブ管理' },
  { key: 'T', description: '開いているタブを検索', category: 'タブ管理' },
  { key: 'W', description: 'タブを新しいウィンドウに移動', category: 'タブ管理' },
  { key: '<a-p>', description: '現在のタブをピン留め/解除', category: 'タブ管理' },

  // 履歴
  { key: 'H', description: '履歴で戻る', category: '履歴' },
  { key: 'L', description: '履歴で進む', category: '履歴' },

  // 検索
  { key: '/', description: '検索モードに入る', category: '検索' },
  { key: 'n', description: '次の検索結果に移動', category: '検索' },
  { key: 'N', description: '前の検索結果に移動', category: '検索' },

  // マーク
  { key: 'ma', description: 'ローカルマークを設定', category: 'マーク' },
  { key: 'mA', description: 'グローバルマークを設定', category: 'マーク' },
  { key: '`a', description: 'ローカルマークにジャンプ', category: 'マーク' },
  { key: '`A', description: 'グローバルマークにジャンプ', category: 'マーク' },
];

export const categories = Array.from(new Set(vimiumBindings.map(b => b.category)));