/**
 * マークダウンファイルをHTMLに変換するスクリプト
 * TrashLens-LPのスタイルを参考にしたHTMLを生成します
 */

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

const baseDir = path.resolve(__dirname, '..');
const htmlOutputDir = path.join(baseDir, 'build');

const markdownFiles = [
  { path: path.join(baseDir, 'TrashLens', 'privacy_policy.md'), outputName: 'TrashLens-privacy_policy.html', title: 'TrashLens プライバシーポリシー' },
  { path: path.join(baseDir, 'TrashLens', 'Terms_of_service.md'), outputName: 'TrashLens-Terms_of_service.html', title: 'TrashLens 利用規約' },
  { path: path.join(baseDir, 'Collector', 'privacy_policy.md'), outputName: 'Collector-privacy_policy.html', title: 'TrashLens Collector プライバシーポリシー' },
  { path: path.join(baseDir, 'Collector', 'Terms_of_service.md'), outputName: 'Collector-Terms_of_service.html', title: 'TrashLens Collector 利用規約' }
];

/**
 * HTMLテンプレートを生成する関数
 * @param {string} title - HTMLのタイトル
 * @param {string} content - マークダウンから変換されたHTMLコンテンツ
 * @returns {string} 完成したHTML
 */
function createHtmlTemplate(title, content) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header class="header">
        <h1>${title}</h1>
    </header>
    
    <main>
        <div class="container">
            ${content}
        </div>
    </main>
    
    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} Trash Lens 株式会社</p>
        <p>お問い合わせ: yamamoto@trashlens.co.jp</p>
    </footer>
</body>
</html>`;
}

/**
 * マークダウンファイルをHTMLに変換する関数
 * @param {string} filePath - マークダウンファイルのパス
 * @param {string} outputPath - 出力するHTMLファイルのパス
 * @param {string} title - HTMLのタイトル
 * @returns {Promise<void>}
 */
async function convertMarkdownToHtml(filePath, outputPath, title) {
  try {
    const markdownContent = await fs.readFile(filePath, 'utf-8');
    
    const htmlContent = marked(markdownContent);
    
    const fullHtml = createHtmlTemplate(title, htmlContent);
    
    await fs.writeFile(outputPath, fullHtml, 'utf-8');
    
    console.log(`変換完了: ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`エラー: ${filePath} の変換に失敗しました`, error);
  }
}

/**
 * CSSファイルをコピーする関数
 * @returns {Promise<void>}
 */
async function copyCssFile() {
  try {
    const srcCssPath = path.join(baseDir, 'src', 'css', 'styles.css');
    const destCssPath = path.join(htmlOutputDir, 'css', 'styles.css');
    
    await fs.copy(srcCssPath, destCssPath);
    console.log(`CSSファイルをコピーしました: ${srcCssPath} -> ${destCssPath}`);
  } catch (error) {
    console.error('CSSファイルのコピー中にエラーが発生しました:', error);
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    await fs.ensureDir(htmlOutputDir);
    console.log(`出力ディレクトリを確認しました: ${htmlOutputDir}`);
    
    await fs.ensureDir(path.join(htmlOutputDir, 'css'));
    
    await copyCssFile();
    
    for (const file of markdownFiles) {
      const outputPath = path.join(htmlOutputDir, file.outputName);
      await convertMarkdownToHtml(file.path, outputPath, file.title);
    }
    
    console.log('全ファイルの変換が完了しました！');
  } catch (error) {
    console.error('変換処理中にエラーが発生しました:', error);
  }
}

main();
