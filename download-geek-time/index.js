var TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');
const write = require('write');
const config = require('./config');

const { getArticle, getChaptersList } = require('./utils/fetch');

var turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '*',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  preformattedCode: true,
});

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function download(list) {
  const chaptersList = [].concat(list).reverse();
  let article = chaptersList.shift();
  const errorIds = [];
  console.log('开始抓取内容');
  console.log('----------------------');
  while (article) {
    const { bookName, content, title } = await getArticle(config.cookie, article.id).catch((err) => {
      errorIds.push([article.id, err]);

      return {
        bookName: '',
        content: '',
        title: '',
      };
    });
    console.log(bookName, title);
    if (content) {
      const markdown = turndownService.turndown(content);
      await write(path.resolve(__dirname, `./books/${bookName}/${String(title).replace(/\//g, '-')}.md`), markdown, {
        overwrite: true,
      }).catch((err) => {
        console.error(`【失败】: "${title}"`);
      });
      // console.log(title);
    }
    await sleep(3000);
    article = chaptersList.shift();
  }

  console.log('errorIds', errorIds);
}

async function main() {
  console.log('开始抓取');
  const { bookId } = await getArticle(config.cookie, config.articleId);
  const chaptersList = await getChaptersList(config.cookie, bookId);
  console.log(
    '获取书本列表',
    chaptersList.map((c) => c.id),
  );
  await download(chaptersList);
}

main();
