import React from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import { getAllPosts, getAllTags } from "../lib/notionAPI";

// propsの型定義
interface Props {
  allTags: string[];
  allPosts: any[];
  latestPosts: any[];
}

const PrivacyPolicy: React.FC<Props> = ({ allTags, allPosts, latestPosts }) => {
  return (
    <>
      <Head>
        <title>プライバシーポリシー | 沖縄そば週末記</title>
      </Head>

      <article className="prose prose-slate max-w-none">
        <h1 className="text-2xl font-bold text-ryukyu-deep-sea mb-8 border-b-2 border-ryukyu-coral pb-2">
          プライバシーポリシー
        </h1>

        <div className="space-y-8 text-ryukyu-deep-sea leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="text-ryukyu-coral">●</span> 広告の配信について
            </h2>
            <p className="text-sm md:text-base">
              当ブログでは、第三者配信の広告サービス（Googleアドセンスなど）を利用する可能性があります。これらはユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用することがあります。クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="text-ryukyu-coral">●</span>{" "}
              アクセス解析ツールについて
            </h2>
            <p className="text-sm md:text-base">
              当ブログでは、サイトの利用状況を把握するためにGoogleによるアクセス解析ツール「Googleアナリティクス」等を利用する場合があります。これらはトラフィックデータの収集のためにクッキー（Cookie）を使用していますが、データは匿名で収集されており、個人を特定するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="text-ryukyu-coral">●</span> 免責事項
            </h2>
            <p className="text-sm md:text-base">
              当ブログのコンテンツ・情報について、できる限り正確な情報を提供するよう努めておりますが、正確性や安全性を保証するものではありません。掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。また、当ブログからリンク等で移動した先のサイトで提供される情報、サービス等について一切の責任を負いません。
            </p>
          </section>
        </div>
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();
  const latestPosts = allPosts.slice(0, 4);

  return {
    props: {
      allPosts,
      allTags,
      latestPosts,
      hideLayout: false, // ✨ ここを false にすることで、いつものレイアウトが表示されます
    },
    revalidate: 60,
  };
};

export default PrivacyPolicy;
