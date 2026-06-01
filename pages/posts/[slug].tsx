import React from "react";
import Head from "next/head";
import {
  getAllPosts,
  getSinglePost,
  getPageBlocks,
  getAllTags,
} from "../../lib/notionAPI";
import Link from "next/link";
import { NotionRenderer } from "../../components/NotionRenderer";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";

// --- ✨ 型定義 (TypeScriptの波線を消すための設定) ---
interface PostMetadata {
  id: string;
  title: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail: string;
  published: boolean;
}

interface PostData {
  metadata: PostMetadata;
}

interface NeighborPost {
  title: string;
  slug: string;
  thumbnail: string;
}

interface PostProps {
  post: PostData;
  blocks: any;
  prevPost: NeighborPost | null;
  nextPost: NeighborPost | null;
  allTags: string[];
  latestPosts: PostMetadata[];
  allPosts: any[];
}

// ------------------------------------------------

// Notionページのルーティング設定
export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));
  return {
    paths,
    fallback: "blocking",
  };
};

// Notionページのデータ取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const allPosts = await getAllPosts();
  const slug = params?.slug as string;
  const post = await getSinglePost(slug);

  // ✨ もし記事が見つからない（非公開設定になった）場合は404ページへ飛ばす
  if (!post) {
    return {
      notFound: true,
    };
  }

  const currentIndex = allPosts.findIndex((post) => post.slug === slug);
  const prevPost = allPosts[currentIndex - 1] || null;
  const nextPost = allPosts[currentIndex + 1] || null;

  // const post = await getSinglePost(slug);
  const blocks = await getPageBlocks(post.metadata.id);
  const allTags = await getAllTags();
  const latestPosts = allPosts.slice(0, 4);

  return {
    props: {
      post,
      blocks,
      prevPost,
      nextPost,
      allTags,
      latestPosts,
      allPosts,
    },
    revalidate: 60,
  };
};

// ページ描画コンポーネント
const Post: React.FC<PostProps> = ({
  post,
  blocks,
  prevPost,
  nextPost,
  allTags,
  latestPosts,
  allPosts,
}) => {
  return (
    <section className="container lg:px-2 mx-auto my-4 md:my-10">
      <Head>
        <title>{`${post.metadata.title} | 沖縄そば週末記`}</title>
        <meta
          name="description"
          content={`${post.metadata.title}の紹介ページです。`}
        />
      </Head>
      {/* --- ✨ メインビジュアル --- */}
      <div className="mb-10 mx-auto max-w-5xl px-0 relative group">
        <div className="aspect-[21/9] w-full overflow-hidden relative">
          <Image
            src={post.metadata.thumbnail}
            alt={post.metadata.title}
            fill
            className="object-cover rounded-xl shadow-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
          />
        </div>
        <div className="absolute inset-x-4 -bottom-4 h-8 bg-ryukyu-deep-sea/10 blur-xl rounded-full -z-10"></div>
      </div>

      {/* --- ✨ タイトル・メタ情報 --- */}
      <header className="mb-8 border-b border-ryukyu-border pb-8">
        <h1 className="entry-title font-bold text-2xl md:text-4xl text-ryukyu-deep-sea mb-4">
          {post.metadata.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-ryukyu-text-light">
          <span className="flex items-center gap-1 flex-shrink-0">
            <span className="opacity-70 text-base">📅</span>
            <span className="font-medium">来店日：{post.metadata.date}</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-sky-50 text-sky-900 border border-sky-200 rounded-full px-3 py-1 font-bold text-xs whitespace-nowrap"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* --- ✨ 記事本文 --- */}
      <div className="mt-10 pb-10 font-medium slug-contents leading-relaxed text-ryukyu-deep-sea">
        <NotionRenderer blocks={blocks} />
      </div>

      {/* --- ✨ ナビゲーションエリア --- */}
      <div className="mt-0 md:mt-12 border-t border-ryukyu-border pt-10 max-w-4xl mx-auto px-0">
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* 前の記事 */}
          {prevPost ? (
            <Link href={`/posts/${prevPost.slug}`} className="group">
              <div className="h-full p-3 md:p-4 rounded-xl border border-ryukyu-border bg-white hover:bg-ryukyu-washi transition-all flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                <div className="relative w-full sm:w-24 aspect-[16/9] flex-shrink-0 overflow-hidden rounded-md border border-slate-100">
                  <img
                    src={prevPost.thumbnail}
                    alt={prevPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0 w-full sm:w-auto text-left">
                  <span className="text-[10px] md:text-xs text-ryukyu-text-light block uppercase tracking-wider mb-1">
                    ← 前の記事
                  </span>
                  <p className="text-xs md:text-sm font-bold text-ryukyu-deep-sea group-hover:text-ryukyu-coral line-clamp-2 leading-tight">
                    {prevPost.title}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {/* 次の記事 */}
          {nextPost ? (
            <Link href={`/posts/${nextPost.slug}`} className="group">
              <div className="h-full p-3 md:p-4 rounded-xl border border-ryukyu-border bg-white hover:bg-ryukyu-washi transition-all flex flex-col sm:flex-row-reverse items-center gap-4 shadow-sm">
                <div className="relative w-full sm:w-24 aspect-[16/9] flex-shrink-0 overflow-hidden rounded-md border border-slate-100">
                  <img
                    src={nextPost.thumbnail}
                    alt={nextPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0 w-full sm:w-auto text-left sm:text-right">
                  <span className="text-[10px] md:text-xs text-ryukyu-text-light block uppercase tracking-wider mb-1">
                    次の記事 →
                  </span>
                  <p className="text-xs md:text-sm font-bold text-ryukyu-deep-sea group-hover:text-ryukyu-coral line-clamp-2 leading-tight">
                    {nextPost.title}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/posts/page/1"
            className="px-10 py-3 bg-ryukyu-deep-sea text-ryukyu-washi rounded-full font-bold shadow-md hover:bg-ryukyu-coral transition-all duration-300 flex items-center gap-2"
          >
            <span>📖</span> 記事一覧に戻る
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Post;
