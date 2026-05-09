import Link from "next/link";
import Head from "next/head";
import { GetStaticProps } from "next";
import { getAllPosts, getAllTags } from "../lib/notionAPI"; // パスは環境に合わせて調整してください

// propsの型定義
interface Props {
  allTags: string[];
  allPosts: any[];
  latestPosts: any[];
}

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <Head>
        <title>ページが見つかりません | 沖縄そば週末記</title>
      </Head>

      {/* 視覚的なインパクト */}
      <h1 className="text-9xl font-bold text-ryukyu-coral/20 mb-[-2rem]">
        404
      </h1>

      <div className="z-10">
        <p className="text-2xl font-bold text-ryukyu-deep-sea mb-4">
          お探しのそば（ページ）は見つかりませんでした...
        </p>
        <p className="text-ryukyu-text-light mb-10">
          URLが間違っているか、記事が非公開になった可能性があります。
        </p>

        <div className="mb-12 animate-bounce">
          <span className="text-7xl block">🍜</span>
        </div>

        <Link
          href="/"
          className="px-12 py-4 bg-ryukyu-deep-sea text-ryukyu-washi rounded-full font-bold shadow-xl hover:bg-ryukyu-coral transition-all duration-300 transform hover:-translate-y-1 inline-block"
        >
          ← 記事一覧（トップ）に戻る
        </Link>
      </div>
    </div>
  );
};

// Layoutに「hideLayout: true」を渡すためのデータ取得
export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();
  const latestPosts = allPosts.slice(0, 4);

  return {
    props: {
      allPosts,
      allTags,
      latestPosts,
      hideLayout: true, // ✨ これが Layout.tsx の hideLayout プロパティに渡ります
    },
  };
};

export default Custom404;
