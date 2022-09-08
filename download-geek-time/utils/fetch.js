const fetch = require('node-fetch');
const { cookie } = require('../config');

async function ajax(options) {
  const { url, cookie, body } = options;
  const fetching = await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      cookie,
      Referer: 'https://time.geekbang.org/column/article/538739',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
    body,
    method: 'POST',
  });
  return await fetching.json();
}

// 获取文章详情
async function getArticle(cookie, id) {
  const response = await ajax({
    url: 'https://time.geekbang.org/serv/v1/article',
    cookie,
    body: `{"id":"${id}","include_neighbors":true,"is_freelyread":true}`,
  });
  console.log(response);
  return {
    content: response?.data?.article_content,
    title: response?.data?.article_title,
    bookId: response?.data?.cid,
    bookName: response?.data?.share?.title,
  };
}

// 获取文章目录
async function getChaptersList(cookie, bookId) {
  const chaptersListResponse = await ajax({
    url: 'https://time.geekbang.org/serv/v1/chapters',
    cookie,
    body: `{"cid": ${bookId}}`,
  });

  const chapterIds = (chaptersListResponse?.data || []).map((item) => item.id);

  const response = await ajax({
    url: 'https://time.geekbang.org/serv/v1/column/articles',
    cookie,
    body: JSON.stringify({
      cid: bookId,
      size: 100,
      prev: 0,
      order: 'earliest',
      sample: 'false',
      chapter_ids: chapterIds,
    }),
  });
  return response?.data?.list || [];
}

// getArticle(cookie, "376532");

module.exports = {
  getArticle,
  getChaptersList,
};
