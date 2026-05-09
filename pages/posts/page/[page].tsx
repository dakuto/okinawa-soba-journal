import {
  getPostsByPage,
  getNumberOfPages,
  getAllTags,
  getAllPosts,
} from "../../../lib/notionAPI";
import Head from "next/head";
import React from "react";
import SinglePost from "../../../components/Post/SinglePost";
import { GetStaticPaths, GetStaticProps } from "next";
import Pagenation from "../../../components/Pagenation/Pagenation";

// --- ✨ 型定義 (TypeScriptの波線を消すための設定) ---
interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
}

interface BlogPageListProps {
  postsByPage: Post[];
  numberOfPages: number;
  currentPage: number;
  allTags: string[];
  latestPosts: Post[];
}

// ------------------------------------------------

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPages = await getNumberOfPages();

  // paramsに型を指定することで「params.push」の波線を解消
  const paths = [];
  for (let i = 1; i <= numberOfPages; i++) {
    paths.push({ params: { page: i.toString() } });
  }

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = parseInt(context.params?.page as string, 10);
  const postsByPage = await getPostsByPage(currentPage);
  const numberOfPages = await getNumberOfPages();
  const allTags = await getAllTags();
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 4);

  return {
    props: {
      postsByPage,
      numberOfPages,
      currentPage,
      allTags,
      latestPosts,
    },
    revalidate: 60,
  };
};

// コンポーネントに型引数 <BlogPageListProps> を適用
const BlogPageList: React.FC<BlogPageListProps> = ({
  postsByPage,
  numberOfPages,
  currentPage,
  allTags,
  latestPosts,
}) => {
  return (
    <div className="container mx-auto h-full w-full">
      <Head>
        <title>記事一覧 | 沖縄そば週末記</title>
        <meta name="description" content="沖縄そば巡りの記録一覧です。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-full">
        {/* デザインをLayoutのトーンに合わせた見出し */}
        <h2 className="section-title">記事一覧</h2>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-0 mb-10">
          {postsByPage.map((post) => (
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
          numberOfPages={numberOfPages}
          tag={""}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
};

export default BlogPageList;
