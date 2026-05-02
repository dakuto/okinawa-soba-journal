import Link from "next/link";
import React from "react";

const LatestPosts = ({ latestPosts = [] }: any) => {
  return (
    <div className="space-y-5">
      {latestPosts?.map((post: any) => (
        <Link
          href={`/posts/${post.slug}`}
          key={post.id}
          className="group block"
        >
          <div className="flex gap-3">
            {/* サムネイル画像（左側） */}
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-ryukyu-border">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* テキスト情報（右側） */}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-ryukyu-text-light mb-1">
                {post.date}
              </span>
              <h4 className="text-sm font-bold text-ryukyu-deep-sea group-hover:text-ryukyu-coral line-clamp-2 leading-snug mb-1">
                {post.title}
              </h4>
              <p className="text-[11px] text-gray-500 truncate">
                {post.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LatestPosts;
