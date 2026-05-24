import { getAllPosts, getAllTags } from "../../../../lib/notionAPI";
import Head from "next/head";
import React from "react";
import SinglePost from "../../../../components/Post/SinglePost";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";

// --- ✨ 型定義 ---
interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
}

interface BlogArchivePageListProps {
  posts: Post[];
  year: string;
  month: string;
  allTags: string[];
  latestPosts: Post[];
  totalPostsCount: number;
  allPosts: Post[];
}

// ------------------------------------------------

// ✨ [month].tsx というファイル名に完全に合わせた getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths: { params: { year: string; month: string } }[] = [];

  allPosts.forEach((post) => {
    if (post.date) {
      const [year, month] = post.date.split("-");
      if (year && month) {
        // 重複しないようにパスを追加
        const isExist = paths.some(
          (p) => p.params.year === year && p.params.month === month,
        );
        if (!isExist) {
          paths.push({ params: { year, month } });
        }
      }
    }
  });

  return {
    paths,
    fallback: "blocking",
  };
};

// ✨ [month].tsx というファイル名に完全に合わせた getStaticProps
export const getStaticProps: GetStaticProps = async (context) => {
  const year = context.params?.year as string;
  const month = context.params?.month as string;

  const allPosts = await getAllPosts();
  const allTags = await getAllTags();
  const latestPosts = allPosts.slice(0, 4);

  // 開かれた年月に合致する記事だけを抽出
  const filteredPosts = allPosts.filter((post) => {
    if (!post.date) return false;
    const [pYear, pMonth] = post.date.split("-");
    return pYear === year && pMonth === month;
  });

  const totalPostsCount = filteredPosts.length;

  return {
    props: {
      posts: filteredPosts,
      year,
      month,
      allTags,
      latestPosts,
      totalPostsCount,
      allPosts,
    },
    revalidate: 60,
  };
};

const BlogArchivePageList: React.FC<BlogArchivePageListProps> = ({
  posts,
  year,
  month,
  totalPostsCount,
}) => {
  const displayDate = `${year}年${month}月`;

  return (
    <div className="container mx-auto h-full w-full">
      <Head>
        <title>{displayDate} の記事一覧 | 沖縄そば週末記</title>
        <meta
          name="description"
          content={`${displayDate}に投稿された沖縄そば巡り記事一覧です。`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* タグページと完全に統一した琉球モダンヘッダー */}
      <div className="relative overflow-hidden mb-12 bg-ryukyu-deep-sea-light border-2 border-ryukyu-border rounded-xl p-4 sm:p-6 shadow-sm group">
        {/* 背景の巨大アイコン */}
        <div className="absolute -bottom-[4.5rem] -right-10 w-[15rem] sm:w-[20rem] aspect-square opacity-[0.08] rotate-[-15deg] select-none pointer-events-none">
          <Image
            src="/images/okinawasoba-image.png"
            alt="沖縄そば週末記 ロゴ"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-ryukyu-deep-sea mb-4 opacity-80">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Archive Search
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-ryukyu-deep-sea mb-4 flex items-center gap-2">
            <span className="text-ryukyu-coral font-black">📅</span>
            {displayDate}
          </h1>

          <p className="text-ryukyu-text-light text-base">
            「
            <span className="font-bold text-ryukyu-deep-sea">
              {displayDate}
            </span>
            」に投稿された記事が
            <span className="mx-1 font-bold text-ryukyu-coral">
              {totalPostsCount}
            </span>
            件見つかりました。
          </p>
        </div>
      </div>

      <main className="container w-full">
        {/* 2カラムで綺麗に並ぶ記事リストカード群 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-0 mb-10">
          {posts.map((post) => (
            <div className="flex w-full" key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPageList={true}
                thumbnail={post.thumbnail}
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default BlogArchivePageList;
