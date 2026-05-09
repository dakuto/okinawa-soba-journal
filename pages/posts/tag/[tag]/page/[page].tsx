import {
  getPostsByTagAndPage,
  getNumberOfPagesByTag,
  getAllTags,
  getAllPosts,
} from "../../../../../lib/notionAPI";
import Head from "next/head";
import React from "react";
import SinglePost from "../../../../../components/Post/SinglePost";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import Pagenation from "../../../../../components/Pagenation/Pagenation";

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

interface BlogTagPageListProps {
  numberOfPagesByTag: number;
  posts: Post[];
  currentTag: string;
  currentPage: number;
  allTags: string[];
  latestPosts: Post[];
}

// getStaticPaths用のパラメータ型
interface TagPagePath {
  params: {
    tag: string;
    page: string;
  };
}

// ------------------------------------------------

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags();
  let params: TagPagePath[] = [];

  await Promise.all(
    allTags.map((tag: string) => {
      return getNumberOfPagesByTag(tag).then((numberOfPagesByTag: number) => {
        for (let i = 1; i <= numberOfPagesByTag; i++) {
          params.push({ params: { tag: tag, page: i.toString() } });
        }
      });
    }),
  );

  return {
    paths: params,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = parseInt(context.params?.page as string, 10);
  const currentTag = context.params?.tag as string;

  // タグの頭文字を大文字にする処理（Notion側のタグ名との一致確認用）
  const upperCaseCurrentTag =
    currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagAndPage(currentTag, currentPage);
  const numberOfPagesByTag = await getNumberOfPagesByTag(upperCaseCurrentTag);
  const allTags = await getAllTags();
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 4);

  return {
    props: {
      posts,
      numberOfPagesByTag,
      currentTag,
      currentPage,
      allTags,
      latestPosts,
    },
    revalidate: 60,
  };
};

const BlogTagPageList: React.FC<BlogTagPageListProps> = ({
  numberOfPagesByTag,
  posts,
  currentTag,
  currentPage,
  allTags,
  latestPosts,
}) => {
  return (
    <div className="container mx-auto h-full w-full">
      <Head>
        <title>{currentTag} の記事一覧 | 沖縄そば週末記</title>
        <meta
          name="description"
          content={`タグ「${currentTag}」の沖縄そば巡り記事一覧です。`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Tag Search
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-ryukyu-deep-sea mb-4 flex items-center gap-2">
            <span className="text-ryukyu-coral font-black">#</span>
            {currentTag}
          </h1>

          <p className="text-ryukyu-text-light text-base">
            「
            <span className="font-bold text-ryukyu-deep-sea">{currentTag}</span>
            」に関する記事が
            <span className="mx-1 font-bold text-ryukyu-coral">
              {posts.length}
            </span>
            件見つかりました。
          </p>
        </div>
      </div>

      <main className="container w-full">
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

        <Pagenation
          numberOfPages={numberOfPagesByTag}
          tag={currentTag}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
};

export default BlogTagPageList;
