import React from "react";
import Link from "next/link";

type Props = {
  tags: string[];
};

// const Tag = (props: Props) => {
//   const { tags } = props;
//   return (
//     <div className="mx-0">
//       <section className="mb-8 mx-auto bg-ryukyu-washi mx-0 p-6 bg-ryukyu-washi rounded-2xl border border-ryukyu-border">
//         <div className="flex flex-wrap gap-3">
//           {tags.map((tag: string) => (
//             <Link href={`/posts/tag/${tag}/page/1`} key={tag}>
//               <span
//                 className="cursor-pointer px-4 py-1.5 font-medium text-sm rounded-full
//                              bg-white border border-ryukyu-border text-ryukyu-text
//                              hover:bg-ryukyu-coral hover:text-white hover:border-ryukyu-coral
//                              transition-all duration-300 shadow-sm inline-block"
//               >
//                 # {tag}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };
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
