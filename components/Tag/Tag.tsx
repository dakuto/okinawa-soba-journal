import React from "react";
import Link from "next/link";

type Props = {
  tags: string[];
};

const Tag = ({ tags = [] }: { tags: string[] }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* tags && などを追加して、データがある時だけ実行するようにする */}
      {tags &&
        tags.map((tag: string) => (
          <Link href={`/posts/tag/${tag}/page/1`} key={tag}>
            <span className="text-sm px-3 py-1 rounded-full text-ryukyu-washi bg-ryukyu-deep-sea hover:bg-ryukyu-coral hover:text-white transition-all cursor-pointer">
              #{tag}
            </span>
          </Link>
        ))}
    </div>
  );
};
export default Tag;
