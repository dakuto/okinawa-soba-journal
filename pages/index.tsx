import { getAllTags, getPostForTopPage, getAllPosts } from "../lib/notionAPI";
import Head from "next/head";
import React from "react";
import SinglePost from "../components/Post/SinglePost";
import Image from "next/image";
import { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";

// --- ✨ 型定義 ---
interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail: string;
}

interface HomeProps {
  fourPosts: Post[];
  allTags: string[];
  allPosts: Post[]; // Omikujiで使用する全記事の配列
  isTopPage: boolean; // トップページフラグ
}

// ------------------------------------------------

export const getStaticProps: GetStaticProps = async () => {
  const fourPosts = await getPostForTopPage();
  const allTags = await getAllTags();
  const allPosts = await getAllPosts();

  return {
    props: {
      fourPosts,
      latestPosts: fourPosts,
      allTags,
      allPosts, // Omikujiで使用する全記事の配列
      isTopPage: true, // Layout側でメインビジュアルを表示するためのフラグ
    },
    revalidate: 60,
  };
};

export default function Home({
  fourPosts,
  allTags,
  allPosts,
  isTopPage,
}: HomeProps) {
  if (!fourPosts) {
    return (
      <div className="text-center py-20 text-ryukyu-deep-sea">
        読み込み中...
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <Head>
          <title>沖縄そば日誌 | カツオ出汁を巡る食べ歩き記録</title>
          <meta
            name="description"
            content="沖縄市・うるま市を中心に、カツオ出汁ベースの沖縄そばをこよなく愛する管理人の食べ歩きブログです。"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="container w-full">
          {/* --- ✨ 導入文エリア --- */}
          <section className="mb-16 mt-4 max-w-4xl mx-auto">
            <div className="bg-ryukyu-washi border-2 border-ryukyu-border rounded-xl p-5 md:p-12 shadow-sm relative overflow-hidden">
              {/* 装飾用の背景画像 */}
              <div className="absolute bottom-[2rem] md:-bottom-[4rem] -right-[3rem] w-[15rem] md:w-[18rem] lg:w-[20rem] aspect-square opacity-[0.08] rotate-[-15deg] select-none pointer-events-none">
                <Image
                  src="/images/okinawasoba-image.png"
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>

              <div className="relative z-10 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-ryukyu-deep-sea mb-8 tracking-wider flex items-center justify-center gap-3">
                  <span className="h-1 w-8 bg-ryukyu-coral"></span>
                  沖縄の風土と、カツオ出汁の香りに誘われて。
                  <span className="h-1 w-8 bg-ryukyu-coral"></span>
                </h1>

                <div className="space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
                  <p className="inline-block">
                    毎週土曜日、中部地域（沖縄市・うるま市・北中城村
                    etc...）を中心に、
                    <br className="hidden sm:inline" />
                    昔ながらの
                    <span className="font-bold text-ryukyu-deep-sea border-b-2 border-ryukyu-coral/30">
                      「カツオベース」
                    </span>
                    をメインにして沖縄そばを求めて食べ歩いています。
                  </p>
                  <p className="inline-block">
                    1杯のそばに込められた店主のこだわりや、お店の温かな雰囲気を、
                    <br className="hidden sm:inline" />
                    一人のそば好きの視点で綴る個人ブログです。
                  </p>
                  <p className="font-medium text-ryukyu-deep-sea pt-4 text-center">
                    今日のランチに迷ったら、ぜひ参考にしてみてください。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- ✨ 新着記事セクション --- */}
          <div className="maincontents">
            <h2 className="section-title">新着記事</h2>

            <div className="cardcontents grid grid-cols-1 md:grid-cols-2 gap-8 mx-0 mb-10">
              {fourPosts.map((post) => (
                <div className="h-full" key={post.id}>
                  <SinglePost
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    tags={post.tags}
                    slug={post.slug}
                    isPageList={false}
                    thumbnail={post.thumbnail}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- ✨ ボタンエリア --- */}
          <div className="flex justify-center mb-16">
            <Link
              href="/posts/page/1"
              className="px-10 py-3 bg-ryukyu-deep-sea text-ryukyu-washi rounded-full font-bold shadow-md hover:bg-ryukyu-coral transition-all duration-300 flex items-center gap-2 group"
            >
              記事一覧へ
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
