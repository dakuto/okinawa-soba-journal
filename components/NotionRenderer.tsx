// components/NotionRenderer.tsx
import React from "react";

export const NotionRenderer = ({ blocks }: any) => {
  const renderBlock = (block: any): any => {
    switch (block.type) {
      case "heading_1":
        return (
          <h1 key={block.id} className="notion-h1">
            {block.heading_1.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </h1>
        );

      case "heading_2":
        return (
          <h2 key={block.id} className="notion-h2">
            {block.heading_2.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </h2>
        );

      case "heading_3":
        return (
          <h3 key={block.id} className="notion-h3">
            {block.heading_3.rich_text.map((text: any, idx: number) => (
              <span key={idx}>{text.plain_text}</span>
            ))}
          </h3>
        );

      case "paragraph":
        const texts = block.paragraph.rich_text;
        const isEmpty = texts.length === 0;

        return (
          <p key={block.id} className={isEmpty ? "my-0" : ""}>
            {isEmpty
              ? "\u00A0"
              : texts.map((text: any, idx: number) => {
                  const content = text.plain_text;
                  const href = text.text.link?.url;
                  const isBold = text.annotations?.bold;

                  return href ? (
                    <a
                      key={idx}
                      href={href}
                      className={`text-blue-600 underline ${
                        isBold ? "font-bold" : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <span key={idx} className={isBold ? "font-bold" : ""}>
                      {content}
                    </span>
                  );
                })}
          </p>
        );

      case "bulleted_list_item":
        return (
          <ul key={block.id} className="list-disc list-inside my-2">
            <li>
              {block.bulleted_list_item.rich_text.map(
                (text: any, idx: number) => (
                  <span key={idx}>{text.plain_text}</span>
                ),
              )}

              {/* ★ 子リストがある場合は再帰的に描画 */}
              {block.bulleted_list_item.children &&
                block.bulleted_list_item.children.map((child: any) => (
                  <div key={child.id} className="ml-6">
                    {renderBlock(child)}
                  </div>
                ))}
            </li>
          </ul>
        );
      case "numbered_list_item":
        return (
          <ol key={block.id} className="list-decimal list-inside my-2">
            <li>
              {block.numbered_list_item.rich_text.map(
                (text: any, idx: number) => (
                  <span key={idx}>{text.plain_text}</span>
                ),
              )}

              {/* ★ 子リストがある場合は再帰的に描画 */}
              {block.numbered_list_item.children &&
                block.numbered_list_item.children.map((child: any) => (
                  <div key={child.id} className="ml-6">
                    {renderBlock(child)}
                  </div>
                ))}
            </li>
          </ol>
        );
      case "image":
        const src =
          block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;
        return (
          <div key={block.id} className="my-4">
            <img src={src} alt="" className="w-full h-auto rounded-md" />
          </div>
        );

      case "embed":
        const embedUrl = block.embed?.url;
        if (!embedUrl) return null;
        return (
          <div key={block.id} className="my-4">
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        );

      case "divider":
        return <hr key={block.id} className="my-6 border-t border-gray-300" />;

      case "column_list":
        return renderColumnList(block);

      default:
        return null;
    }
  };

  const renderColumnList = (block: any) => {
    const columns = block.column_list?.children || [];

    return (
      <div
        key={block.id}
        className="flex flex-col lg:flex-row gap-6 lg:gap-8 my-8"
      >
        {columns.map((column: any, idx: number) => (
          <div key={idx} className="flex-1 w-full">
            {(column[column.type]?.children || []).map(renderBlock)}
          </div>
        ))}
      </div>
    );
  };

  return <>{blocks.map((block: any) => renderBlock(block))}</>;
};
