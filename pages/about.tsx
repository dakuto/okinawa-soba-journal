import { getAllTags, getAllPosts } from "../lib/notionAPI";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  const allTags = await getAllTags();
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 4);

  return {
    props: {
      allTags,
      latestPosts,
      allPosts,
    },
    revalidate: 60,
  };
};

const About = ({ allTags, latestPosts }) => {
  return (
    <section className="container lg:px-2 mx-auto my-4 md:my-10">
      <Head>
        <title>私について | 沖縄そば週末記</title>
        <meta
          name="description"
          content="沖縄そば週末記の管理人の自己紹介ページです。福祉用具専門相談員としての顔、Web制作を楽しむ顔、そして無類の沖縄そば好きとしての顔を紹介します。"
        />
      </Head>

      {/* --- ヘッダーセクション（そのまま） --- */}
      <div className="mb-10 mx-auto max-w-5xl px-0 relative group">
        <div className="aspect-auto min-h-[140px] md:aspect-[3/1] w-full overflow-hidden rounded-xl shadow-xl bg-ryukyu-deep-sea flex items-center justify-start p-4 md:px-16 relative">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 md:w-80 md:h-80 opacity-10 pointer-events-none rotate-12">
            <Image
              src="/images/okinawasoba-image.png"
              alt="背景装飾"
              fill
              className="object-contain grayscale"
            />
          </div>

          <div className="relative h-20 w-20 md:h-32 md:w-32 shrink-0 rounded-full border-2 md:border-4 border-ryukyu-coral overflow-hidden bg-white shadow-inner z-10">
            <Image
              src="/images/about-image.png"
              alt="プロフィールイラスト"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="ml-4 md:ml-12 text-white relative z-20">
            <div className="flex flex-col mb-1 md:mb-2">
              <span className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-ryukyu-coral font-bold leading-none mb-1">
                About Me
              </span>
              <h1 className="text-2xl md:text-5xl font-bold tracking-wider leading-none">
                私について
              </h1>
            </div>
            <p className="text-ryukyu-washi opacity-80 text-[12px] sm:text-xs md:text-base font-medium leading-tight">
              沖縄そばと、出汁の探求と、
              <br className="sm:hidden" />
              日々の記録。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-0">
        <div className="mt-10 pb-10 font-medium slug-contents leading-relaxed text-ryukyu-deep-sea">
          {/* --- セクション1：沖縄そばへの愛（常に画像→テキスト） --- */}
          <section className="mb-16 pb-12 border-b border-ryukyu-border">
            <h2 className="section-title">🍜 このブログの管理人です</h2>

            {/* そばをすする（画像1） */}
            <div className="flex flex-col md:grid md:grid-cols-5 gap-8 items-center mb-12">
              <div className="w-full md:col-span-2 relative aspect-square rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/profile-soba.png"
                  alt="沖縄そばを豪快にすする様子"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-3">
                <p className="mb-6 text-base opacity-90">
                  はじめまして。
                  <br />
                  沖縄市を拠点に、仕事、育児、そして「沖縄そば」をライフワークにしているシングルファザーです。
                </p>
                <p className="text-base opacity-90">
                  毎週土曜日は、車内にお気に入りの
                  <span className="font-bold text-ryukyu-coral">
                    ケツメイシ
                  </span>
                  を流しながら、きままに県内の沖縄そば屋さんを訪ねています。
                  <br />
                  お店の個性豊かな出汁や麺に出会う瞬間が、何よりの癒やしです。
                </p>
              </div>
            </div>

            {/* 料理する（画像0） */}
            <div className="flex flex-col md:grid md:grid-cols-5 gap-8 items-center">
              <div className="w-full md:col-span-2 relative aspect-square rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/profile-cooking.png"
                  alt="料理をする様子"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-3">
                <p className="text-base opacity-90">
                  現在はシングルファザーとして、仕事と並行して家事全般を一人で担っています。
                  <br />
                  毎朝の娘のお弁当作りをはじめ、日々の料理で心がけているのは「頑張りすぎないこと」。
                  <br />
                  台所に立つ時間も、適度に力を抜きながら、自分ができる範囲で丁寧に向き合う。
                  <br />
                  そんな心地よいペースでの暮らしを大切にしています。
                </p>
              </div>
            </div>
          </section>

          {/* --- セクション2：仕事と趣味（スマホで画像を上にする調整） --- */}
          <section className="mb-16">
            <h2 className="section-title">🛠️ 二つの「創る」顔：福祉とWeb</h2>
            {/* A面：本職（福祉用具） */}
            <div className="flex flex-col md:grid md:grid-cols-5 gap-8 items-center mb-12 bg-white p-6 rounded-2xl shadow-sm border border-ryukyu-border">
              <div className="w-full md:col-span-2 relative aspect-square rounded-xl overflow-hidden shadow-inner bg-slate-50">
                <Image
                  src="/images/profile-work.png"
                  alt="福祉用具専門相談員として働く様子"
                  fill
                  className="object-cover md:object-contain"
                />
              </div>
              <div className="md:col-span-3">
                <h3 className="text-lg font-bold text-ryukyu-deep-sea mb-3 flex items-center gap-2">
                  <span className="text-xl">🤝</span> 本職は「福祉用具のプロ」
                </h3>
                <p className="text-base opacity-90 mb-4">
                  普段は福祉用具専門相談員として、地域の皆さまの暮らしを支えています。
                </p>
                <p className="text-sm opacity-80 leading-relaxed">
                  車椅子や介護ベッドの選定において大切なのは「その方の生活にどう寄り添うか」。この仕事で培った「調和と心配り」の精神は、ブログ運営やモノづくりの根底にあります。
                </p>
              </div>
            </div>
            {/* B面：趣味（Web制作・アプリ開発）※スマホで画像が上、PCで画像が右にくるように調整 */}
            <div className="flex flex-col md:grid md:grid-cols-5 gap-8 items-center bg-white p-6 rounded-2xl shadow-sm border border-ryukyu-border">
              {/* 画像：スマホでは1番目(上)、PCではcol-span-2を後ろへ */}
              <div className="w-full md:col-span-2 md:order-last relative aspect-square rounded-xl overflow-hidden shadow-inner bg-slate-50">
                <Image
                  src="/images/profile-web.png"
                  alt="Webサイト制作をする様子"
                  fill
                  className="object-cover md:object-contain"
                />
              </div>

              {/* テキスト：スマホでは2番目(下) */}
              <div className="md:col-span-3">
                <h3 className="text-lg font-bold text-ryukyu-deep-sea mb-3 flex items-center gap-2">
                  <span className="text-xl">💻</span>{" "}
                  趣味は「Web制作・アプリ開発」
                </h3>
                <p className="text-base opacity-90 mb-4">
                  Udemyでの学習を土台に、AIを良きパートナーとして、Next.jsやTypeScriptでのサイト制作に挑戦しています。
                </p>
                <p className="text-sm opacity-80 leading-relaxed mb-6">
                  現在はAppSheetやGASを活用し、本業の業務改善や時短ツールの自作、大好きな沖縄そば巡りのログアプリ開発など、日々の課題を「デジタルなものづくり」で解決する過程を楽しんでいます。
                </p>

                {/* 技術スタックのグリッド表示：5項目になるため、md以上では5列に調整 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Language", val: "TypeScript" },
                    { label: "Framework", val: "Next.js" },
                    { label: "Database", val: "Notion" },
                    { label: "Styling", val: "Tailwind" },
                    { label: "Low-code", val: "AppSheet" },
                  ].map((tech) => (
                    <div
                      key={tech.label}
                      className="bg-ryukyu-washi/50 p-2 rounded-lg border border-slate-100"
                    >
                      <p className="text-[10px] uppercase opacity-70 mb-0.5 font-bold leading-normal">
                        {tech.label}
                      </p>
                      <p className="font-bold text-[14px] md:text-[15px] leading-normal">
                        {tech.val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>{" "}
          </section>

          {/* Profile Summary */}
          <section className="bg-ryukyu-deep-sea text-white p-6 md:p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-ryukyu-washi/20 pb-4">
              <span className="text-xl">☕</span> Profile Summary
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              {[
                {
                  title: "活動エリア",
                  desc: "沖縄市・うるま市・北中城村などの中部エリア。週末、一杯のそばを求めて気ままに巡っています。",
                },
                {
                  title: "幸せな時間",
                  desc: "ケツメイシを聴きながら目的の店へ向かうドライブと、運ばれてくる一杯を待つ時間が大好きです。",
                },
                {
                  title: "趣味・好きなこと",
                  desc: "沖縄そば巡り、Web制作、AppSheet開発。コツコツと形にしていく作業に楽しみを感じます。",
                },
                {
                  title: "味の好みと目標",
                  desc: "強い香りの食材やてびちは少し苦手ですが、それ以外は幅広く。読んだ方の週末が少し楽しみになる発信を目指しています。",
                },
              ].map((item) => (
                <div key={item.title}>
                  <dt className="text-ryukyu-coral font-extrabold text-md mb-2">
                    {item.title}
                  </dt>
                  <dd className="text-sm leading-relaxed opacity-90 text-ryukyu-washi">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="mt-12 border-t border-ryukyu-border pt-10 flex justify-center">
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

export default About;
