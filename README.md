# TrashLens-Terms

Markdown で管理している規約・プライバシーポリシーを、共通テンプレートで静的 HTML に変換して `build/` に出力するツールです。

現在は TrashLens／Collector／LG-Admin のドキュメントを出力対象に設定しています。

## 機能概要

- `scripts/convert.js` を実行すると以下を行います:
  - `build/` および `build/css/` を作成（存在しない場合）
  - `src/css/styles.css` を `build/css/styles.css` にコピー
  - 下記 Markdown を `marked` で HTML 化し、共通テンプレートに流し込んで `build/` に保存
  - ルートの `index.html` を `build/index.html` にコピー（存在する場合）

共通テンプレートには Google Fonts と `build/css/styles.css` へのリンク、ヘッダー/フッターが含まれます。

## 入力と出力

- 入力（既定の対象）

  - `TrashLens/privacy_policy.md` → `build/TrashLens-privacy_policy.html`
  - `TrashLens/Terms_of_service.md` → `build/TrashLens-Terms_of_service.html`
  - `Collector/privacy_policy.md` → `build/Collector-privacy_policy.html`
  - `Collector/Terms_of_service.md` → `build/Collector-Terms_of_service.html`
  - `LG-Admin/privacy_policy.md` → `build/LG-Admin-privacy_policy.html`
  - `LG-Admin/Terms_of_service.md` → `build/LG-Admin-Terms_of_service.html`

- 併せて出力されるファイル
  - `build/css/styles.css`（`src/css/styles.css` のコピー）
  - `build/index.html`（ルートの `index.html` をコピー。存在しない場合はスキップされ、エラーログのみ出力）

## セットアップ

1. 依存をインストール

```sh
npm install
```

2. 変換を実行（Markdown → HTML）

```sh
npm start
# または
node scripts/convert.js
```

完了すると、`build/` 配下に HTML と CSS が出力されます。

## 依存関係

- Node.js（18+ 推奨）
- npm
- ライブラリ
  - `marked`（Markdown → HTML 変換）
  - `fs-extra`（ファイル/ディレクトリ操作ユーティリティ）

`package.json` のスクリプト:

```json
{
  "scripts": {
    "start": "node scripts/convert.js"
  }
}
```

## 新しいサービスを出力対象に追加する

1. ルートにサービス用ディレクトリを用意し（例: `LG-Admin/`）、`privacy_policy.md` と `Terms_of_service.md` を配置します。
2. `scripts/convert.js` の `markdownFiles` 配列に以下の形式で追加します。

```js
{ path: path.join(baseDir, 'NewService', 'privacy_policy.md'), outputName: 'NewService-privacy_policy.html', title: 'NewService プライバシーポリシー' },
{ path: path.join(baseDir, 'NewService', 'Terms_of_service.md'), outputName: 'NewService-Terms_of_service.html', title: 'NewService 利用規約' }
```

保存後に再度 `npm start` を実行すると、`build/` 配下に LG-Admin の HTML も生成されます。

## ローカルプレビュー（任意）

静的サーバーで `build/` を配信すると、ブラウザで確認できます。例として Python の簡易サーバー:

```sh
cd build
python3 -m http.server 8080
```

または VS Code の拡張（Live Server 等）を利用してください。

## よくあるエラーと対処

- 指定した Markdown が存在しない/パスが誤っている
  - `scripts/convert.js` の `markdownFiles` のパスとファイル名を確認してください。
- `src/css/styles.css` が見つからない
  - ファイルの存在を確認し、必要なら作成/コピーしてください。
- `index.html` のコピーでエラー
  - ルートの `index.html` が存在しない場合はスキップされます。必要に応じて作成してください。
- 生成物の上書き
  - `build/` 配下のファイルは上書きされます。履歴管理が必要な場合はコミット方針を決めるか、`build/` を `.gitignore` 対象にしてください。

## 開発時の小ネタ（任意）

- 監視して自動変換したい場合は、`nodemon` や `chokidar-cli` を利用して `.md` と `src/css` の変更で `npm start` をトリガーするのが手軽です。
