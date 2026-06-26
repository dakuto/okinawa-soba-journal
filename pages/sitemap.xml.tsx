import { GetServerSideProps } from "next";
import { getAllPosts } from "../lib/notionAPI"; // 💡 index.tsxと同じインポート元です

const BASE_URL = "https://okinawa-soba-journal.vercel.app";

// サイトマップのXML文字列を組み立てる関数
function generateSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${posts
       .map((post) => {
         return `
       <url>
           <loc>${BASE_URL}/posts/${post.slug}</loc>
           <lastmod>${post.date}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

// 画面を描画する代わりに見せかけのコンポーネントを置く（実際には使われません）
export default function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // NotionAPIから全記事を取得
    const posts = await getAllPosts();

    // XMLを生成
    const sitemap = generateSiteMap(posts);

    // レスポンスヘッダーをXML形式に設定してブラウザに返す
    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("サイトマップ生成エラー:", error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
};
