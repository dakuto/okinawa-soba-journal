import React from "react";
import Link from "next/link";

// プロパティの型定義を修正
type Props = {
  tags: string[];
  tagCounts?: Record<string, number>; // ✨ 追加: 各タグの件数データ（例: { "沖縄市": 6, "うるま市": 4 }）
};

const Tag = ({ tags = [], tagCounts = {} }: Props) => {
  return (
    <div className="flex flex-wrap gap-3">
      {tags &&
        tags.map((tag: string) => {
          const count = tagCounts[tag] || 0;

          return (
            <Link href={`/posts/tag/${tag}/page/1`} key={tag}>
              <span className="text-sm px-3 py-1 rounded-full text-ryukyu-washi bg-ryukyu-deep-sea hover:bg-ryukyu-coral hover:text-white transition-all cursor-pointer inline-flex items-center gap-1">
                #{tag}
                {count > 0 && (
                  <span className="text-xs opacity-80 mb-1">({count})</span>
                )}
              </span>
            </Link>
          );
        })}
    </div>
  );
};

export default Tag;
