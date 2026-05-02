import React, { ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaSquareInstagram,
  FaThreads,
  FaSquareThreads,
} from "react-icons/fa6";
import Tag from "../components/Tag/Tag";
import LatestPosts from "./Sidebar/LatestPosts";
import Omikuji from "./Sidebar/Omikuji";

// --- ✨ 型定義 ---
interface LayoutProps {
  children: ReactNode; // Reactの要素（ページの中身）
  allTags: string[]; // 全タグの配列
  isTopPage?: boolean; // トップページ判定（任意）
  latestPosts: any[]; // 最新記事の配列（詳細な型があればPost[]などに置換可）
  allPosts: any[]; // 全記事の配列（Omikujiで使用）
  hideLayout?: boolean; // 👈 追加：ヘッダー・フッター・サイドバーを隠すフラグ
}

// ------------------------------------------------

const Layout: React.FC<LayoutProps> = ({
  children,
  allTags,
  isTopPage,
  latestPosts,
  allPosts,
  hideLayout = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-ryukyu-washi">
      {/* Navbar の制御 */}
      {!hideLayout && <Navbar />}

      {/* トップページフラグが true の時だけメインビジュアルを表示 */}
      {isTopPage && !hideLayout && (
        <section className="w-full bg-ryukyu-washi">
          <div className="mx-auto max-w-[1200px] flex justify-center py-6 sm:py-10 px-4 md:px-0">
            <Image
              src="/images/soba_img.png"
              alt="沖縄そば"
              width={1200}
              height={560}
              style={{ objectFit: "cover" }}
              className="rounded-xl shadow-md"
              priority={true}
            />
          </div>
        </section>
      )}

      {/* メインレイアウト容器 */}
      <div className="mx-auto px-4 md:px-0 py-8 flex-grow w-full max-w-[1200px]">
        {/* hideLayout が true ならサイドバーなしの1カラム、false なら今のまま */}
        <div
          className={
            hideLayout
              ? "w-full"
              : "flex flex-col lg:flex-row gap-8 lg:items-start"
          }
        >
          {/* 左側：メインコンテンツ */}
          <main className={hideLayout ? "w-full" : "w-full lg:w-2/3 xl:w-3/4"}>
            {/* hideLayout が true なら白いカード装飾も外す（必要に応じて） */}
            <div
              className={
                hideLayout
                  ? ""
                  : "bg-white rounded-xl shadow-sm border border-ryukyu-border p-4 sm:p-8"
              }
            >
              {children}
            </div>
          </main>

          {/* 右側：サイドバー */}
          {!hideLayout && (
            <aside className="w-full lg:w-1/3 xl:w-1/4 lg:sticky lg:top-24 lg:self-start space-y-8 h-fit">
              {/* 新着記事カード */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-ryukyu-border">
                <h3 className="font-bold border-b-2 border-ryukyu-deep-sea pb-2 mb-4 text-ryukyu-text flex items-center">
                  <span className="mr-2">🍜</span> 新着記事
                </h3>
                <LatestPosts latestPosts={latestPosts} />
              </div>

              {/* 管理人について */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-ryukyu-border">
                <h3 className="font-bold border-b-2 border-ryukyu-deep-sea pb-2 mb-4 text-ryukyu-text text-center">
                  管理人について
                </h3>
                <div className="flex flex-col items-center">
                  <div className="relative w-[150px] h-[150px] mb-4">
                    <Image
                      src="/images/about-image.png"
                      alt="プロフィール"
                      fill
                      className="rounded-full object-cover border-2 border-ryukyu-border"
                    />
                  </div>
                  <p className="text-sm text-ryukyu-text-light leading-relaxed mb-4 text-justify">
                    カツオ出汁の沖縄そばを愛してやまない管理人の秀範です。地元沖縄の味をじっくりと紹介します。
                  </p>
                  <div className="flex items-center gap-6">
                    <a
                      href="https://www.instagram.com/norys_001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl text-[#e4405f] hover:scale-110 transition-transform duration-300"
                    >
                      {/*@ts-ignore*/}
                      <FaSquareInstagram />
                    </a>
                    <a
                      href="https://www.threads.net/@norys_001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl text-black hover:scale-110 transition-transform duration-300"
                    >
                      {/*@ts-ignore*/}
                      <FaSquareThreads />
                    </a>
                  </div>
                </div>
              </div>

              {/* タグ検索カード */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-ryukyu-border">
                <h3 className="font-bold border-b-2 border-ryukyu-deep-sea pb-2 mb-4 text-ryukyu-text flex items-center">
                  <span className="mr-2">🔍</span> タグから探す
                </h3>
                <div className="mx-0 p-4 bg-ryukyu-washi rounded-xl border border-ryukyu-border">
                  <Tag tags={allTags} />
                </div>
              </div>

              {/* おみくじカード */}
              {isTopPage && <Omikuji posts={allPosts} />}
            </aside>
          )}
        </div>
      </div>

      {!hideLayout && (
        <footer className="py-12 bg-ryukyu-deep-sea text-ryukyu-washi border-t-4 border-ryukyu-coral">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* サイト名とコピーライト */}
              <div className="text-center md:text-left">
                <p className="font-bold text-lg mb-1">沖縄そば日誌</p>
                <p className="text-xs opacity-70">
                  © {new Date().getFullYear()} 沖縄そば日誌. All rights
                  reserved.
                </p>
              </div>

              {/* SNSアイコンエリア */}
              <div className="flex items-center gap-6">
                <a
                  href="https://www.instagram.com/norys_001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-ryukyu-coral transition-colors duration-300"
                >
                  {/*@ts-ignore*/}
                  <FaInstagram />
                </a>
                <a
                  href="https://www.threads.net/@norys_001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-ryukyu-coral transition-colors duration-300"
                >
                  {/*@ts-ignore*/}
                  <FaThreads />
                </a>
              </div>

              {/* リンクエリア */}
              <div className="flex flex-col md:items-end gap-2 text-sm">
                <Link
                  href="/privacy-policy"
                  className="hover:text-ryukyu-coral transition-colors underline underline-offset-4 decoration-ryukyu-coral/30"
                >
                  プライバシーポリシー
                </Link>
                <Link
                  href="/about"
                  className="hover:text-ryukyu-coral transition-colors"
                >
                  自己紹介
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
