import Link from "next/link";
import React, { useState } from "react";
import {
  FaInstagram,
  FaSquareInstagram,
  FaThreads,
  FaSquareThreads,
} from "react-icons/fa6";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-ryukyu-deep-sea border-ryukyu-coral lg:bg-ryukyu-deep-sea/95 lg:backdrop-blur-sm border-b-4 shadow-md transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-ryukyu-washi">
        <div className="flex items-center justify-between h-16 lg:h-20 relative">
          {/* ロゴ */}
          <Link
            href="/"
            className="z-[60] group flex flex-col justify-center no-underline"
            onClick={closeMenu}
          >
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl sm:text-2xl font-black tracking-tighter transition-colors duration-300 ${
                  isOpen
                    ? "text-ryukyu-deep-sea"
                    : "text-ryukyu-washi group-hover:text-ryukyu-coral"
                }`}
              >
                沖縄そば
              </span>
              <span
                className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                  isOpen
                    ? "text-ryukyu-coral"
                    : "text-ryukyu-coral group-hover:text-white"
                }`}
              >
                週末記
              </span>
            </div>
            <span
              className={`text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase leading-none transition-opacity duration-300 ${
                isOpen
                  ? "text-ryukyu-deep-sea/60"
                  : "text-ryukyu-washi/70 group-hover:opacity-100"
              }`}
            >
              Okinawa Soba Journal
            </span>
          </Link>

          {/* ハンバーガーボタン */}
          <button
            onClick={toggleMenu}
            className={`block lg:hidden focus:outline-none z-[60] p-2 rounded-full transition-colors ${
              isOpen
                ? "text-ryukyu-deep-sea"
                : "text-ryukyu-washi hover:bg-white/10"
            }`}
            aria-label="メニュー開閉"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>

          {/* PC用ナビゲーション (SNSはここには入れない) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-bold hover:text-ryukyu-coral transition-colors"
            >
              ホーム
            </Link>
            <Link
              href="/about"
              className="text-sm font-bold hover:text-ryukyu-coral transition-colors"
            >
              自己紹介
            </Link>
            <Link
              href="/posts/page/1"
              className="text-sm font-bold hover:text-ryukyu-coral transition-colors"
            >
              記事一覧
            </Link>
          </div>

          {/* --- スマホ用全画面メニュー --- */}
          <div
            className={`fixed inset-0 w-screen h-screen bg-ryukyu-washi z-[55] flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${
              isOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-center gap-10 text-2xl font-bold text-ryukyu-deep-sea">
              <Link
                href="/"
                onClick={closeMenu}
                className="hover:text-ryukyu-coral transition-colors"
              >
                ホーム
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="hover:text-ryukyu-coral transition-colors"
              >
                自己紹介
              </Link>
              <Link
                href="/posts/page/1"
                onClick={closeMenu}
                className="hover:text-ryukyu-coral transition-colors"
              >
                記事一覧
              </Link>

              {/* ✨ 追加：メニュー内SNSリンクエリア */}
              <div className="flex items-center gap-8 mt-4 pt-10 border-t border-ryukyu-deep-sea/10 w-40 justify-center">
                <a
                  href="https://www.instagram.com/あなたのアカウント"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-ryukyu-deep-sea hover:text-ryukyu-coral transition-colors"
                >
                  {/*@ts-ignore*/}
                  <FaInstagram />
                </a>
                <a
                  href="https://www.threads.net/@あなたのアカウント"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-ryukyu-deep-sea hover:text-ryukyu-coral transition-colors"
                >
                  {/*@ts-ignore*/}
                  <FaThreads />
                </a>
              </div>
            </div>

            {/* メニュー下部の装飾線 */}
            <div className="absolute bottom-10 w-20 h-1 bg-ryukyu-coral rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
