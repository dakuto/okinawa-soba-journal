import React from "react";
import Link from "next/link";
import { getPageLink } from "../../lib/blog-helper";

interface Props {
  numberOfPages: number;
  tag: string;
  currentPage: number; // ← 追加
}

const Pagenation = ({ numberOfPages, tag, currentPage }: Props) => {
  // ページ番号の省略ロジック
  const createPageRange = () => {
    const delta = 1; // 現在ページの前後をどれだけ表示するか
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let last: number | undefined;

    for (let i = 1; i <= numberOfPages; i++) {
      if (
        i === 1 ||
        i === numberOfPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let page of range) {
      if (last !== undefined) {
        if (page - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (page - last > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(page);
      last = page;
    }

    return rangeWithDots;
  };

  const pagesToDisplay = createPageRange();

  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex flex-row items-center justify-center gap-4">
        {pagesToDisplay.map((page, index) =>
          page === "..." ? (
            <li key={index} className="text-gray-400">
              ...
            </li>
          ) : (
            // 抜粋：スタイルの調整とアクセシビリティの向上
            <li
              key={index}
              className={`rounded-lg w-10 h-10 relative transition-colors duration-200 ${
                page === currentPage
                  ? "bg-sky-500 shadow-md scale-110 z-10" // 現在のページ：少し大きく、明るい色に
                  : "bg-sky-900 hover:bg-ryukyu-coral" // 他のページ：ホバー時に少し明るく
              }`}
            >
              <Link
                href={getPageLink(tag, page as number)}
                className="absolute inset-0 flex items-center justify-center text-gray-100 font-bold"
              >
                {page}
              </Link>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default Pagenation;
