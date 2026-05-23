import React from "react";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  isPageList?: boolean;
  thumbnail: string;
  tagCounts?: Record<string, number>; // ✨ 追加: 各タグの件数データ（例: { "沖縄市": 6, "うるま市": 4 }）
};

const SinglePost = (props: Props) => {
  const {
    title,
    description,
    date,
    tags,
    slug,
    thumbnail,
    tagCounts = {},
  } = props;

  return (
    <div className="w-full flex h-full">
      <section className="w-full border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col h-full overflow-hidden">
        {/* 上部コンテンツエリア */}
        <Link
          href={`/posts/${slug}`}
          className="block relative w-full aspect-video overflow-hidden"
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex gap-3 items-center">
            {/* <h3 className="card-title">
              <Link href={`/posts/${slug}`}>{title}</Link>
            </h3> */}
            <div className="text-slate-500 text-sm mb-3">{date}</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string, index: number) => {
                // ✨ 追加: このタグの件数を取得
                const count = tagCounts[tag] || 0;

                return (
                  <Link href={`/posts/tag/${tag}/page/1`} key={index}>
                    <span className="text-slate-600 bg-slate-100 border border-slate-200 rounded-xl px-2 py-0.5 text-xs font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-1">
                      #{tag}
                      {/* ✨ 追加: 件数があれば表示 */}
                      {count > 0 && (
                        <span className="text-[10px] opacity-75">
                          ({count})
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <p className="text-slate-600 text-base leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          <div className="mt-auto">
            <Link href={`/posts/${slug}`}>
              <button
                className="px-5 py-3 bg-ryukyu-deep-sea text-ryukyu-washi rounded-full font-bold shadow-md hover:bg-ryukyu-coral transition-colors duration-300 flex items-center gap-2"
                type="button"
              >
                続きを読む
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SinglePost;
